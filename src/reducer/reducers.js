// const initialState = {
//     posts: [],
//     popularPosts: [],
//     error: null,
// };

// const rootReducer = (state = initialState, action) => {
//     const updatePost = (_id, update) =>
//         Array.isArray(state.posts) // Ensure posts is an array before calling map
//             ? state.posts.map(post =>
//                 post._id === _id ? { ...post, ...update } : post
//             )
//             : [];  // Return an empty array if posts isn't an array (fallback)

//     switch (action.type) {
//         case 'SET_POSTS':
//             return {
//                 ...state,
//                 posts: Array.isArray(action.payload) ? action.payload.map(post => ({
//                     ...post,
//                     likes: post.likes || [],
//                     comments: post.comments || [],
//                     views: post.views || 0,
//                 })) : [], // Ensure payload is an array
//             };

//         case 'LIKE_POST':
//             console.log('Action Payload:', action.payload); // Debugging the payload
//             const updatedPosts = updatePost(action.payload._id, { likes: action.payload.likes });
//             console.log('Updated Posts:', updatedPosts); // Debugging updated posts
//             return {
//                 ...state,
//                 posts: updatedPosts,
//             };

//         case 'UNLIKE_POST':
//             console.log('Action Payload unlike:', action.payload);
//             return {
//                 ...state,
//                 posts: state.posts.map(post =>
//                     post._id === action.payload.postId
//                         ? { ...post, likes: action.payload.likes }
//                         : post
//                 ),
//             };

//         case 'UPDATE_VIEWS':
//             return {
//                 ...state,
//                 posts: updatePost(action.payload._id, { views: action.payload.views }),
//             };

//         case 'SET_POPULAR_POSTS':
//             return {
//                 ...state,
//                 popularPosts: Array.isArray(action.payload) ? action.payload : [],
//             };

//         case 'SET_ERROR':
//             return {
//                 ...state,
//                 error: action.payload,
//             };

//         default:
//             return state;
//     }
// };

// export default rootReducer;


const initialState = {
    posts: [],
    popularPosts: [],
    tagPosts: [],
    error: null,
};

const rootReducer = (state = initialState, action) => {
    const updatePost = (_id, update, targetArray) => {
        // Update the target array (either posts or popularPosts)
        return targetArray.map(post =>
            post._id === _id ? { ...post, ...update } : post
        );
    };

    switch (action.type) {
        case 'SET_POSTS':
            return {
                ...state,
                posts: Array.isArray(action.payload) ? action.payload.map(post => ({
                    ...post,
                    likes: post.likes || [],
                    comments: post.comments || [],
                    views: post.views || 0,
                })) : [],
            };

        case 'LIKE_POST':
            console.log('Action Payload:', action.payload);
            // Update both posts and popularPosts
            const updatedPosts = updatePost(action.payload._id, { likes: action.payload.likes }, state.posts);
            const updatedPopularPosts = updatePost(action.payload._id, { likes: action.payload.likes }, state.popularPosts);
            const updatedTagPosts = updatePost(action.payload._id, { likes: action.payload.likes }, state.tagPosts);
            return {
                ...state,
                posts: updatedPosts,
                popularPosts: updatedPopularPosts,
                tagPosts: updatedTagPosts,
            };

        case 'UNLIKE_POST':
            console.log('Action Payload unlike:', action.payload);
            const updatedPostsAfterUnlike = updatePost(action.payload.postId, { likes: action.payload.likes }, state.posts);
            const updatedPopularPostsAfterUnlike = updatePost(action.payload.postId, { likes: action.payload.likes }, state.popularPosts);
            const updatedTagPostsAfterUnlike = updatePost(action.payload.postId, { likes: action.payload.likes }, state.tagPosts);
            return {
                ...state,
                posts: updatedPostsAfterUnlike,
                popularPosts: updatedPopularPostsAfterUnlike,
                tagPosts: updatedTagPostsAfterUnlike,
            };

        case 'UPDATE_VIEWS':
            const updatedPostsViews = updatePost(action.payload._id, { views: action.payload.views }, state.posts);
            const updatedPopularPostsViews = updatePost(action.payload._id, { views: action.payload.views }, state.popularPosts);
            const updatedTagPostsViews = updatePost(action.payload._id, { views: action.payload.views }, state.tagPosts);
            return {
                ...state,
                posts: updatedPostsViews,
                popularPosts: updatedPopularPostsViews,
                tagPosts: updatedPopularPostsViews,
            };

        case 'SET_POPULAR_POSTS':
            return {
                ...state,
                popularPosts: Array.isArray(action.payload) ? action.payload : [],
            };

            case 'SET_TAG_POSTS':
                return {
                    ...state,
                    tagPosts: Array.isArray(action.payload) && action.payload.length ? action.payload : [],
                };            

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
            };

        default:
            return state;
    }
};

export default rootReducer;
