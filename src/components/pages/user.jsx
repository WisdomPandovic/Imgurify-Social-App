import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import { ImArrowDown, ImArrowUp } from 'react-icons/im';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ImgurContext } from '../Context/ImgurContext';
import { RotatingLines } from 'react-loader-spinner';
import { Container } from 'react-bootstrap';
import SocialNav from "../SocialNav";
import { FaMessage } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";
import { handleErrorResponse, notifySuccess } from "../../utils/helpers";
import avatar from '../../images/avatar.png';
import silver from '../../images/silver.png';
import gold from '../../images/gold.png';
import bronze from '../../images/bronze.png';
import conversation_starter from '../../images/conversation_starter.png';
import dawww from '../../images/dawww.png';
import oc from '../../images/oc.png';
import gone_mobile from '../../images/gone_mobile.png';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, unlikePost } from '../../reducer/actions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Make sure to import the CSS

const UserProfile = () => {
    const dispatch = useDispatch();
    const { handleView, userID } = useContext(ImgurContext);
    const [viewCount, setViewCount] = useState(0);
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [followers, setFollowers] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [selectedTab, setSelectedTab] = useState("posts");
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(false);
    const [comments, setComments] = useState([]); // State to store comments
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [postComments, setPostComments] = useState([]); // State to store comments
    const [postCommentsLoading, setPostCommentsLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`https://imgurif-api.onrender.com/api/user-by-username/${username}`);
                setUser(response.data);
                setFollowers(response.data.followers.length);
            } catch (err) {
                console.error('Error fetching user:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [username]);

    useEffect(() => {
        if (selectedTab === "posts") {
            fetchPosts();
        }
    }, [selectedTab]);

    const fetchPosts = async () => {
        setPostsLoading(true);
        try {
            const response = await axios.get(`https://imgurif-api.onrender.com/api/user/${username}/posts`);
            setPosts(response.data);
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setPostsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedTab === "mycomment") {
            fetchComments();
        }
    }, [selectedTab]);

    const fetchComments = async () => {
        setCommentsLoading(true);
        try {
            const response = await axios.get(`https://imgurif-api.onrender.com/api/user/${user._id}/comments-made`);
            console.log(response.data)
            setComments(response.data); // Store fetched comments in the state
        } catch (err) {
            console.error('Error fetching comments:', err);
        } finally {
            setCommentsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedTab === "comment") {
            fetchPostComments();
        }
    }, [selectedTab]);

    const fetchPostComments = async () => {
        setCommentsLoading(true);
        try {
            const response = await axios.get(`https://imgurif-api.onrender.com/api/user/${userID}/comments-on-posts`);
            console.log(response.data)
            setPostComments(response.data); // Store fetched comments in the state
        } catch (err) {
            console.error('Error fetching comments:', err);
        } finally {
            setPostCommentsLoading(false);
        }
    };

    const truncateText = (text) => {
        return text.length > 100 ? text.slice(0, 88) + '...' : text;
    };

    const handleFollow = async () => {
        try {
            const currentUserId = userID;
            await axios.post(`https://imgurif-api.onrender.com/api/user/${user._id}/follow`, { currentUserId });
            setFollowers(followers + 1);

            setUser(prevUser => ({
                ...prevUser,
                following: prevUser.following + 1,
            }));

            setIsFollowing(true);
            notifySuccess("You are now following this user!");
        } catch (error) {
            handleErrorResponse(error);
            console.error("Error following user:", error);
        }
    };

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    const handleImageClick = (_id) => {
        handleView(_id).then((data) => {
            setViewCount(data.viewCount);
        });
    };

    const handleLikeClick = (postId) => {
        dispatch(likePost(postId, userID)).then((response) => {
            if (response && response.viewCount !== undefined) {
                setViewCount(response.viewCount);
            }
        });
    };

    const handleUnlikeClick = (postId) => {
        dispatch(unlikePost(postId, userID)).then((response) => {
            if (response && response.viewCount !== undefined) {
                setViewCount(response.viewCount);
            }
        });
    };

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

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <Container fluid className="mt-3 profile-background">
            <SocialNav />
            <div className="custom-container profile-bk text-white d-flex flex-column align-items-start justify-content-start mt-3">
                <div className='row align-items-center gap-4'>
                    <div className="col-12 col-md-auto text-center">
                        <img
                            src={avatar}
                            alt="User Avatar"
                            className="rounded-circle mb-3"
                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                        />
                    </div>
                    <div className="col-12 col-md">
                        <h1 className="profile-user">{user.username}</h1>
                        <div className="Profile-stats d-flex flex-wrap gap-4 text-uppercase">
                            <p>. {user.notoriety} .</p>
                            <p><strong>Followers:</strong> {followers}</p>
                            <p><strong>Following:</strong> {user.following}</p>
                            <p onClick={handleFollow} style={{ cursor: 'pointer' }}>
                                <FaPlusCircle /> {isFollowing ? "Following" : "Follow"}
                            </p>
                            <p>
                                <FaMessage /> Chat
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-white d-flex gap-4 align-items-center justify-content-center text-center mt-3">
                <p
                    onClick={() => handleTabClick("posts")}
                    style={{
                        cursor: 'pointer',
                        fontWeight: selectedTab === "posts" ? 'bold' : 'normal',
                        borderBottom: selectedTab === "posts" ? '4px solid white' : 'none',
                        paddingBottom: '4px'
                    }}
                >
                    Posts
                </p>
                <p
                    onClick={() => handleTabClick("about")}
                    style={{
                        cursor: 'pointer',
                        fontWeight: selectedTab === "about" ? 'bold' : 'normal',
                        borderBottom: selectedTab === "about" ? '4px solid white' : 'none',
                        paddingBottom: '4px'
                    }}
                >
                    About
                </p>
                <p
                    onClick={() => handleTabClick("comment")}
                    style={{
                        cursor: 'pointer',
                        fontWeight: selectedTab === "comment" ? 'bold' : 'normal',
                        borderBottom: selectedTab === "comment" ? '4px solid white' : 'none',
                        paddingBottom: '4px'
                    }}
                >
                    Comments
                </p>
                <p
                    onClick={() => handleTabClick("mycomment")}
                    style={{
                        cursor: 'pointer',
                        fontWeight: selectedTab === "mycomment" ? 'bold' : 'normal',
                        borderBottom: selectedTab === "mycomment" ? '4px solid white' : 'none',
                        paddingBottom: '4px'
                    }}
                >
                    My Comments
                </p>
            </div>


            <div className="text-white mt-4">
                {selectedTab === "posts" && (
                    <div className="custom-container">
                        <p><strong>Posts</strong></p>
                        {postsLoading ? (
                            <div className="loader-container text-center">
                                <RotatingLines
                                    strokeColor="grey"
                                    strokeWidth="5"
                                    animationDuration="0.75"
                                    width="50"
                                    visible={true}
                                />
                            </div>
                        ) : posts.length > 0 ? (
                            <div className="row">
                                {posts.map((post) => (
                                    <div key={post._id} className={`post-item col-lg-4 col-md-6 mb-3 ${post._id}`}>
                                        <div className="bg-successes bg-height p-3">
                                            <div className="post-title pb-3 text-white">{post.title}</div>
                                        </div>
                                        <Link to={`/postDetails/${post._id}`} className="post-link" onClick={() => handleImageClick(post._id)}>
                                            <img src={post.image} className="img-fluid d-block w-100" alt="Post Image" />
                                        </Link>
                                        <div className="bg-successes p-3">
                                            <div className="post-description pb-3 text-white">{truncateText(post.description)}</div>
                                        </div>
                                        <div className="icons d-flex justify-content-between text-white bg-successes p-3">
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
                                ))}
                            </div>
                        ) : (
                            <p>No posts available.</p>
                        )}
                    </div>
                )}

                {selectedTab === "about" && (
                    <div className='custom-container Profile-About'>
                        <div className='row'>
                            <div className='col-md-5'>
                                <h2 className='text-uppercase'><strong>About</strong> </h2>
                                <p className='bio-content'>{user.about || 'No bio available'}</p>

                                <div className='Profile-content'>
                                    <h2 className='text-uppercase'><strong>Joined</strong></h2>
                                    <div className='Profile-textCallout'>{new Date(user.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                </div>

                                <div className='Profile-content'>
                                    <h2 className='text-uppercase'><strong>Notoriety</strong> </h2>
                                    <p className='bio-content Profile-textCallout'>{user.notoriety || 'No notoriety available'}</p>
                                </div>

                                <div className='Profile-content'>
                                    <h2 className='text-uppercase'><strong>Medallions</strong> </h2>
                                    <ul className="list-unstyled d-flex gap-3">
                                        <li className="medallion-item">
                                            <img src={silver} alt="silver medallion" className="rounded-circle" width="70" height="70" />
                                            <div className="medallion-tooltip">
                                                Silver: <span>{user.medallions.silver}</span>
                                            </div>
                                        </li>
                                        <li className="medallion-item">
                                            <img src={gold} alt="silver medallion" className="rounded-circle" width="70" height="70" />
                                            <div className="medallion-tooltip">
                                                Gold: <span>{user.medallions.gold}</span>
                                            </div>
                                        </li>
                                        <li className="medallion-item">
                                            <img src={bronze} alt="silver medallion" className="rounded-circle" width="70" height="70" />
                                            <div className="medallion-tooltip">
                                                Platinum: <span>{user.medallions.platinum}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-7">
                                <h2 className="text-uppercase"><strong>Trophies</strong></h2>
                                <div className="row row-cols-2 row-cols-md-3 g-3">
  <div className="col trophy-item text-center">
    <img src={conversation_starter} alt="Conversation Starter Trophy" className="rounded-circle" width="150" height="150" />
    <div className="trophy-tooltip">
      <strong>Conversation Starter</strong><br />
      Awarded for starting engaging conversations.
    </div>
  </div>
  <div className="col trophy-item text-center">
    <img src={dawww} alt="Daww Trophy" className="rounded-circle" width="150" height="150" />
    <div className="trophy-tooltip">
      <strong>Daww</strong><br />
      Recognized for heartwarming content.
    </div>
  </div>
  <div className="col trophy-item text-center">
    <img src={oc} alt="OC Trophy" className="rounded-circle" width="150" height="150" />
    <div className="trophy-tooltip">
      <strong>OC Creator</strong><br />
      Awarded for original content creation.
    </div>
  </div>
  <div className="col trophy-item text-center">
    <img src={gone_mobile} alt="Gone Mobile Trophy" className="rounded-circle" width="150" height="150" />
    <div className="trophy-tooltip">
      <strong>Gone Mobile</strong><br />
      Given for active participation via mobile.
    </div>
  </div>
</div>

                            </div>
                        </div>
                    </div>
                )}

                {selectedTab === "comment" && (
                    <div className='custom-container p-4 mb-3'>
                        <p><strong>Comments</strong></p>
                        {postCommentsLoading ? (
                            <div className="loader-container text-center">
                                <RotatingLines
                                    strokeColor="grey"
                                    strokeWidth="5"
                                    animationDuration="0.75"
                                    width="50"
                                    visible={true}
                                />
                            </div>
                        ) : postComments.length > 0 ? (
                            postComments.map(comment => (
                                <div key={comment._id} className="comment-item p-3 mb-3" style={{ backgroundColor: '#474a51' }}>
                                    <p>{comment.text}</p>
                                    <span>By {comment.comment_user.username} on {new Date(comment.date).toLocaleDateString()}</span>
                                </div>
                            ))
                        ) : (
                            <p>No comments found.</p>
                        )}
                    </div>
                )}

                {selectedTab === "mycomment" && (
                    <div className='custom-container p-4 mb-3'>
                        <p><strong>Comments</strong></p>
                        {commentsLoading ? (
                            <div className="loader-container text-center">
                                <RotatingLines
                                    strokeColor="grey"
                                    strokeWidth="5"
                                    animationDuration="0.75"
                                    width="50"
                                    visible={true}
                                />
                            </div>
                        ) : comments.length > 0 ? (
                            comments.map(comment => (
                                <div key={comment._id} className="comment-item p-3 mb-3" style={{ backgroundColor: '#474a51' }}>
                                    <div className='d-flex justify-content-between'>
                                        <div>
                                            <p>{comment.text}</p>
                                            <span>By {comment.comment_user.username} on {new Date(comment.date).toLocaleDateString()}</span>
                                        </div>
                                        <button
                                            className="btn btn-sm btn-outline-light"
                                            onClick={() => {
                                                navigator.clipboard.writeText(comment.text);
                                                toast.success("Copied!");
                                            }}
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No comments found.</p>
                        )}
                    </div>
                )}
            </div>
        </Container>
    );
};

export default UserProfile;
