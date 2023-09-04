import React from "react";
import {FaComment} from 'react-icons/fa';
import {FaEye} from 'react-icons/fa';
import {ImArrowDown} from 'react-icons/im';
import {ImArrowUp} from 'react-icons/im';
import {Link} from 'react-router-dom';
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import { ImgurContext } from '../Context/ImgurContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
   
function Posts(){
  const {userID,setUserID, LikePost,  UnLikePost, setLikes, isLoggedIn} = useContext(ImgurContext);

    const { _id } = useParams();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});

    useEffect(() => {
        fetch("http://localhost:3007/post")
        .then((resp) => resp.json())
        .then((data) => {
            // console.log('data',data);
            const sortedData = data.sort((a, b) => new Date (b.date) - new Date(a.date));
            setProducts(sortedData);
            setLoading(false)
        });

        
    },[]);

    useEffect(() => {
      // getData();
      getCommentData()
    
    }, []);
  
  const getCommentData = async () => {
      await axios.get("http://localhost:3007/post/" + _id).then((res) => {
          setData(res.data);
       console.log (res.data.comments)
      });
    };

    return (
        <div className="post-bk">
            <div className="ddd">
                {loading ? (
                    <div>Data Loading, please wait....</div>
                ) : (
                  products.map((product) =>{
                        return  (
                            <div className="posts-grid">
                                <div key={product._id} className="bkk"  >
                                   <div className="shopComputer-product">
                                        <Link to={`/commentPost/${product._id}`} className="post-bk" >
                                            <h2 className="flexx post-title">{product.title ?? ''}</h2>
                                            <img src={product.image} alt="images" />
                                            <p>{product.description}</p>
                                            <p> {product.tag?.title ?? ''}</p>
                                        </Link>
                                        <div className="flexx">
                                            <div className="flexy">
                                                <ImArrowUp onClick={()=>LikePost(product._id)}/>
                                                <div>{product.likes.length}</div>
                                                <ImArrowDown onClick={()=>UnLikePost(product._id)}/>
                                            </div>

                                            <div><FaComment /> {product?.comments?.length}</div>
                                            <div><FaEye /> {product.views}</div>
                                            
                                        </div>
                                        
                                   </div>
                                </div>
                            </div>
                           )
                    })
                )}
                 <ToastContainer />
            </div>
          
        </div>

       
          
     )

  
  
}
export default Posts;