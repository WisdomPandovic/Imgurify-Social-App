// import React, { useState, useEffect, useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { FaEye } from 'react-icons/fa';
// import { FaMessage } from "react-icons/fa6";
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
//     const { handleView, userID } = useContext(ImgurContext); 
//     const [viewCount, setViewCount] = useState(0);

//     useEffect(() => {
//         fetchPosts();
//     }, []);

//     const fetchPosts = async () => {
//         try {
//             const response = await fetch('https://imgurif-api.onrender.com/api/post');
//             const data = await response.json();
//             const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
//             setPosts(sortedData);
//             dispatch({ type: 'SET_POSTS', payload: sortedData });
//         } catch (error) {
//             console.error('Error fetching posts:', error);
//         }
//     };

//     const truncateText = (text) => {
//         return text.length > 100 ? text.slice(0, 88) + '...' : text;
//     };

//     const handleImageClick = (_id) => {
//         handleView(_id).then((data) => {
//             setViewCount(data.viewCount);
//         });
//     };

//     const handleLikeClick = (postId) => {
//         dispatch(likePost(postId, userID)).then((response) => {
//             if (response && response.viewCount !== undefined) {
//                 setViewCount(response.viewCount);
//             }
//         });
//     };

//     const handleUnlikeClick = (postId) => {
//         dispatch(unlikePost(postId, userID)).then((response) => {
//             if (response && response.viewCount !== undefined) {
//                 setViewCount(response.viewCount);
//             }
//         });
//     };

//     return (
//         <div className="row mt-3">
//             {posts.map((data) => (
//                 !data.hidden && (
//                     <div key={data._id} className={`post-item col-lg-4 col-md-6 mb-3 ${data._id}`}>
//                         <div className="bg-successes bg-height p-3">
//                             <div className="post-title pb-3 text-white">{data.title}</div>
//                         </div>
//                         <Link to={`postDetails/${data._id}`} className="post-link" onClick={() => handleImageClick(data._id)}>
//                             <img src={data.image} className="img-fluid d-block w-100" alt="Post Image" />
//                         </Link>
//                         <div className="bg-successes p-3">
//                             <div className="post-description pb-3 text-white">{truncateText(data.description)}</div>
//                         </div>
//                         <div className="icons d-flex justify-content-between text-white bg-successes p-3">
//                             <div className="like-buttons">
//                                 <ImArrowUp className="like-button" onClick={() => handleLikeClick(data._id)} />
//                                 <span className="like-count p-2">{data.likes.length}</span>
//                                 <ImArrowDown className="like-button" onClick={() => handleUnlikeClick(data._id)} />
//                             </div>
//                             <div className="comment-icon">
//                                 <FaMessage className="me-2" />
//                                 {data.comments.length}
//                             </div>
//                             <div className="view-icon">
//                                 <FaEye className="me-2" />
//                                 {data.views}
//                             </div>
//                         </div>
//                     </div>
//                 )
//             ))}
//             <ToastContainer />
//         </div>
//     );
// }

// export default PostsSection;

import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import { FaMessage } from "react-icons/fa6";
import { ImArrowDown, ImArrowUp } from 'react-icons/im';
import { ImgurContext } from './Context/ImgurContext';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, unlikePost, fetchPosts, incrementViewCount } from '../reducer/actions';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PostsSection() {
    const dispatch = useDispatch();
    const reduxPosts = useSelector(state => state.posts); // Get posts from Redux state
    const { userID } = useContext(ImgurContext);
    const [viewCount, setViewCount] = useState(0);

    useEffect(() => {
        dispatch(fetchPosts()); // Fetch posts using Redux action
    }, [dispatch]);

    const truncateText = (text, maxLength = 88) => {
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    const handleImageClick = async (_id) => {
        try {
            const response = await dispatch(incrementViewCount(_id, userID)); // Dispatch the incrementViewCount action
            if (response && response.viewCount) {
                setViewCount(response.viewCount); // Update view count on success
            }
        } catch (error) {
            toast.error("Error incrementing view count.");
        }
    };

    const handleLikeClick = (postId) => {
        dispatch(likePost(postId, userID));
    };

    const handleUnlikeClick = (postId) => {
        dispatch(unlikePost(postId, userID));
    };

    return (
        <div className="row mt-3">
            {reduxPosts.map((data) => (
                !data.hidden && (
                    <div key={data._id} className="post-item col-lg-4 col-md-6 mb-3">
                        {/* <div className="bg-successes p-3">
                            <div className="post-title pb-3 text-white">{data.title}</div>
                        </div> */}
                        <Link
                            to={`postDetails/${data._id}`}
                            className="post-link"
                            onClick={() => handleImageClick(data._id)}
                        >
                            <img src={data.image} className="img-fluid d-block w-100" alt="Post" />
                        </Link>
                        <div className="bg-successes p-3">
                            <div className="post-description pb-3 text-white">{truncateText(data.description)}</div>
                        </div>
                        <div className="icons d-flex justify-content-between text-white bg-success p-3">
                            <div className="like-buttons">
                                <ImArrowUp className="like-button" onClick={() => handleLikeClick(data._id)} />
                                <span className="like-count p-2">{data.likes.length}</span>
                                <ImArrowDown className="like-button" onClick={() => handleUnlikeClick(data._id)} />
                            </div>
                            <div className="comment-icon">
                                <FaMessage className="me-2" />
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
