import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {FaComment} from 'react-icons/fa';
import {FaEye} from 'react-icons/fa';
import {ImArrowDown} from 'react-icons/im';
import {ImArrowUp} from 'react-icons/im';
import { ImgurContext } from './Context/ImgurContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function PostsSection() {
    const [posts, setPosts] = useState([]);
    const {LikePost,  UnLikePost,  handleView} = useContext(ImgurContext);     

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:3007/post');
            const data = await response.json();
            const sortedData = data.sort((a, b) => new Date (b.date) - new Date(a.date));
            setPosts(sortedData);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleImageClick = (_id) => {
      // Call the handleView function with the _id parameter to increment the view count
      handleView(_id);
      // console.log("_id parameter received:", _id);
  };

    // Function to truncate text to 15 characters
    const truncateText = (text) => {
      return text.length > 100 ? text.slice(0, 88) + '...' : text;
  };

    return (
        <div className="row mt-3">
          {posts.map((data) => (
            <div key={data._id} className={`post-item col-lg-4 col-md-6 mb-3 ${data._id}`}>
              <div className="bg-successes bg-height p-3">
                <div className="product-title pb-3 text-white">{data.title}</div>
              </div>
              <Link to={`postDetails/${data._id}`} className="post-link" onClick={() => handleImageClick(data._id)}>
                <img src={data.image} className="img-fluid d-block w-100" alt="Post Image"  />
              </Link>
              <div className="bg-successes p-3">
              <div className="product-description pb-3 text-white">{truncateText(data.description)}</div>
              </div>
                <div className="icons d-flex justify-content-between text-white bg-successes p-3">
                  <div className="like-buttons">
                    <ImArrowUp className="like-button" onClick={() => LikePost(data._id)} />
                    <span className="like-count p-2">{data.likes.length}</span>
                    <ImArrowDown className="like-button" onClick={() => UnLikePost(data._id)} />
                  </div>
                  <div ><FaComment /> {data?.comments?.length}</div>
                  <div ><FaEye /> {data.views}</div>
                </div>
              <ToastContainer />
            </div>
          ))}
        </div>
      );
}

export default PostsSection;