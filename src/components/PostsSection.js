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
import { RotatingLines } from 'react-loader-spinner';

function PostsSection() {
    const dispatch = useDispatch();
    const reduxPosts = useSelector(state => state.posts); // Get posts from Redux state
    const { userID } = useContext(ImgurContext);
    const [viewCount, setViewCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     dispatch(fetchPosts()); // Fetch posts using Redux action
    // }, [dispatch]);

    useEffect(() => {
        // Fetch posts and set loading to false once done
        const fetchData = async () => {
            try {
                await dispatch(fetchPosts());
            } catch (error) {
                toast.error("Error fetching posts.");
            } finally {
                setLoading(false); // Turn off loader
            }
        };

        fetchData();
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

     // Display loader if still loading
     if (loading) {
        return (
            <div className="loader-container text-center mt-5">
                <RotatingLines
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="50"
                    visible={true}
                />
            </div>
        );
    }

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
