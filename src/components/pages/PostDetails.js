import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Image, Form, Button } from 'react-bootstrap';
import SideCounters from "./SideCounters";
import { useParams, useNavigate } from 'react-router-dom';
import { RotatingLines } from 'react-loader-spinner';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import axios from "axios";
import { ImgurContext } from '../Context/ImgurContext';
import { AiOutlineGif } from 'react-icons/ai';
import { FaRegImage } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { TbArrowBigUp } from 'react-icons/tb'
import { TbArrowBigDown } from 'react-icons/tb'

import { Link } from 'react-router-dom';
import { FaComment } from 'react-icons/fa';
import { FaEye } from 'react-icons/fa';
import { ImArrowDown } from 'react-icons/im';
import { ImArrowUp } from 'react-icons/im';
import SocialNav from "../SocialNav"
import { FaArrowLeft, FaArrowRight, FaArrowUp } from 'react-icons/fa';

function PostDetails({ uploadedImageUrl }) {
    const { _id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { userID, isLoggedIn, LikePost, UnLikePost, LikeComment, UnLikeComment, scrollToTop, isVisible } = useContext(ImgurContext);
    const [posts, setPosts] = useState([]);
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    const [replyText, setReplyText] = useState('');
    const [showReplyPopup, setShowReplyPopup] = useState(false);
    // const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [commentId, setCommentId] = useState(null);


    const handleOpenReplyPopup = (commentId) => {
        setCommentId(commentId);
        // setSelectedCommentId(commentId);
        setShowReplyPopup(true);
    };

    const handleCloseReplyPopup = () => {
        setShowReplyPopup(false);
    };

    // POST COMENT
    const [reply, setReply] = useState({
        text: "",
        reply_user: {
            id: userID,
        },
    });

    const handleReplySubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        if (!isLoggedIn) {
            toast.error("You need to sign in to post a reply.");
            return;
        }

        const newReply = {
            text: reply.text,
            reply_user: {
                id: userID
            },
            comment_id: commentId
        };

        axios.post(`https://imgurif-api.onrender.com/api/reply/${_id}`, newReply)
            .then((response) => {
                console.log("Reply submitted:", response.data);
                // Reset the reply state and close the pop-up
                setReply({
                    text: "",
                    reply_user: { id: userID }
                });
                setShowReplyPopup(false);
                // Optionally, you can fetch the updated post data here
            })
            .catch((error) => {
                console.error("Error submitting reply:", error);
                toast.error("An error occurred while posting the reply.");
            });
    };


    useEffect(() => {
        setLoading(true);
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch('https://imgurif-api.onrender.com/api/post');
            const data = await response.json();
            const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setPosts(sortedData);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`https://imgurif-api.onrender.com/api/post/${_id}`);
                const postData = await response.json();
                setPost(postData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        fetchPost();
    }, [_id]);

    const handleNextPost = () => {
        if (currentIndex < posts.length - 1) {
            setCurrentIndex(currentIndex + 1);
            navigate(`/postDetails/${posts[currentIndex + 1]._id}`);
        }
    };

    const handlePreviousPost = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            navigate(`/postDetails/${posts[currentIndex - 1]._id}`);
        }
    };

    // Retrieve the current post
    const postt = posts[currentIndex];

    // POST COMENT
    const [comment, setComment] = useState({
        text: "",
        comment_user: {
            id: userID,
        },
    });

    const submitForm = (e) => {
        e.preventDefault();

        if (!isLoggedIn) {
            toast.error("You need to sign in to post a comment.");
            return;
        }

        const newComment = {
            text: comment.text,
            comment_user: {
                id: userID
            },
        };

        axios
            .post(`https://imgurif-api.onrender.com/api/comment/${_id}`, newComment)
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
    const handlecommentChange = event => {
        setComment(event.target.value);
    }

    useEffect(() => {
        getCommentData()
    }, [])

    // GET COMMENT FROM API
    const getCommentData = async () => {
        await axios.get("https://imgurif-api.onrender.com/api/post/" + _id).then((res) => {
            setData(res.data);
            //  console.log (res.data)
        });
    };

    const formatDate = (date) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    };

    // Return loading or error message if post is null
    if (loading) {
        return (
            <div className="loader-container text-center">
                <RotatingLines
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="50"
                    visible={true}
                />
            </div>
        );
    }

    return (
        <Container fluid className="mt-3 comment-background">
            <SocialNav />
            <div className="d-flex justify-content-evenly mt-3">
                <Button onClick={handlePreviousPost}><FaArrowLeft /> Previous</Button>
                <Button onClick={handleNextPost}>Next <FaArrowRight /></Button>
            </div>
            <Row>
                <Col lg={3} md={12} className="fixed-column">
                    {data && <SideCounters data={postt} />}
                </Col>

                <Col lg={6} md={12} className="center-column pt-5 pb-5">
                    <Container>
                        <h2 id="post-title" className='text-white'>{post?.title}</h2>

                        <div id="post-username" className="text-success ">{post?.user.username}</div>

                        <p id="total-views" className='text-white'>{post?.views} views</p>

                        <Row className="post-image">
                            <Col>
                                <Image src={post?.image} alt="Post Image" fluid />
                            </Col>
                        </Row>
                        {uploadedImageUrl && <img src={uploadedImageUrl} alt="Uploaded" />}

                        <Row className="post-image">
                            <Col>
                                <p className='text-white mt-2'>{post.description}</p>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg={5}>
                                <p id="post-tag" className='text-white mt-4 post-tag text-center'>{post?.tag.name}</p></Col>
                        </Row>

                        <div className="comments-section">
                            <Form id="add-comment-form" onSubmit={submitForm} value={userID}>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="comment-text" className=' text-white mt-4'>Add your comment:</Form.Label>
                                    <Form.Control as="textarea" id="comment-text" rows={3} value={comment.text} onChange={(e) => setComment({ ...comment, text: e.target.value })} />
                                </Form.Group>
                                <div className='comment-posts'>
                                    <FaRegImage className='text-white pt-2' style={{ fontSize: '30px' }} />
                                    <AiOutlineGif className='text-white pt-2 mr-2' style={{ fontSize: '30px' }} />
                                    <div className='text-white pt-2'>500</div>
                                    <Button type="submit" >Comment</Button>
                                </div>
                            </Form>
                        </div>
                    </Container>
                    <ToastContainer />
                </Col>

                <Col lg={3} md={12} className='text-white pt-5'>
                    <div >
                        <div className='d-flex justify-content-between'>
                            <div><p className='text-uppercase'>{data?.comments?.length} Comments</p></div>

                            <div className='comment-posts'>
                                <p className='mr-2'>Expand All</p>
                                <p className='mr-2'>Best</p>
                            </div>
                        </div>
                    </div>

                    {data?.comments?.map((comment) => (
                        <div className='comment-data' key={comment._id}>
                            <div className='comment-posts '>
                                <p className='comment-user mr-2 text-success'>{comment?.comment_user?.username}</p>
                                <p className='comment-date mr-2'>.</p>
                                <p className='comment-date'>{formatDate(comment.date)}</p>
                            </div>
                            <div className='comment-text'>
                                <p>{comment.text}</p>
                            </div>

                            <div className='d-flex justify-content-between comment-stat mr-2'>
                                <div className='comment-posts comment-stat mr-2'>
                                    <div className='comment-posts'>
                                        <div className='mr-2'><TbArrowBigUp className='mr-2 like-button' onClick={() => LikeComment(post._id, comment._id)} /></div>
                                        <div className='mr-2'>{comment.likes.length}</div>
                                        <div className='mr-2'><TbArrowBigDown className='mr-2 unlike-button' onClick={() => UnLikeComment(post._id, comment._id)} /></div>
                                    </div>

                                    <div>|</div>

                                    <div>{comment.replies.length} <span>replies</span></div>
                                </div>
                                <div className='bg-success p-1' onClick={() => handleOpenReplyPopup(comment._id)}><FaComment /> Reply</div>

                            </div> <hr />
                        </div>
                    ))}

                    {showReplyPopup && (
                        <div className="reply-popup">
                            <Form id="add-comment-form" onSubmit={handleReplySubmit} value={userID}>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="comment-text" className=' text-white mt-4'>Add your comment:</Form.Label>
                                    <Form.Control as="textarea" id="comment-text" rows={3} value={reply.text} onChange={(e) => setReply({ ...reply, text: e.target.value })} />
                                </Form.Group>
                                <div className='comment-posts'>
                                    <FaRegImage className='text-white pt-2' style={{ fontSize: '30px' }} />
                                    <AiOutlineGif className='text-white pt-2 mr-2' style={{ fontSize: '30px' }} />
                                    <div className='text-white pt-2'>500</div>
                                    <Button type="submit" >Reply</Button>
                                    <Button onClick={handleCloseReplyPopup} className='bg-danger'>Cancel</Button>
                                </div>
                            </Form>

                        </div>
                    )}
                </Col>
            </Row>

            <div className='bg-dark'>
                <div className='container  mt-5'>
                    <div><p className='text-white text-center pt-3'>EXPLORE POSTS</p></div>
                    <div className="row mt-3">
                        {posts.map((data) => (
                            <div key={data._id} className={`post-item col-lg-4 col-md-6 mb-3 ${data._id}`}>
                                <div className="bg-successes p-3">
                                    <div className="product-title pb-3 text-white">{data.title}</div>
                                </div>
                                <Link to={``} className="post-link">
                                    <img src={data.image} className="img-fluid d-block w-100" alt="Post Image" />
                                </Link>
                                <div className="bg-successes p-3">
                                    <div className="product-description pb-3 text-white">{data.description}</div>
                                    <div className="icons d-flex justify-content-between text-white pt-3">
                                        <div className="like-buttons">
                                            <ImArrowUp className="like-button" onClick={() => LikePost(data._id)} />
                                            <span className="like-count p-2">{data.likes.length}</span>
                                            <ImArrowDown className="like-button" onClick={() => UnLikePost(data._id)} />
                                        </div>
                                        <FaComment />
                                        <FaEye />
                                    </div>
                                </div>
                                <ToastContainer />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="back-to-top" onClick={scrollToTop} style={{ display: isVisible ? 'block' : 'none' }}>
                <FaArrowUp className='FaArrowUp' />
            </div>

        </Container>
    );
}

export default PostDetails;