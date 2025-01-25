import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { FaEye, FaArrowUp} from 'react-icons/fa';
import { FaMessage } from "react-icons/fa6";
import { ImArrowDown, ImArrowUp } from 'react-icons/im';
import { BsArrowLeftShort } from 'react-icons/bs';
import { ImgurContext } from '../Context/ImgurContext';
import { likePost, unlikePost, incrementViewCount, fetchTagPosts } from '../../reducer/actions';
import { toast, ToastContainer } from 'react-toastify';
import { RotatingLines } from 'react-loader-spinner';

function TagPost() {
  const { _id } = useParams();
  const [loading, setLoading] = useState(true);
  const [tagName, setTagName] = useState(''); // Tag name state
  const tagPosts = useSelector((state) => state.tagPosts);  // Use tagPosts from Redux state
  const dispatch = useDispatch();
  const { userID, LikePost, UnLikePost, scrollToTop, isVisible } = useContext(ImgurContext);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchTagPosts(_id));  // Dispatch to fetch posts for the tag
        // console.log("API Response: ", response); // Check if the data is correct
  
        if (response && response.title) {
          setTagName(response.title); // Set the tag name
        } else {
          toast.error("No posts found for this tag.");
        }
      } catch (error) {
        toast.error("Error fetching posts.");
      } finally {
        setLoading(false); // Turn off the loader after data is fetched
      }
    };
  
    fetchData();
  }, [_id, dispatch]);

  const truncateText = (text, maxLength = 88) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const handleImageClick = async (_id) => {
    try {
      const response = await dispatch(incrementViewCount(_id, userID)); // Increment view count
      if (response && response.viewCount) {
        setViewCount(response.viewCount); // Update view count on success
      }
    } catch (error) {
      toast.error("Error incrementing view count.");
    }
  };

  const handleLikeClick = (postId) => {
    dispatch(likePost(postId, userID, false, true));
  };

  const handleUnlikeClick = (postId) => {
    dispatch(unlikePost(postId, userID, false, true));
  };

  return (
    <div>
      <div className="tag-section">
        <div className="back pt-3 pb-3">
          <Link to="/" className="td">
            <BsArrowLeftShort /> back to Imgur
          </Link>
        </div>
        {/* Display tag name */}
        <h2>{tagName}</h2>
        <p className="text-center text-white cover-name">{tagName}</p>
        {/* Uncommented the post count */}
        <p className="text-center text-white cover-stats pb-5">{tagPosts.length} POSTS</p>
      </div>
      <div className="post-bk pt-4">
        <div className="container mt-5">
          {loading ? (
            <div className="loader text-center">
              <RotatingLines width="50" />
            </div>
          ) : (
            <div className="posts-container row mt-3" style={{ marginLeft: 0, marginRight: 0 }}>
              {tagPosts.length > 0 ? (
                tagPosts.map((post) => (
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
                        style={{ borderRadius: "3px 3px 0 0" }}
                      />
                    </Link>
                    <div className="bg-successes p-3">
                      <div className="post-description pb-3 text-white">
                        {truncateText(post.description)}
                      </div>
                    </div>
                    <div className="icons d-flex justify-content-between text-white bg-success p-3" style={{ borderRadius: "0 0 5px 5px" }}>
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
                <p className="text-white text-center">No tag posts available.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="back-to-top" onClick={scrollToTop} style={{ display: isVisible ? 'block' : 'none' }}>
        <FaArrowUp className="FaArrowUp" />
      </div>
      <ToastContainer />
    </div>
  );
}

export default TagPost;