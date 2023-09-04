import { useState, useEffect, useContext} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {Link} from 'react-router-dom';
import { ImgurContext } from '../Context/ImgurContext';
import { useNavigate } from "react-router-dom";
import {FaComment} from 'react-icons/fa';
import {FaEye} from 'react-icons/fa';
import {ImArrowDown} from 'react-icons/im';
import {ImArrowUp} from 'react-icons/im';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function PostCategory(){
    const {_id} = useParams();
    const {isLoggedIn, setIsLoggedIn, LikePost,  UnLikePost, } = useContext(ImgurContext)
    const navigate = useNavigate();
    const { tagId } = useParams();
    const [posts, setPosts] = useState([]);

    
  const handleNewPostClick = () => {
    if (isLoggedIn) {
      navigate("/newpost");
    } else {
      alert("You need to sign in to create a post.");
      navigate("/signin");
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    try {
      const rawData = localStorage.getItem('Imgur_USER');
  
      if (rawData) {
        const localData = JSON.parse(rawData);
        localStorage.removeItem('Imgur_USER');
      }
  
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error while handling logout:', error);
    }
  };

  useEffect(() => {
    axios.get(`http://localhost:3007/post/tag/${tagId}`)
      .then((response) => {
        // console.log(response)
        setPosts(response.data);

      })
      .catch((error) => {
        console.error('Error fetching posts by tag:', error);
      });
  }, [tagId]);

    

    return(
        <div className='comment-bk'>
            <div>
                <div className='navBar'>
                    <div className='flex'>
                        <div className="logo"><Link to="/" className='td'>imgur</Link></div>
                        <div><button onClick={handleNewPostClick}><Link to="/newpost" className='newpost'>New post</Link></button></div>
                    </div>

                    <div> <input type='text' placeholder="Images, #tags, @users oh my!" /></div>

                    <div className='flex'>
                        {isLoggedIn ? (
                      <div className='flex'>
                        <div className='welcome-note'><p className='newpost'>Welcome,</p>
                          {` ${JSON.parse(localStorage.getItem('Imgur_USER')).data.username}!. `}
                          <p className='newpost'>You are logged in.</p>
                        </div>
                        <button onClick={handleLogout}>Logout</button>
                      </div>
                      ) : (   
                      <div className='flex'>
                        <div><button className='navBar-btn'>Go Ad-Free</button></div>
                        <h2 className='navBar-signin'  onClick={handleLogin}><Link to="/signin" className='newpost'>Sign In</Link></h2>
                        <div><button><Link to="/signup" className='newpost'>Sign Up</Link></button></div>
                      </div>
                          )
                      }
                    </div>
                </div>

            </div>
        <div className="post-bk">
            <div className="ddd">
                
                    {posts.map((post) =>{
                        console.log('post',post)
                        return  (
                          
                            <div className="posts-grid">
                                <div key={post._id} className="bkk"  >
                                   <div className="shopComputer-product">
                                        <Link to={`/commentPost/${post._id}`} className="post-bk">
                                            <h2 className="flexx post-title">{post.title ?? ''}</h2>
                                            <img src={post.image} alt="images" />
                                            <p>{post.description}</p>
                                            <p> {post.tag?.title ?? ''}</p>
                                        </Link>
                                        <div className="flexx">
                                            <div className="flexy">
                                                <ImArrowUp onClick={()=>LikePost(post._id)}/>
                                                <div>{post.likes.length}</div>
                                                <ImArrowDown onClick={()=>UnLikePost(post._id)}/>
                                            </div>

                                            <div><FaComment /> {post?.comments?.length}</div>
                                            <div><FaEye /> {post.views}</div>
                                            
                                        </div>
                                        
                                   </div>
                                </div>
                            </div>
                           
    
                            
            
                           )
                    })}
                
            </div>
            <ToastContainer />
        </div>
        </div>

     
      
            
    )
}
export default PostCategory;