// // import React, { useState, useEffect, useContext } from 'react';
// // import { Link } from 'react-router-dom';
// // import {FaComment} from 'react-icons/fa';
// // import {FaEye} from 'react-icons/fa';
// // import {ImArrowDown} from 'react-icons/im';
// // import {ImArrowUp} from 'react-icons/im';
// // import { ImgurContext } from './Context/ImgurContext';
// // import { toast } from 'react-toastify';
// // import 'react-toastify/dist/ReactToastify.css';
// // import { ToastContainer } from 'react-toastify';

// // function PostsSection() {
// //     const [posts, setPosts] = useState([]);
// //     const {LikePost,  UnLikePost,  handleView} = useContext(ImgurContext);     

// //     useEffect(() => {
// //         fetchPosts();
// //     }, []);

// //     const fetchPosts = async () => {
// //         try {
// //             const response = await fetch('http://localhost:3007/post');
// //             const data = await response.json();
// //             const sortedData = data.sort((a, b) => new Date (b.date) - new Date(a.date));
// //             setPosts(sortedData);
// //         } catch (error) {
// //             console.error('Error fetching posts:', error);
// //         }
// //     };

// //     const handleImageClick = (_id) => {
// //       // Call the handleView function with the _id parameter to increment the view count
// //       handleView(_id);
// //       // console.log("_id parameter received:", _id);
// //   };

// //     // Function to truncate text to 15 characters
// //     const truncateText = (text) => {
// //       return text.length > 100 ? text.slice(0, 88) + '...' : text;
// //   };

// //   const handleLikeClick = (postId) => {
// //     console.log("Like button clicked for post ID:", postId);
// //     LikePost(postId);
// // };

// // const handleUnlikeClick = (postId) => {
// //     console.log("Unlike button clicked for post ID:", postId);
// //     UnLikePost(postId);
// // };

// // console.log('Rendering PostsSection component');

// //     return (
// //         <div className="row mt-3">
// //           {posts.map((data) => (
// //              !data.hidden && (
// //             <div key={data._id} className={`post-item col-lg-4 col-md-6 mb-3 ${data._id}`}>
// //               <div className="bg-successes bg-height p-3">
// //                 <div className="product-title pb-3 text-white">{data.title}</div>
// //               </div>
// //               <Link to={`postDetails/${data._id}`} className="post-link" onClick={() => handleImageClick(data._id)}>
// //                 <img src={data.image} className="img-fluid d-block w-100" alt="Post Image"  />
// //               </Link>
// //               <div className="bg-successes p-3">
// //               <div className="product-description pb-3 text-white">{truncateText(data.description)}</div>
// //               </div>
// //                 <div className="icons d-flex justify-content-between text-white bg-successes p-3">
// //                   <div className="like-buttons">
// //                     {/* <ImArrowUp className="like-button" onClick={() => LikePost(data._id)} /> */}
// //                     <ImArrowUp className="like-button" onClick={() => { console.log('Like button clicked'); handleLikeClick(data._id); }} />
// //                     <span className="like-count p-2">{data.likes.length}</span>
// //                     {/* <ImArrowDown className="like-button" onClick={() => UnLikePost(data._id)} /> */}
// //                     <ImArrowDown className="like-button" onClick={() => { console.log('Unlike button clicked'); handleUnlikeClick(data._id); }} />
// //                   </div>
// //                   <div ><FaComment /> {data?.comments?.length}</div>
// //                   <div ><FaEye /> {data.views}</div>
// //                 </div>
// //               <ToastContainer />
// //             </div>
// //              )
// //           ))}
// //         </div>
// //       );
// // }

// // export default PostsSection;

// import React, { useState, useEffect, useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { FaComment, FaEye } from 'react-icons/fa';
// import { ImArrowDown, ImArrowUp } from 'react-icons/im';
// import { ImgurContext } from './Context/ImgurContext';
// import { useDispatch, useSelector } from 'react-redux';
// import { likePost, unlikePost } from '../reducer/actions';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function PostsSection() {
//     const [posts, setPosts] = useState([]);
//     const dispatch = useDispatch();
//     const reduxPosts = useSelector(state => state.posts);
//     const {handleView, userID} = useContext(ImgurContext); 
//     const [viewCount, setViewCount] = useState(0);

//     useEffect(() => {
//         fetchPosts();
//     }, []);

//     const fetchPosts = async () => {
//         try {
//             // const response = await fetch('http://localhost:3007/post');
//             const response = await fetch('https://imgurif-api.onrender.com/api/post');
//             const data = await response.json();
//             const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
//             setPosts(sortedData);
//             dispatch({ type: 'SET_POSTS', payload: sortedData }); // Dispatch action to set posts in Redux
//         } catch (error) {
//             console.error('Error fetching posts:', error);
//         }
//     };

//     // const handleImageClick = (_id) => {
//     //     // Call the handleView function with the _id parameter to increment the view count
//     //     console.log('Handle image click for post ID:', _id);
//     //     handleView(_id);
//     //     // console.log("_id parameter received:", _id);
       
//     // };

//     const truncateText = (text) => {
//         return text.length > 100 ? text.slice(0, 88) + '...' : text;
//     };

//     const handleImageClick = (_id) => {
//       // Call the handleView function with the _id parameter to increment the view count
//       console.log('Handle image click for post ID:', _id);
//       handleView(_id).then((data) => {
//           console.log('View count after increment:', data.viewCount);
//           setViewCount(data.viewCount);
//       });
//   };
  
