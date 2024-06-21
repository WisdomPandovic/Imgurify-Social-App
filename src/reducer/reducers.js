// src/reducer/reducer.js
const initialState = {
    posts: [],
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_POSTS':
            return {
                ...state,
                posts: action.payload,
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
