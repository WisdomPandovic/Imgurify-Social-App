

import { useState, useEffect, createContext } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";
import axios from "axios";

export const ImgurContext = createContext();

function ImgurProvider(props) {
  const [userID, setUserID] = useState(null);
  const [likes, setLikes] = useState([]);
  const [dislike, setDislike] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  const [ReplyLikes, setReplyLikes] = useState([]);

  // console.log("Likes in context:", likes);
  // console.log("Context value:", { userID, likes, dislike, isLoggedIn });
  // console.log("userID in ImgurContext:", userID);
  // console.log("isLoggedIn in ImgurContext:", isLoggedIn);

  // console.log("userID in ImgurProvider:", userID);
  // console.log("likes in ImgurProvider:", likes);
  // console.log("dislike in ImgurProvider:", dislike);
  // console.log("isLoggedIn in ImgurProvider:", isLoggedIn);
  // console.log("viewCount in ImgurProvider:", viewCount);
  // console.log("ReplyLikes in ImgurProvider:", ReplyLikes);
  // console.log("isVisible in ImgurProvider:", isVisible);

  const { _id } = useParams();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const rawData = localStorage.getItem("Imgur_USER");
    if (rawData) {
      const localData = JSON.parse(rawData);
      // setUserID(localData?.user?.id || '');
      setUserID(localData?.user?._id || '');
      // console.log("UserID after setting:", userID);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  async function LikePost(_id) {
    console.log("LikePost function called with _id:", _id);

     // API call will follow
  console.log("Sending request to API...");
  
    // Check if the user is logged in
    if (!isLoggedIn) {
      toast.error("You need to sign in to like the post.");
      return;
    }
  
    // Check if the user ID is set correctly
    if (!userID) {
      console.error("User ID is not set correctly.");
      toast.error("User ID is not set correctly.");
      return;
    }
  
    const loggedin = {
      user: userID,
    };
  
    try {
      const response = await axios.put(
        `https://imgurif-api.onrender.com/api/likes/${_id}`,
        loggedin
      );

      console.log("API Response:", response);
  
      console.log("LikePost response:", response.data);
  
      // Check for network errors
      if (response.status !== 200) {
        throw new Error("Failed to like the post. Please try again later.");
      }
  
      // Check for specific error messages from the backend
      if (response.data.message === "Post already liked by this user") {
        toast.error("Post already liked by this user.");
        return;
      }
  
      // Response structure is an array with the post ID
      const likedPostId = response.data[0];
      console.log("Liked post ID:", likedPostId);
  
      // Check if the liked post ID matches the current post _id
      if (likedPostId === _id) {
        // Update likes if successful
        setLikes((prevLikes) => {
          const updatedLikes = prevLikes.map((like) => {
            if (like._id === _id) {
              // Log the previous like count for debugging
              console.log("Previous like count:", like.likes);
              return { ...like, likes: like.likes + 1 }; // Increment likes
            }
            return like;
          });
  
          // Log the updated likes state for debugging
          console.log("Updated likes state:", updatedLikes);
  
          return updatedLikes; // Return updated state
        });
  
        toast.success("Post has been liked.");
      } else {
        toast.error("Failed to like the post. Please try again.");
      }
    } catch (error) {
      console.error("Error liking the post:", error.message);
      toast.error("An error occurred while liking the post.");
    }
  }
  
  
  
  

  async function UnLikePost(_id) {
    if (!userID) {
      console.error("userID is not set correctly.");
      return;
    }

    const loggedin = {
      user: userID,
    };

    try {
      const response = await axios.put(
        "https://imgurif-api.onrender.com/api/unlike/" + _id,
        loggedin
      );
      console.log("Unlike response:", response.data); // Log response for debugging

      if (response.data.msg === "User has not liked this post") {
        toast.error(response.data.msg);
      } else if (response.status === 200) {
        setLikes((prevLikes) => {
          return prevLikes.map((like) => {
            if (like._id === _id) {
              return { ...like, likes: like.likes - 1 };
            }
            return like;
          });
        });
        console.log("Updated likes state:", likes);
        toast.success("You have unliked this post");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    console.log("Updated likes state:", likes);
  }, [likes]);

  useEffect(() => {
    console.log("ReplyLikes state updated:", ReplyLikes);
  }, [ReplyLikes]);

  useEffect(() => {
    console.log("isVisible state updated:", isVisible);
  }, [isVisible]);

  // useEffect(() => {
  //   // LikePost(_id); 
  //   UnLikePost(_id);
  // }, []); 

  const handleView = (_id) => {
    if (!_id) {
      console.log('Missing _id parameter');
      return;
    }

    if (!isLoggedIn) {
      console.log('No User logged in');
      return;
    }

    // console.log(_id);
    const userData = JSON.parse(localStorage.getItem("Imgur_USER"));
    const userId = userData?.data?.id;

    fetch(`https://imgurif-api.onrender.com/api/post/${_id}/increment-view`, {
      method: 'POST',
    })
      .then((resp) => resp.json())
      .then((data) => {
        // console.log('View count after increment:', data.viewCount);
        setViewCount(data.viewCount);
      })
      .catch((error) => {
        console.error('Error incrementing view count:', error);
      });
  };


  async function LikeComment(postId, commentId) {
    // Check if the user is logged in
    if (!isLoggedIn) {
      toast.error("You need to sign in to like the post.");
      return;
    }

    // Check if the user ID is set correctly
    if (!userID) {
      console.error("User ID is not set correctly.");
      toast.error("User ID is not set correctly.");
      return;
    }

    const loggedin = {
      user: userID,
    };

    try {
      const response = await axios.put(
        `https://imgurif-api.onrender.com/api/replylikes/${postId}/${commentId}`,
        loggedin
      );

      // Check for network errors
      if (response.status !== 200) {
        throw new Error("Failed to like the comment. Please try again later.");
      }

      // Check for specific error cases
      if (response.data.msg === "Comment already liked by this user") {
        toast.error("Comment already liked by this user.");
        return;
      }

      // Log response for debugging
      console.log("Like response:", response.data);

      // Check if response.data contains the correct ID
      console.log("Response ID:", response.data[0]);

      // Check the structure of _id in your likes state
      console.log("Current _id:", _id);

      // Compare both values
      console.log("Do response ID and current _id match?", response.data[0] === _id);

      // Update likes if successful
      setReplyLikes((prevLikes) => {
        return prevLikes.map((like) => {
          if (like._id === _id) {
            return { ...like, likes: like.likes + 1 };
          }
          return like;
        });
      });

      toast.success("Comment has been liked.");
    } catch (error) {
      console.error("Error liking the comment:", error.message);
      toast.error("An error occurred while liking the comment.");
    }
  };

  async function UnLikeComment(postId, commentId) {
    if (!userID) {
      console.error("userID is not set correctly.");
      return;
    }

    const loggedin = {
      user: userID,
    };

    try {
      const response = await axios.put(
        `https://imgurif-api.onrender.com/api/replyunlikes/${postId}/${commentId}`,
        loggedin
      );
      console.log("Unlike response:", response.data); // Log response for debugging

      if (response.data.msg === "User has not liked this comment") {
        toast.error(response.data.msg);
      } else if (response.status === 200) {
        setReplyLikes((prevLikes) => {
          return prevLikes.map((like) => {
            if (like._id === _id) {
              return { ...like, likes: like.likes - 1 };
            }
            return like;
          });
        });
        console.log("Updated likes state:", likes);
        toast.success("You have unliked this comment");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Show the back-to-top button when scrolling down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <ImgurContext.Provider value={{
      LikePost, UnLikePost, userID, setUserID, likes, setLikes, dislike, setDislike, isLoggedIn, setIsLoggedIn,
      viewCount,
      handleView, ReplyLikes, setReplyLikes, LikeComment, UnLikeComment, scrollToTop, isVisible
    }}>
      {props.children}
    </ImgurContext.Provider>
  );
}

export default ImgurProvider;
