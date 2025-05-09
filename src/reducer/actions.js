import { toast } from 'react-toastify';
import { handleErrorResponse, notifySuccess } from "../utils/helpers";

// Define action types
export const SET_POSTS = 'SET_POSTS';
export const LIKE_POST = 'LIKE_POST';
export const UNLIKE_POST = 'UNLIKE_POST';
export const UPDATE_VIEW_COUNT = 'UPDATE_VIEW_COUNT';
export const SET_POPULAR_POSTS = 'SET_POPULAR_POSTS';
export const SET_TAG_POSTS = 'SET_TAG_POSTS';
export const SET_USER_POSTS = 'SET__USER_POSTS';

// Action creator to set posts in Redux state
export const setPosts = (posts) => ({
    type: SET_POSTS,
    payload: posts,
});

export const setPopularPosts = (posts) => ({
    type: SET_POPULAR_POSTS,
    payload: posts,
});

export const setTagPosts = (posts) => ({
    type: SET_TAG_POSTS,
    payload: posts,
});

export const setUserPosts = (posts) => ({
    type: SET_USER_POSTS,
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

        // Sort the posts by 'createdAt' field in descending order
        const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        dispatch(setPosts(sortedPosts)); // Dispatch setPosts action with sorted posts
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
};

export const fetchPopularPosts = () => async (dispatch) => {
    try {
        const response = await fetch('https://imgurif-api.onrender.com/api/posts/popular');
        if (!response.ok) {
            throw new Error('Failed to fetch popular posts');
        }
        const posts = await response.json();

        // Dispatch the setPopularPosts action with the received posts
        dispatch(setPopularPosts(posts));
        // notifySuccess('Popular posts fetched successfully!');
    } catch (error) {
        console.error('Error fetching popular posts:', error);
        toast.error('Failed to fetch popular posts. Please try again later.');
        handleErrorResponse(error);
    }
};

export const fetchTagPosts = (_id) => async (dispatch) => {
    try {
        const response = await fetch(`https://imgurif-api.onrender.com/api/tag/${_id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch tag posts');
        }
        const data = await response.json();
        // console.log('fetchtagPost', data); // Check if the data is correct

        // Dispatch the setTagPosts action with the received posts
        dispatch(setTagPosts(data.post)); // Dispatch the posts directly
        return data; // Return the data so it can be logged in the component
    } catch (error) {
        console.error('Error fetching tag posts:', error);
        toast.error('Failed to fetch tag posts. Please try again later.');
        handleErrorResponse(error);
        throw error; // Rethrow error for handling in the component
    }
};

export const fetchUserPosts = (username) => async (dispatch) => {
    try {
        const response = await fetch(`https://imgurif-api.onrender.com/api/user/${username}/posts`);
        if (!response.ok) {
            throw new Error('Failed to fetch user posts');
        }

        const posts = await response.json();
        console.log('Fetched Posts:', posts); // Log fetched posts

        dispatch({ type: 'SET_USER_POSTS', payload: posts });
        console.log('Dispatched SET_USER_POSTS'); // Log action dispatch
    } catch (error) {
        console.error('Error fetching user posts:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
    }
};

// Update view count action
export const updateViewCount = (postId, viewCount) => ({
    type: UPDATE_VIEW_COUNT,
    payload: { postId, viewCount },
});

export const incrementViewCount = (postId, user) => async (dispatch, getState) => {
    // Fetch both regular posts and popular posts from the state
    const currentPosts = getState().posts || [];
    const popularPosts = getState().popularPosts || [];
    const tagPosts = getState().tagPosts || [];
    const userPosts = getState().userPosts || [];

    // Find the post in both regular and popular posts
    let postToUpdate = currentPosts.find(post => post._id === postId) ||
        popularPosts.find(post => post._id === postId) ||
        tagPosts.find(post => post._id === postId) ||
        userPosts.find(post => post._id === postId)

    if (!postToUpdate) {
        toast.error("Post not found.");
        return;
    }

    // Optimistic Update
    const updatedPost = {
        ...postToUpdate,
        views: (postToUpdate.views || 0) + 1
    };

    // Dispatch the view count update for regular posts, popular posts, and tag posts
    if (currentPosts.find(post => post._id === postId)) {
        // If the post is found in regular posts, update the view count for regular posts
        dispatch(updateViewCount(postId, updatedPost.views));
    } else if (popularPosts.find(post => post._id === postId)) {
        // If the post is found in popular posts, update the view count for popular posts
        dispatch(updateViewCount(postId, updatedPost.views));
    } else if (tagPosts.find(post => post._id === postId)) {
        // If the post is found in tagPosts, update the view count for tag posts
        dispatch(updateViewCount(postId, updatedPost.views));
    } else if (userPosts.find(post => post._id === postId)) {
        // If the post is found in userPosts, update the view count for user posts
        dispatch(updateViewCount(postId, updatedPost.views));
    }
    else {
        // If the post isn't found in any of the arrays, handle the case accordingly
        console.error("Post not found in any category");
    }

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
            // Sync with backend for both regular and popular posts
            if (currentPosts.find(post => post._id === postId)) {
                dispatch(updateViewCount(postId, responseData.viewCount)); // Regular posts
            } else {
                dispatch(updateViewCount(postId, responseData.viewCount)); // Popular posts
            }
        } else {
            throw new Error('Unexpected response');
        }
    } catch (error) {
        toast.error(`Error updating view count: ${error.message}`);
        handleErrorResponse(error);
    }
};

// Optimistic update in the likePost action creator
export const likePost = (postId, user, isPopular = false, isTag = false, isUserPost = false) => async (dispatch, getState) => {
    const state = getState();
    let posts = isPopular ? state.popularPosts : state.posts;  // Regular or popular posts
    if (isTag) {
        posts = state.tagPosts; // Use tagPosts if it's a tag-related post
    }

    if (isUserPost) {
        posts = state.userPosts; // Use tagPosts if it's a tag-related post
    }

    const postToUpdate = posts.find(post => post._id === postId);

    if (!postToUpdate) {
        toast.error("Post not found.");
        return;
    }

    postToUpdate.likes = postToUpdate.likes || [];
    const userId = user._id || user;

    if (postToUpdate.likes.includes(userId)) {
        toast.info("Post already liked.");
        return;
    }

    // Optimistic update
    const updatedPost = {
        ...postToUpdate,
        likes: [...postToUpdate.likes, userId]
    };

    // Dispatch action based on the post type
    if (isPopular) {
        dispatch({ type: LIKE_POST, payload: updatedPost }); // Dispatch for popular posts
    } else if (isTag) {
        dispatch({ type: LIKE_POST, payload: updatedPost }); // Dispatch for tag posts
    } else if (isUserPost) {
        dispatch({ type: LIKE_POST, payload: updatedPost }); // Dispatch for user posts
    } else {
        dispatch({ type: LIKE_POST, payload: updatedPost }); // Dispatch for regular posts
    }

    try {
        const response = await fetch(`https://imgurif-api.onrender.com/api/like/${postId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: userId })
        });

        const responseData = await response.json();

        if (responseData.msg === "Post has been liked") {
            dispatch({ type: LIKE_POST, payload: responseData.post });
            toast.success("Post has been liked.");
        } else {
            throw new Error("Unexpected response");
        }
    } catch (error) {
        toast.error(`Error liking post: ${error.message}`);
    }
};

// export const likePost = (postId, user, isPopular = false, isTag = false, isUserPost = false) => async (dispatch, getState) => {
//     const state = getState();
//     let posts = isPopular ? state.popularPosts : state.posts; // Regular or popular posts
//     if (isTag) {
//         posts = state.tagPosts; // Use tagPosts if it's a tag-related post
//     }

//     if (isUserPost) {
//         posts = state.userPosts; // Use userPosts if it's a user-related post
//     }

//     const postToUpdate = posts.find(post => post._id === postId);

//     if (!postToUpdate) {
//         toast.error("Post not found.");
//         return;
//     }

//     postToUpdate.likes = postToUpdate.likes || [];

//     // Validate user and userId
//     if (!user || !user._id) {
//         console.log("Invalid user object:", user);
//         toast.error("You need to sign in to like a post.");
//         return;
//     }
//     const userId = user._id;

//     if (postToUpdate.likes.includes(userId)) {
//         toast.info("Post already liked.");
//         return;
//     }

//     // Optimistic update
//     const updatedPost = {
//         ...postToUpdate,
//         likes: [...postToUpdate.likes, userId]
//     };

//     // Dispatch action based on the post type
//     if (isPopular) {
//         dispatch({ type: LIKE_POST, payload: updatedPost }); // Dispatch for popular posts
//     } else if (isTag) {
//         dispatch({ type: LIKE_POST, payload: updatedPost }); // Dispatch for tag posts
//     } else if (isUserPost) {
//         dispatch({ type: LIKE_POST, payload: updatedPost }); // Dispatch for user posts
//     } else {
//         dispatch({ type: LIKE_POST, payload: updatedPost }); // Dispatch for regular posts
//     }

//     try {
//         const response = await fetch(`https://imgurif-api.onrender.com/api/like/${postId}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ user: userId })
//         });

//         const responseData = await response.json();

//         if (responseData.msg === "Post has been liked") {
//             dispatch({ type: LIKE_POST, payload: responseData.post });
//             toast.success("Post has been liked.");
//         } else {
//             throw new Error("Unexpected response");
//         }
//     } catch (error) {
//         toast.error(`Error liking post: ${error.message}`);
//     }
// };

export const unlikePost = (postId, user, isPopular = false, isTag = false, isUserPost = false) => async (dispatch, getState) => {
    const state = getState();
    let posts = isPopular ? state.popularPosts : state.posts;  // Regular or popular posts
    if (isTag) {
        posts = state.tagPosts; // Use tagPosts if it's a tag-related post
    }

    if (isUserPost) {
        posts = state.userPosts; // Use userPosts if it's a user-related post
        console.log("User posts:", posts);
    }

    const userId = user._id || user;
    const updatedPosts = posts.map(post =>
        post._id === postId
            ? { ...post, likes: post.likes.filter(like => like !== userId) }
            : post
    );

    // Dispatch action based on the post type
    if (isPopular) {
        dispatch({ type: UNLIKE_POST, payload: { postId, likes: updatedPosts.find(post => post._id === postId).likes } });
    } else if (isTag) {
        dispatch({ type: UNLIKE_POST, payload: { postId, likes: updatedPosts.find(post => post._id === postId).likes } });
    } else if (isUserPost) {
        dispatch({ type: UNLIKE_POST, payload: { postId, likes: updatedPosts.find(post => post._id === postId).likes } });
    }
     else {
        dispatch({ type: UNLIKE_POST, payload: { postId, likes: updatedPosts.find(post => post._id === postId).likes } });
    }

    try {
        const response = await fetch(`https://imgurif-api.onrender.com/api/unlike/${postId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: userId })
        });

        const responseData = await response.json();

        if (responseData.msg === "User has not liked this post") {
            toast.info("You have not liked this post yet.");
        } else if (responseData.likes) {
            dispatch({ type: UNLIKE_POST, payload: { postId, likes: responseData.likes } });
            toast.success("Post has been unliked.");
        } else {
            throw new Error("Unexpected response");
        }
    } catch (error) {
        toast.error(`Error unliking post: ${error.message}`);
        // Optionally, you can add a custom error handler here
        handleErrorResponse(error);
    }
};


// export const unlikePost = (postId, user, isPopular = false, isTag = false, isUserPost = false) => async (dispatch, getState) => {
//     const state = getState();
//     let posts = isPopular ? state.popularPosts : state.posts; // Regular or popular posts
//     if (isTag) {
//         posts = state.tagPosts; // Use tagPosts if it's a tag-related post
//     }

//     if (isUserPost) {
//         posts = state.userPosts; // Use userPosts if it's a user-related post
//         console.log("User posts:", posts);
//     }

//     // Validate user and userId
//     if (!user || !user._id) {
//         toast.error("You need to sign in to unlike a post.");
//         return;
//     }
//     const userId = user._id;

//     const updatedPosts = posts.map(post =>
//         post._id === postId
//             ? { ...post, likes: post.likes.filter(like => like !== userId) }
//             : post
//     );

//     // Dispatch action based on the post type
//     if (isPopular) {
//         dispatch({ type: UNLIKE_POST, payload: { postId, likes: updatedPosts.find(post => post._id === postId).likes } });
//     } else if (isTag) {
//         dispatch({ type: UNLIKE_POST, payload: { postId, likes: updatedPosts.find(post => post._id === postId).likes } });
//     } else if (isUserPost) {
//         dispatch({ type: UNLIKE_POST, payload: { postId, likes: updatedPosts.find(post => post._id === postId).likes } });
//     } else {
//         dispatch({ type: UNLIKE_POST, payload: { postId, likes: updatedPosts.find(post => post._id === postId).likes } });
//     }

//     try {
//         const response = await fetch(`https://imgurif-api.onrender.com/api/unlike/${postId}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ user: userId })
//         });

//         const responseData = await response.json();

//         if (responseData.msg === "User has not liked this post") {
//             toast.info("You have not liked this post yet.");
//         } else if (responseData.likes) {
//             dispatch({ type: UNLIKE_POST, payload: { postId, likes: responseData.likes } });
//             toast.success("Post has been unliked.");
//         } else {
//             throw new Error("Unexpected response");
//         }
//     } catch (error) {
//         toast.error(`Error unliking post: ${error.message}`);
//         // Optionally, you can add a custom error handler here
//         handleErrorResponse(error);
//     }
// };
