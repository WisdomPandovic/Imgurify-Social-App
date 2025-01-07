// src/reducer/reducer.js
const initialState = {
    posts: [],
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_POSTS':
            return {
                ...state,
                posts: action.payload.map(post => ({
                    ...post,
                    likes: post.likes || [], // Ensure likes array exists
                    comments: post.comments || [], // Ensure comments array exists
                })),
            };
        case 'LIKE_POST':
        case 'UNLIKE_POST':
            return {
                ...state,
                posts: state.posts.map(post =>
                    post._id === action.payload._id ? action.payload : post
                ),
            };
        default:
            return state;
    }
};

export default rootReducer;
