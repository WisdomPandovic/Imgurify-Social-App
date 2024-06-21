// src/reducer/actions.js

export const likePost = (postId, user) => async (dispatch) => {
  try {
      const response = await fetch(`http://localhost:3007/likes/${postId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user}), // Include user ID in the request body
      });
      if (response.ok) {
          const updatedPost = await response.json();
          dispatch({ type: 'LIKE_POST', payload: updatedPost });
      } else {
          console.error('Failed to like post');
      }
  } catch (error) {
      console.error('Error liking post:', error);
  }
};

export const unlikePost = (postId, user) => async (dispatch) => {
  try {
      const response = await fetch(`http://localhost:3007/unlike/${postId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user }), // Include user ID in the request body
      });
      if (response.ok) {
          const updatedPost = await response.json();
          dispatch({ type: 'UNLIKE_POST', payload: updatedPost });
      } else {
          console.error('Failed to unlike post');
      }
  } catch (error) {
      console.error('Error unliking post:', error);
  }
};


export const setPosts = (posts) => ({
  type: 'SET_POSTS',
  payload: posts,
});
