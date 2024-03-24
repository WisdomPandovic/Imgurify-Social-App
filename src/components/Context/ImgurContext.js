

import { useState, useEffect, createContext } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useParams} from "react-router-dom";
import axios from "axios";

export const ImgurContext = createContext();

function ImgurProvider(props) {
  const [userID, setUserID] = useState(null);
  const [likes, setLikes] = useState([]);
  const [dislike, setDislike] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  // console.log("Likes in context:", likes);
  // console.log("Context value:", { userID, likes, dislike, isLoggedIn });
  // console.log("userID in ImgurContext:", userID);
  // console.log("isLoggedIn in ImgurContext:", isLoggedIn);
  const { _id } = useParams();


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
    // Check if the user is logged in
    if (!isLoggedIn) {
      toast.error("You need to sign in to like the post.");
      return;
    }
  
    // Check if the user ID is set correctly
    if (!userID ) {
      console.error("User ID is not set correctly.");
      toast.error("User ID is not set correctly.");
      return;
    }
  
    const loggedin = {
      user: userID,
    };
  
    try {
      const response = await axios.put(
        `http://localhost:3007/likes/${_id}`,
        loggedin
      );
  
      // Check for network errors
      if (response.status !== 200) {
        throw new Error("Failed to like the post. Please try again later.");
      }
  
      // Check for specific error cases
      if (response.data.msg === "Post already liked by this user") {
        toast.error("Post already liked by this user.");
        return;
      }
  
      // Update likes if successful
      setLikes((prevLikes) => {
        return prevLikes.map((like) => {
          if (like._id === _id) {
            return { ...like, likes: like.likes + 1 };
          }
          return like;
        });
      });
  
      toast.success("Post has been liked.");
    } catch (error) {
      console.error("Error liking the post:", error.message);
      toast.error("An error occurred while liking the post.");
    }
  };
  

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
      "http://localhost:3007/unlike/" + _id,
      loggedin
    );
    console.log(response);

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
      toast.success("You have unliked this post");
    }
  } catch (error) {
    console.log(error);
  }
}


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

    fetch(`http://localhost:3007/post/${_id}/increment-view`, {
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


  return (
    <ImgurContext.Provider value={{LikePost,  UnLikePost, userID, setUserID, likes, setLikes, dislike, setDislike, isLoggedIn, setIsLoggedIn,
      viewCount,
      handleView, }}>
      {props.children}
    </ImgurContext.Provider>
  );
}

export default ImgurProvider;
