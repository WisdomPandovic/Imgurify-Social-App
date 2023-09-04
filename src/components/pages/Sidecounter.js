import {AiOutlineShareAlt} from 'react-icons/ai';
import {GoComment} from 'react-icons/go';
import {TbArrowBigUp} from 'react-icons/tb';
import {TbArrowBigDown} from 'react-icons/tb';
import {AiOutlineHeart} from 'react-icons/ai';
import { useState, useEffect, useContext} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import { ImgurContext } from '../Context/ImgurContext';

function Sidecounter(){
  const {userID,setUserID, likes, LikePost,  UnLikePost, setLikes, isLoggedIn } = useContext(ImgurContext);
  const {_id} = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    getCommentData()
  }, []);

const getCommentData = async () => {
    await axios.get("http://localhost:3007/post/" + _id).then((res) => {
        setData(res.data);
     console.log (res.data.comments)
    });
  };

    return(
        <div>
             <div className='comment-wd'>
              <div>
                  <div className='likes-count'key={_id}>
                  <div className='arw-up'><TbArrowBigUp onClick={()=>LikePost(_id)}/> </div>
                  <div>{data?.likes?.length}</div>
                  <div className='arw-dw'><TbArrowBigDown onClick={()=>UnLikePost(_id)} /> </div>
                  <div className='heart'><AiOutlineHeart/></div>
                </div>
          
                <div className='share'>
                  <div><AiOutlineShareAlt/></div>
                </div>

                <div className='likes-count comment'>
                  <div className='comment'><GoComment /></div>
                  <div>{data?.comments?.length}</div>
                  
                </div>
              </div>

             </div>

        </div>
    )
}

export default Sidecounter;