//   // After dispatching actions for like and unlike, log the response from the server
//   const handleLikeClick = (postId) => {
//     console.log("Like button clicked for post ID:", postId);
//     dispatch(likePost(postId, userID)).then((response) => {
//         console.log('LikePost response:', response);
//         // If the response contains the updated view count, update the view count state
//         if (response && response.viewCount !== undefined) {
//             setViewCount(response.viewCount);
//         }
//     });
// };

  
// const handleUnlikeClick = (postId) => {
//   console.log("Unlike button clicked for post ID:", postId);
//   dispatch(unlikePost(postId, userID)).then((response) => {
//       console.log('UnlikePost response:', response);
//       // If the response contains the updated view count, update the view count state
//       if (response && response.viewCount !== undefined) {
//           setViewCount(response.viewCount);
//       }
//   });
// };

  
//     // console.log('Rendering PostsSection component');
//     console.log('Rendering PostsSection component');
//     console.log('Posts:', posts);
//     console.log('View count:', viewCount);

//     return (
//       <div className="row mt-3">
//           {posts.map((data) => (
//               !data.hidden && (
//                   <div key={data._id} className={`post-item col-lg-4 col-md-6 mb-3 ${data._id}`}>
//                       <div className="bg-successes bg-height p-3">
//                           <div className="product-title pb-3 text-white">{data.title}</div>
//                       </div>
//                       <Link to={`postDetails/${data._id}`} className="post-link" onClick={() => handleImageClick(data._id)}>
//                           <img src={data.image} className="img-fluid d-block w-100" alt="Post Image" />
//                       </Link>
//                       <div className="bg-successes p-3">
//                           <div className="product-description pb-3 text-white">{truncateText(data.description)}</div>
//                       </div>
//                       <div className="icons d-flex justify-content-between text-white bg-successes p-3">
//                           <div className="like-buttons">
//                               <ImArrowUp className="like-button" onClick={() => handleLikeClick(data._id)} />
//                               <span className="like-count p-2">{data.likes.length}</span>
//                               <ImArrowDown className="like-button" onClick={() => handleUnlikeClick(data._id)} />
//                           </div>
//                           <div><FaComment /> {data?.comments?.length}</div>
//                           <div><FaEye /> {data.views}</div>
//                       </div>
//                       <ToastContainer />
//                   </div>
//               )
//           ))}
//       </div>
//   );
// }

// export default PostsSection;

// src/components/PostsSection.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaComment, FaEye } from 'react-icons/fa';
import { ImArrowDown, ImArrowUp } from 'react-icons/im';
import { ImgurContext } from './Context/ImgurContext';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, unlikePost } from '../reducer/actions';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PostsSection() {
    const [posts, setPosts] = useState([]);
    const dispatch = useDispatch();
    const reduxPosts = useSelector(state => state.posts);
    const { handleView, userID } = useContext(ImgurContext); 
    const [viewCount, setViewCount] = useState(0);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch('https://imgurif-api.onrender.com/api/post');
            const data = await response.json();
            const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setPosts(sortedData);
            dispatch({ type: 'SET_POSTS', payload: sortedData });
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const truncateText = (text) => {
        return text.length > 100 ? text.slice(0, 88) + '...' : text;
    };

    const handleImageClick = (_id) => {
        handleView(_id).then((data) => {
            setViewCount(data.viewCount);
        });
    };

    const handleLikeClick = (postId) => {
        dispatch(likePost(postId, userID)).then((response) => {
            if (response && response.viewCount !== undefined) {
                setViewCount(response.viewCount);
            }
        });
    };

    const handleUnlikeClick = (postId) => {
        dispatch(unlikePost(postId, userID)).then((response) => {
            if (response && response.viewCount !== undefined) {
                setViewCount(response.viewCount);
            }
        });
    };

    return (
        <div className="row mt-3">
            {posts.map((data) => (
                !data.hidden && (
                    <div key={data._id} className={`post-item col-lg-4 col-md-6 mb-3 ${data._id}`}>
                        <div className="bg-successes bg-height p-3">
                            <div className="product-title pb-3 text-white">{data.title}</div>
                        </div>
                        <Link to={`postDetails/${data._id}`} className="post-link" onClick={() => handleImageClick(data._id)}>
                            <img src={data.image} className="img-fluid d-block w-100" alt="Post Image" />
                        </Link>
                        <div className="bg-successes p-3">
                            <div className="product-description pb-3 text-white">{truncateText(data.description)}</div>
                        </div>
                        <div className="icons d-flex justify-content-between text-white bg-successes p-3">
                            <div className="like-buttons">
                                <ImArrowUp className="like-button" onClick={() => handleLikeClick(data._id)} />
                                <span className="like-count p-2">{data.likes.length}</span>
                                <ImArrowDown className="like-button" onClick={() => handleUnlikeClick(data._id)} />
                            </div>
                            <div className="comment-icon">
                                <FaComment className="me-2" />
                                {data.comments.length}
                            </div>
                            <div className="view-icon">
                                <FaEye className="me-2" />
                                {data.views}
                            </div>
                        </div>
                    </div>
                )
            ))}
            <ToastContainer />
        </div>
    );
}

export default PostsSection;
