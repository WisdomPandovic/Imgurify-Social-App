import {Link} from 'react-router-dom';
import Sidecounter from './Sidecounter';
import {AiOutlineGif} from 'react-icons/ai';
import {FaRegImage} from 'react-icons/fa';
import {TbArrowBigUp} from 'react-icons/tb'
import {TbArrowBigDown} from 'react-icons/tb'
import { ImgurContext } from '../Context/ImgurContext';
import { useState, useEffect, useContext} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {formatDistanceToNow} from 'date-fns';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
   

function CommentPost(){

    const {_id} = useParams();
    console.log("_id parameter:", _id);
    const [viewCount, setViewCount] = useState(0);
    const [viewCountIncremented, setViewCountIncremented] = useState(false);
   
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState([]);
    const { userID, setUserID } = useContext(ImgurContext);
    const [data, setData] = useState({});
    const [viewedPosts, setViewedPosts] = useState([]);

    const {isLoggedIn, setIsLoggedIn} = useContext(ImgurContext)
    console.log(isLoggedIn)

    useEffect(() => {
      if(localStorage){
        let rawData = localStorage.getItem("Imgur_USER")
        let localData = JSON.parse(rawData)
        setUserID(localData)
      }
    
    },[]);

    useEffect(() => {
        const rawData = localStorage.getItem("Imgur_USER");
        if (rawData) {
          setIsLoggedIn(true);
        }
    
        const viewedPosts = JSON.parse(localStorage.getItem('viewedPosts')) || [];
       
        if (!viewedPosts.includes(_id)) {
       
        localStorage.setItem('viewedPosts', JSON.stringify([...viewedPosts, _id]));
        // handleView();
    }
     setViewedPosts(viewedPosts);
      }, []);
    
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
        fetch("http://localhost:3007/post/" + _id )
        .then((resp) => resp.json())
        .then((data) => {
            setProduct(data);
            setLoading(false)
            
        });
    
        
    },[]);
    // console.log(product)

    const formatDate = (date) => {
        return formatDistanceToNow(new Date(date), {addSuffix: true});
    };

    const [comment, setComment] = useState({
        text: "",
        comment_user: {
          // id: userID,
          id: userID.data.id,
        },
    });
  
    const submitForm = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
        toast.success("You need to sign in to post a comment.");
        return;
    }

    const newComment = {
        text: comment.text,
        comment_user: {
        id: userID.data.id
        },
    };

    axios
        .post(`http://localhost:3007/comment/${_id}`, newComment)
        .then((resp) => resp.data) 
        .then((data) => {
            console.log("Response Data:", data);
            setComment(data);
        })
        .catch((error) => {
            console.error("Error while submitting comment:", error);
        });

    if (newComment) {
        toast.success("Comment sent");
        setComment({
            text: "",
            comment_user: {},
        });
    }
};

       const handlecommentChange = event =>{
    setComment(event.target.value);
   
  }

  const [commentData, setCommentData] = useState([]);

useEffect(() => {
    // getData();
    getCommentData()
  }, []);

const getCommentData = async () => {
    await axios.get("http://localhost:3007/post/" + _id).then((res) => {
        setData(res.data);
     console.log (res.data)
    });
  };
  
useEffect(() => {
    console.log('Component rendered');
    console.log("_id value:", _id);
    axios.get(`http://localhost:3007/post/${_id}/views`)
      .then((response) => {
        const data = response.data;
        console.log('View count:', data.viewCount);
        setViewCount(data.viewCount);
          if (!viewCountIncremented) {
            handleView();
            setViewCountIncremented(true);
        }
        // handleView();
      })
      .catch((error) => {
        console.error('Error fetching view count:', error);
      });
  }, []);

  useEffect(() => {
    const viewedPosts = JSON.parse(localStorage.getItem('viewedPosts')) || [];
    setViewedPosts(viewedPosts);
  
    if (!viewedPosts.includes(_id)) {
      handleView();
    }
  }, []);


  const handleView = () => {

    if (!_id) {
      console.log('Missing _id parameter');
      return;
    }

    if (!isLoggedIn) {
      console.log('No User logged in');
     return;
    }
  
    console.log(_id); 
    const userData = JSON.parse(localStorage.getItem("Imgur_USER"));
    const userId = userData?.data?.id;
  
    fetch(`http://localhost:3007/post/${_id}/increment-view`, {
      method: 'POST',
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log('View count after increment:', data.viewCount);
        setViewCount(data.viewCount);
      })
      .catch((error) => {
        console.error('Error incrementing view count:', error);
      });
  };
  
    return(
        <div className='comment-bk'>
            <div>
                <div className='navBar'>
                    <div className='flex'>
                        <div className="logo"><Link to="/" className='td'>imgur</Link></div>
                        <div><button><Link to="/newpost" className='newpost'>New post</Link></button></div>
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

            <div className='comment-grid'>
                <div >
                    <div className='comment-flex'>
                        <Sidecounter/>
                        
                        {loading  === true ? (
                            <div className="shop-computer-con1"> Data Loading, please wait</div>
                            ) : (
                                    <div className='comment-block' key={product._id}>
                                        <p className='comment-title'>{product.title ?? ''}</p>
                                        <p className='comment-user'>{product?.user?.username}</p>
                                        <p className='comment-user-date'>{formatDate(product.date)}</p>
                                        <div className='comment-img'><img src={ product.image} alt="" /></div>
                                        <div className='politics'>
                                            <p>{product?.tag?.title}</p>
                                        </div>
                                    </div>
                             )

                        }

                    </div>

                    <div className='comment-section'>
                       <form onSubmit={submitForm} value={userID}>
                            <input type="text"  value={comment.text} onChange={(e) => setComment({ ...comment, text: e.target.value })}/>

                            <div className='comment-post'>
                                <div className='comment-posst'>

                                    <div className='comment-posts'>
                                        <div><FaRegImage/></div>
                                        <div><AiOutlineGif/></div>
                                        <div>500</div>
                                        <button className="comment-button" >Post</button>
                                    </div>
                                </div>
                            </div>

                        </form>
                   </div>

                   {/* {data?.comments?.map((comment) =>( */}
                    <div >
                    <div className='comment-flexs'>
                        <div><p>{data?.comments?.length} COMMENTS</p></div>
                        
                        <div className='flex'>
                            <p>Expand All</p>
                            <p>Best</p>
                        </div>
                    </div>
               </div>
                   {/* ))} */}
                

                 {data?.comments?.map((comment) =>(
                      <div className='comment-data' key={comment._id}>
                      <div className='flex comment-datas'>
                           <p className='comment-user'>{comment?.comment_user?.username}</p>
                           {/* <p className='comment-user'>{comment?.user}</p> */}
                           <p className='comment-date'>.</p>
                           <p className='comment-date'>{formatDate(comment.date)}</p>
                       </div>
                      <div className='comment-text'>
                          <p>{comment.text}</p>
                      </div>

                      <div className='flex comment-stat'>
                          <div className='flexy'>
                               <div><TbArrowBigUp/></div>
                               <div>()</div>
                               <div><TbArrowBigDown/></div>
                          </div>

                          <div>|</div>

                          <div>() replies</div>
                      </div> <hr/>
                  </div>
                 ))}
                   <ToastContainer />
                </div>

                <div className='ad-con'>
                  <div>
                    
                  </div>
                </div>
                
                   
                    
                
            </div>

        </div>
    )

}
 export default CommentPost;