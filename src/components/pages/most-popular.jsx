import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ImgurContext } from '../Context/ImgurContext';
import { toast, ToastContainer } from 'react-toastify';
import { FaEye } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';
import { ImArrowDown, ImArrowUp } from 'react-icons/im';
import { BsArrowLeftShort } from 'react-icons/bs';
import { likePost, unlikePost, incrementViewCount, fetchPopularPosts } from '../../reducer/actions';
import { RotatingLines } from 'react-loader-spinner';
import { handleErrorResponse, notifySuccess } from '../../utils/helpers';

function PopularPosts() {
    const [loading, setLoading] = useState(true);
    const popularPosts = useSelector((state) => state.popularPosts);
    const dispatch = useDispatch();
    const { userID } = useContext(ImgurContext);
    const [viewCount, setViewCount] = useState(0);

    useEffect(() => {
        // Fetch posts and set loading to false once done
        const fetchData = async () => {
            try {
                await dispatch(fetchPopularPosts());
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
            const response = await dispatch(incrementViewCount(_id, userID,)); // Dispatch the incrementViewCount action
            if (response && response.viewCount) {
                setViewCount(response.viewCount); // Update view count on success
            }
        } catch (error) {
            toast.error("Error incrementing view count.");
        }
    };

    const handleLikeClick = (postId) => {
        dispatch(likePost(postId, userID, true));
        console.log('Liking post:', postId);
    };

    const handleUnlikeClick = (postId) => {
        dispatch(unlikePost(postId, userID, true));
    };

    return (
        <div className="post-bk popular-posts">
            <div className="back pt-3 pb-3">
                <Link to="/" className="td">
                    <BsArrowLeftShort /> back to Imgur
                </Link>
            </div>
            <div className="container mt-5">
                <h2 className="text-white text-center pt-3">Most Popular Posts</h2>
                {loading ? (
                    <div className="loader text-center">
                        <RotatingLines width="50" />
                    </div>
                ) : (
                    <div className="posts-container row mt-3">
                        {popularPosts.length > 0 ? (
                            popularPosts.map((post) => (
                                <div key={post._id} className="post-item col-lg-4 col-md-6 mb-3">
                                    <Link
                                        to={`/postDetails/${post._id}`}
                                        className="post-link"
                                        onClick={() => handleImageClick(post._id)}
                                    >
                                        <img
                                            src={post.image}
                                            className="img-fluid d-block w-100"
                                            alt={post.title || 'Post'}
                                            loading="lazy"
                                        />
                                    </Link>
                                    <div className="bg-successes p-3">
                                        <div className="post-description pb-3 text-white">
                                            {truncateText(post.description)}
                                        </div>
                                    </div>
                                    <div className="icons d-flex justify-content-between text-white bg-success p-3">
                                        <div className="like-buttons">
                                            <ImArrowUp className="like-button" onClick={() => handleLikeClick(post._id)} />
                                            <span className="like-count p-2">{post.likes.length}</span>
                                            <ImArrowDown className="like-button" onClick={() => handleUnlikeClick(post._id)} />
                                        </div>
                                        <div className="comment-icon">
                                            <FaMessage className="me-2" />
                                            {post.comments.length}
                                        </div>
                                        <div className="view-icon">
                                            <FaEye className="me-2" />
                                            {post.views}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-white text-center">No popular posts available.</p>
                        )}
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
}

export default PopularPosts;
