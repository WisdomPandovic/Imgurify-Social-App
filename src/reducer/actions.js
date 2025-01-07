import { toast } from 'react-toastify';

// Define action types
export const SET_POSTS = 'SET_POSTS';
export const LIKE_POST = 'LIKE_POST';
export const UNLIKE_POST = 'UNLIKE_POST';

// Action creator to set posts in Redux state
export const setPosts = (posts) => ({
    type: SET_POSTS,
    payload: posts,
});

// Action creator to fetch posts from API
export const fetchPosts = () => async (dispatch) => {
    try {
        const response = await fetch('https://imgurif-api.onrender.com/api/posts');
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        const posts = await response.json();
        dispatch(setPosts(posts)); // Dispatch setPosts action with fetched posts
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
};

// Action creator to like a post
export const likePost = (postId, user) => async (dispatch) => {
    try {
        const response = await fetch(`https://imgurif-api.onrender.com/api/likes/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user }), // Include user ID in the request body
        });
        if (response.ok) {
            const updatedPost = await response.json();
            dispatch({ type: LIKE_POST, payload: updatedPost });
            toast.success("Post has been liked.");
        } else {
            console.error('Failed to like post');
        }
    } catch (error) {
        console.error('Error liking post:', error);
    }
};

// Action creator to unlike a post
export const unlikePost = (postId, user) => async (dispatch) => {
    try {
        const response = await fetch(`https://imgurif-api.onrender.com/api/unlike/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user }), // Include user ID in the request body
        });
        if (response.ok) {
            const updatedPost = await response.json();
            dispatch({ type: UNLIKE_POST, payload: updatedPost });
            toast.success("You have unliked this post");
        } else {
            console.error('Failed to unlike post');
        }
    } catch (error) {
        console.error('Error unliking post:', error);
    }
};
