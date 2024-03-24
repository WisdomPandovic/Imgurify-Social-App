import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {AiOutlineShareAlt} from 'react-icons/ai';
import {GoComment} from 'react-icons/go';
import {TbArrowBigUp} from 'react-icons/tb';
import {TbArrowBigDown} from 'react-icons/tb';
import {AiOutlineHeart} from 'react-icons/ai';
import { ImgurContext } from '../Context/ImgurContext';

function SideCounters({ data }) {
    const {LikePost, UnLikePost} = useContext(ImgurContext);
    return (
        <Container fluid className="mt-3">
                {/* <div className="fixed-column"> */}
                    <section id="like-section" className="d-flex flex-column justify-content-center align-items-center">
                        <Container className="sidecounter mt-5 pb-3 pt-3">
                            <TbArrowBigUp className='text-white iconz'  onClick={() => LikePost(data._id)}/>
                            <span className="d-block text-white">{data?.likes?.length}</span>
                            <TbArrowBigDown className='text-white iconz'onClick={() => UnLikePost(data._id)} />
                            
                            <div className="heart-icon text-white">
                                <AiOutlineHeart/>
                            </div>
                        </Container>
                    </section>

                    <section id="share-section" className="d-flex flex-column justify-content-center align-items-center">
                        <Container className="share mt-5 pb-3 pt-3 text-white">
                        <AiOutlineShareAlt/>
                        </Container>
                    </section>

                    <section id="comment-length-section" className="d-flex flex-column justify-content-center align-items-center">
                        <Container className="sidecounter mt-5 pb-3 pt-3 text-white">
                            <div className="heart-icon">
                                <GoComment />
                            </div>
                            <span className="d-block">{data?.comments?.length}</span>
                        </Container>
                    </section>
                {/* </div> */}
        </Container>
    );
}

export default SideCounters;