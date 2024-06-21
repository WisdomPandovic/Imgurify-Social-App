// import React, { useState, useEffect, useContext } from 'react';
// import { Container, Row, Col } from 'react-bootstrap';
// import {AiOutlineShareAlt} from 'react-icons/ai';
// import {GoComment} from 'react-icons/go';
// import {TbArrowBigUp} from 'react-icons/tb';
// import {TbArrowBigDown} from 'react-icons/tb';
// import {AiOutlineHeart} from 'react-icons/ai';
// import { ImgurContext } from '../Context/ImgurContext';

// function SideCounters({ data }) {
//     const {LikePost, UnLikePost} = useContext(ImgurContext);
//     return (
//         <Container fluid className="mt-3">
//                 {/* <div className="fixed-column"> */}
//                     <section id="like-section" className="d-flex flex-column justify-content-center align-items-center">
//                         <Container className="sidecounter mt-5 pb-3 pt-3">
//                             <TbArrowBigUp className='text-white iconz'  onClick={() => LikePost(data._id)}/>
//                             <span className="d-block text-white">{data?.likes?.length}</span>
//                             <TbArrowBigDown className='text-white iconz'onClick={() => UnLikePost(data._id)} />
                            
//                             <div className="heart-icon text-white">
//                                 <AiOutlineHeart/>
//                             </div>
//                         </Container>
//                     </section>

//                     <section id="share-section" className="d-flex flex-column justify-content-center align-items-center">
//                         <Container className="share mt-5 pb-3 pt-3 text-white">
//                         <AiOutlineShareAlt/>
//                         </Container>
//                     </section>

//                     <section id="comment-length-section" className="d-flex flex-column justify-content-center align-items-center">
//                         <Container className="sidecounter mt-5 pb-3 pt-3 text-white">
//                             <div className="heart-icon">
//                                 <GoComment />
//                             </div>
//                             <span className="d-block">{data?.comments?.length}</span>
//                         </Container>
//                     </section>
//                 {/* </div> */}
//         </Container>
//     );
// }

// export default SideCounters;

import React from 'react';
import { Container } from 'react-bootstrap';
import { AiOutlineShareAlt } from 'react-icons/ai';
import { GoComment } from 'react-icons/go';
import { TbArrowBigUp, TbArrowBigDown } from 'react-icons/tb';
import { AiOutlineHeart } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, unlikePost } from '../../reducer/actions';

function SideCounters({ data }) {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.posts);
  
  // Find the specific post data from the state using the data._id
  const post = posts.find(post => post._id === data._id) || {};

  const handleLikeClick = (postId) => {
    console.log("Like button clicked for post ID:", postId);
    dispatch(likePost(postId));
  };

  const handleUnlikeClick = (postId) => {
    console.log("Unlike button clicked for post ID:", postId);
    dispatch(unlikePost(postId));
  };

  return (
    <Container fluid className="mt-3">
      <section id="like-section" className="d-flex flex-column justify-content-center align-items-center">
        <Container className="sidecounter mt-5 pb-3 pt-3">
          <TbArrowBigUp className='text-white iconz' onClick={() => handleLikeClick(data._id)} />
          <span className="d-block text-white">{post.likes?.length}</span>
          <TbArrowBigDown className='text-white iconz' onClick={() => handleUnlikeClick(data._id)} />
          <div className="heart-icon text-white">
            <AiOutlineHeart />
          </div>
        </Container>
      </section>

      <section id="share-section" className="d-flex flex-column justify-content-center align-items-center">
        <Container className="share mt-5 pb-3 pt-3 text-white">
          <AiOutlineShareAlt />
        </Container>
      </section>

      <section id="comment-length-section" className="d-flex flex-column justify-content-center align-items-center">
        <Container className="sidecounter mt-5 pb-3 pt-3 text-white">
          <div className="heart-icon">
            <GoComment />
          </div>
          <span className="d-block">{post.comments?.length}</span>
        </Container>
      </section>
    </Container>
  );
}

export default SideCounters;
