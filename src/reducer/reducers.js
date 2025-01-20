// const initialState = {
//     posts: [],
// };

// const rootReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case 'SET_POSTS':
//             return {
//                 ...state,
//                 posts: action.payload.map(post => ({
//                     ...post,
//                     likes: post.likes || [], // Ensure likes array exists
//                     comments: post.comments || [], // Ensure comments array exists
//                     views: post.views || 0, // Ensure views property exists
//                 })),
//             };

//         case 'LIKE_POST':
//         case 'UNLIKE_POST':
//             return {
//                 ...state,
//                 posts: state.posts.map(post =>
//                     post._id === action.payload._id // Compare by post ID
//                         ? { ...post, likes: action.payload.likes } // Update likes array for the post
//                         : post
//                 ),
//             };

//         case 'UPDATE_VIEWS':
//             return {
//                 ...state,
//                 posts: state.posts.map(post =>
//                     post._id === action.payload._id // Compare by post ID
//                         ? { ...post, views: action.payload.views } // Update views for the post
//                         : post
//                 ),
//             };

//         default:
//             return state;
//     }
// };

// export default rootReducer;


const initialState = {
    posts: [],
};

const rootReducer = (state = initialState, action) => {
    const updatePost = (_id, update) =>
        Array.isArray(state.posts) // Ensure posts is an array before calling map
            ? state.posts.map(post =>
                post._id === _id ? { ...post, ...update } : post
            )
            : [];  // Return an empty array if posts isn't an array (fallback)

    switch (action.type) {
        case 'SET_POSTS':
            return {
                ...state,
                posts: Array.isArray(action.payload) ? action.payload.map(post => ({
                    ...post,
                    likes: post.likes || [],
                    comments: post.comments || [],
                    views: post.views || 0,
                })) : [], // Ensure payload is an array
            };

        case 'LIKE_POST':
            console.log('Action Payload:', action.payload); // Debugging the payload
            const updatedPosts = updatePost(action.payload._id, { likes: action.payload.likes });
            console.log('Updated Posts:', updatedPosts); // Debugging updated posts
            return {
                ...state,
                posts: updatedPosts,
            };

            case 'UNLIKE_POST':
                console.log('Action Payload unlike:', action.payload);
            return {
                ...state,
                posts: state.posts.map(post =>
                    post._id === action.payload.postId
                        ? { ...post, likes: action.payload.likes }
                        : post
                ),
            };
    
        case 'UPDATE_VIEWS':
            return {
                ...state,
                posts: updatePost(action.payload._id, { views: action.payload.views }),
            };

        default:
            return state;
    }
};

export default rootReducer;
