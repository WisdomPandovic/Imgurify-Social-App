import { useContext, useEffect } from "react";
import { Container } from 'react-bootstrap';
import { AiOutlineShareAlt } from 'react-icons/ai';
import { GoComment } from 'react-icons/go';
import { TbArrowBigUp, TbArrowBigDown } from 'react-icons/tb';
import { AiOutlineHeart } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, unlikePost, fetchPosts } from '../../reducer/actions';
import { ImgurContext } from '../Context/ImgurContext';

function SideCounters({ data }) {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.posts);
  const { userID } = useContext(ImgurContext);

  useEffect(() => {
    dispatch(fetchPosts()); // Dispatch fetchPosts action on component mount
}, [dispatch]);

   // Log data._id to check if it matches any post in Redux state
   console.log('Data ID:', data?._id);

   // Find the specific post data from the state using the data._id
   const post = posts.find(post => post._id === data?._id) || {};

   console.log('Data ID:', data?._id);
   console.log('Post:', post);
   console.log('Post in SideCounters:', post);

  const handleLikeClick = (postId) => {
    console.log("Like button clicked for post ID:", postId);
    dispatch(likePost(postId, userID));
  };

  const handleUnlikeClick = (postId) => {
    console.log("Unlike button clicked for post ID:", postId);
    dispatch(unlikePost(postId, userID));
  };
  
  console.log("Post in SideCounters:", post);

  if (!post) {
    return <div>Post not found or data is missing</div>; // Safely handle missing post data
  }

  if (!data) {
    return <div>Loading post data...</div>;
  }

  return (
    <Container fluid className="mt-3">
      <section id="like-section" className="d-flex flex-column justify-content-center align-items-center">
        <Container className="sidecounter mt-5 pb-3 pt-3">
          <TbArrowBigUp className='text-white iconz' onClick={() => handleLikeClick(data._id)} />
          <span className="d-block text-white">{data.likes?.length || 0}</span>
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
          <span className="d-block">{data.comments?.length || 0}</span>
        </Container>
      </section>
    </Container>
  );
}

export default SideCounters;
