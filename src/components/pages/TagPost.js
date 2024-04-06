import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {FaComment} from 'react-icons/fa';
import {FaEye, FaArrowUp} from 'react-icons/fa';
import {ImArrowDown} from 'react-icons/im';
import {ImArrowUp} from 'react-icons/im';
import { ImgurContext } from '../Context/ImgurContext';

function TagPost() {
    const { _id } = useParams();
    const [posts, setPosts] = useState([]);
    const {LikePost, UnLikePost, scrollToTop, isVisible} = useContext(ImgurContext);

    useEffect(() => {
        fetchPostsByTag(_id);
    }, [_id]);

    const fetchPostsByTag = async (_id) => {
        try {
            const response = await fetch(`http://localhost:3007/tag/${_id}`);
            const data = await response.json();
            setPosts(data.post);
            console.log(posts)
        } catch (error) {
            console.error('Error fetching posts by tag:', error);
        }
    };

    return (
        <div>
          <div className="tag-section" >
                    <h2>{posts.name}</h2>
                    <p className='text-center text-white p-5'>{posts.length} POSTS</p>
            </div>
          <div className='post-bk pt-4'>
           <div className='container'>

            <div className="row ">
          {posts.map((post) => (
            <div key={post._id} className={`post-item col-lg-4 col-md-6 mb-3 ${post._id}`}>
              <div className="bg-successes bg-height p-3">
                <div className="product-title pb-3 text-white">{post.title}</div>
              </div>
              <Link to={`postDetails/${post._id}`} className="post-link">
                <img src={post.image} className="img-fluid d-block w-100" alt="Post Image" />
              </Link>
              <div className="bg-successes p-3">
                <div className="product-description pb-3 text-white">{post.description}</div>
              </div>
                <div className="icons d-flex justify-content-between text-white pt-5 bg-successes p-3">
                  <div className="like-buttons">
                    <ImArrowUp className="like-button" onClick={() => LikePost(post._id)} />
                    {/* Access likeCount from the context directly in JSX */}
                    <span className="like-count p-2">{post.likes.length}</span>
                    <ImArrowDown className="like-button" onClick={() => UnLikePost(post._id)} />
                  </div>
                  <FaComment />
                  <FaEye />
                </div>
            </div>
          ))}
             </div>
        </div>
        </div>
        <div className="back-to-top" onClick={scrollToTop} style={{ display: isVisible ? 'block' : 'none' }}>
                <FaArrowUp className='FaArrowUp'/>
            </div>
        </div>
    );
}

export default TagPost;