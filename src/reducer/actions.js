import { toast } from 'react-toastify';
import { handleErrorResponse, notifySuccess } from "../utils/helpers";

// Define action types
export const SET_POSTS = 'SET_POSTS';
export const LIKE_POST = 'LIKE_POST';
export const UNLIKE_POST = 'UNLIKE_POST';
export const UPDATE_VIEW_COUNT = 'UPDATE_VIEW_COUNT';

// Action creator to set posts in Redux state
export const setPosts = (posts) => ({
    type: SET_POSTS,
    payload: posts,
});

// Action creator to fetch posts from API
export const fetchPosts = () => async (dispatch) => {
    try {
        const response = await fetch('https://imgurif-api.onrender.com/api/post');
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        const posts = await response.json();
        dispatch(setPosts(posts)); // Dispatch setPosts action with fetched posts
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
};

// Update view count action
export const updateViewCount = (postId, viewCount) => ({
    type: UPDATE_VIEW_COUNT,
    payload: { postId, viewCount },
});

// Increment view count
export const incrementViewCount = (postId, user) => async (dispatch, getState) => {
    const currentPosts = getState().posts || [];
    const postToUpdate = currentPosts.find(post => post._id === postId);

    if (!postToUpdate) {
        toast.error("Post not found.");
        return;
    }

    // Optimistic Update
    const updatedPost = { 
        ...postToUpdate, 
        views: (postToUpdate.views || 0) + 1 
    };
    dispatch(updateViewCount(postId, updatedPost.views));

    const userId = user._id || user;

    if (!userId) {
        toast.error("User not found or invalid user data.");
        return;
    }

    console.log(`Sending POST request to increment view count for postId: ${postId}, userId: ${userId}`);

    try {
        const response = await fetch(`https://imgurif-api.onrender.com/api/post/${postId}/increment-view`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId })
        });

        const responseData = await response.json();
        console.log('Response from API:', responseData);

        if (responseData.viewCount !== undefined) {
            console.log('View count updated successfully:', responseData.viewCount);
            dispatch(updateViewCount(postId, responseData.viewCount)); // Sync with backend
        } else {
            throw new Error('Unexpected response');
        }
    } catch (error) {
        toast.error(`Error updating view count: ${error.message}`);
        handleErrorResponse(error);
    }
};





// Optimistic update in the likePost action creator
export const likePost = (postId, user) => async (dispatch, getState) => {
    const currentPosts = getState().posts || [];  // Ensure currentPosts is an array

    // Check if the post with the provided postId exists
    const postToUpdate = currentPosts.find(post => post._id === postId);

    if (!postToUpdate) {
        toast.error("Post not found.");
        return;
    }

    // Ensure likes field is always an array
    postToUpdate.likes = postToUpdate.likes || [];

    // Ensure we are comparing the correct ID (user._id)
    const userId = user._id || user; // Use user._id if user is an object, else assume it's the ID directly

    // Log to check the user and likes array
    console.log("User:", user);
    console.log("Likes Array:", postToUpdate.likes);

    // Before Dispatch - Log the likes array for the post being updated
    console.log("Before Dispatch - Post Likes Array:", postToUpdate.likes);

    // Check if the user has already liked the post
    if (postToUpdate.likes.includes(userId)) {
        toast.error("Post already liked.");
        return;
    }

    // Optimistically update the likes for the post
    const updatedPost = { 
        ...postToUpdate, 
        likes: [...postToUpdate.likes, userId] // Update the likes array for this post
    };
    
    // Dispatch the action with the single post object
    dispatch({ 
        type: 'LIKE_POST', 
        payload: updatedPost // This should be a single post, not an array of posts
    });
    

    // Log the optimistic update
    console.log("After Dispatch - Optimistic Update:", updatedPost);

    try {
        const response = await fetch(`https://imgurif-api.onrender.com/api/like/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user: userId }), // Send the correct user ID in the body
        });

        const responseData = await response.json();
        console.log("Backend Response:", responseData);

        if (responseData.msg === "Post has been liked") {
            // Update the post with the new likes array from the backend
            dispatch({ type: LIKE_POST, payload: responseData.post });
            toast.success("Post has been liked.");
        } else {
            throw new Error("Unexpected response");
        }
    } catch (error) {
        dispatch({ type: LIKE_POST, payload: currentPosts });
        toast.error(`Error liking post: ${error.message}`);
        handleErrorResponse(error);
    }
};


export const unlikePost = (postId, user) => async (dispatch, getState) => {
    const currentPosts = getState().posts || [];
    const userId = user._id || user;

    console.log('Dispatching UNLIKE_POST with:', { postId, userId });
  
    // Find the post and optimistically update the likes
    const updatedPosts = currentPosts.map(post =>
        post._id === postId
          ? { ...post, likes: post.likes.filter(like => like !== userId) } // Remove userId from the likes array
          : post
    );
    
    // Optimistically update the state with the modified post
    dispatch({ type: UNLIKE_POST, payload: { postId, likes: updatedPosts.find(post => post._id === postId).likes } });
  
    try {
        const response = await fetch(`https://imgurif-api.onrender.com/api/unlike/${postId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: userId })
        });
    
        const responseData = await response.json();
    
        if (responseData.likes) {
            // If the backend responds with a new likes array, update the state with it
            dispatch({ type: UNLIKE_POST, payload: { postId, likes: responseData.likes } });
            toast.success("Post has been unliked.");
        } else if (responseData.msg === "Post has been unliked") { 
            // If the backend confirms the unlike but doesn't provide the updated likes array
            const updatedPostResponse = await fetch(`https://imgurif-api.onrender.com/api/post/${postId}`); 
            const updatedPost = await updatedPostResponse.json();
    
            if (updatedPost) {
                // Update the state with the fetched post data
                dispatch({ type: UNLIKE_POST, payload: { postId, likes: updatedPost.likes } });
                console.log('Updated Post:', updatedPost);
                toast.success("Post has been unliked.");
            } else {
                toast.error("Error fetching updated post data after unliking.");
            }
        } else {
            const errorMessage = responseData.msg || "Error unliking post.";
            dispatch({ type: UNLIKE_POST, payload: { postId, likes: currentPosts.find(post => post._id === postId).likes } });
            toast.error(errorMessage);
        }
    } catch (error) {
        dispatch({ type: UNLIKE_POST, payload: { postId, likes: currentPosts.find(post => post._id === postId).likes } });
        toast.error(error);
    }
};

