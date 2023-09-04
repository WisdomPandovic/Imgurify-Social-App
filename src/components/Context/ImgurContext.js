// import { useState, createContext } from "react";

// export const ImgurContext = createContext();

// function ImgurProvider(props) {
//     const [login, setLogin] = useState({});
//     const [online, setOnline] = useState(false)
//     const [userID, setUserID] = useState(null)
//     const [likes, setLikes] = useState([]);
//     const [dislike, setDislike] = useState();;
//     const [isLoggedIn, setIsLoggedIn] = useState(false);

//     console.log("Likes in context:", likes);
//     console.log("Context value:", { login, online, userID, likes, dislike, isLoggedIn });
//     console.log("userID in ImgurContext:", userID);

//     useEffect(() => {
//         // Fetch likes data here and update the likes state
//         fetch("http://localhost:3007/likes/")
//           .then((response) => response.json())
//           .then((data) => {
            
//             setLikes(data);
//           })
//           .catch((error) => {
//             console.error("Error fetching likes data:", error);
//           });
//       }, []);

//     return <ImgurContext.Provider value={{login, setLogin, online, setOnline, userID, setUserID, likes, setLikes, dislike, setDislike, isLoggedIn, setIsLoggedIn}}>{props.children}</ImgurContext.Provider>

// }

// export default ImgurProvider;

import { useState, useEffect, createContext } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import {useParams} from "react-router-dom";
import axios from "axios";

export const ImgurContext = createContext();

function ImgurProvider(props) {
  const [userID, setUserID] = useState(null);
  const [likes, setLikes] = useState([]);
  const [dislike, setDislike] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  console.log("Likes in context:", likes);
  console.log("Context value:", { userID, likes, dislike, isLoggedIn });
  console.log("userID in ImgurContext:", userID);
  const { _id } = useParams();


  useEffect(() => {
    if(localStorage){
      let rawData = localStorage.getItem("Imgur_USER")
      let localData = JSON.parse(rawData)
      setUserID(localData)
    }
  
  },[]);
 
//   const LikePost = async (_id) => {
//     try {
//       const response = await fetch(`http://localhost:3007/likes/${_id}`);
//       const data = await response.json();
//       console.log(data)

//       if (response.status === 200) {
//         if (data.msg === "Post already liked by this user") {
//           console.log("Post already liked by this user:", data.msg);
//           toast.error(data.msg);
//         } else {
//           setLikes(data);
//         }
//       } else {
//         toast.error("An error occurred while fetching likes data.");
//       }
//     } catch (error) {
//       console.error("Error fetching likes data:", error);
//     }
//   };

const LikePost = async (_id) => {
    if (!isLoggedIn) {
      toast.success("You need to sign in to like the post.");
      return;
    }
  
    if (!userID) {
      console.error("userID is not set correctly.");
      return;
    }
  
    const loggedin = {
      user: userID.data.id,
    };

  
    try {
      const response = await axios.put(`http://localhost:3007/likes/${_id}`, loggedin);
      console.log(response);
  
      if (response.status === 200) {
        if (response.data.msg === "Post already liked by this user") {
          console.log("Post already liked by this user:", response.data.msg);
          toast.error(response.data.msg);
        } else {
          setLikes((prevLikes) => {
            return prevLikes.map((like) => {
              if (like._id === _id) {
                return { ...like, likes: like.likes + 1 };
              }
              return like;
            });
          });
          toast.success("Post has been liked");
        }
      } else {
        toast.error("An error occurred while liking the post.");
      }
    } catch (err) {
      console.log(err);
    }
  };
  

  async function UnLikePost(_id) {
    if (!userID) {
      console.error("userID is not set correctly.");
      return;
    }

    const loggedin = {
      user: userID.data.id,
      // user: userID
    };
  
    try {
      const response = await axios.put('http://localhost:3007/unlike/' + _id, loggedin);
      console.log(response);
      
      if (response.data.msg === "User has not liked this post") {
        toast.error(response.data.msg);
      } else if (response.status === 200) {
        setLikes(prevLikes => {
          return prevLikes.map(like => {
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

  useEffect(() => {
    // LikePost(_id); 
    UnLikePost(_id);
  }, []); 

  return (
    <ImgurContext.Provider value={{LikePost,  UnLikePost, userID, setUserID, likes, setLikes, dislike, setDislike, isLoggedIn, setIsLoggedIn }}>
      {props.children}
    </ImgurContext.Provider>
  );
}

export default ImgurProvider;
