

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
    dispatch(fetchPosts()); // Fetch posts on mount
  }, [dispatch]);

  // Find the specific post data using the post ID
  const post = posts.find(post => post._id === data?._id);

  const handleLikeClick = (postId) => {
    dispatch(likePost(postId, userID));
  };

  const handleUnlikeClick = (postId) => {
    dispatch(unlikePost(postId, userID));
  };

  // Guard clause for missing post
  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <Container fluid className="mt-3">
      <section id="like-section" className="d-flex flex-column justify-content-center align-items-center">
        <Container className="sidecounter mt-5 pb-3 pt-3">
          <TbArrowBigUp className='text-white iconz' onClick={() => handleLikeClick(data._id)} />
          <span className="d-block text-white">{post?.likes?.length || 0}</span>
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
          <span className="d-block">{post.comments?.length || 0}</span>
        </Container>
      </section>
    </Container>
  );
}

export default SideCounters;

