import {
  INSERT_COMMENT,
  SET_NEW_COMMENTS,
  INSERT_UPVOTE,
  REMOVE_UPVOTE,
  INSERT_DOWNVOTE,
  REMOVE_DOWNVOTE,
  TOGGLE_ERROR_MODAL,
  SET_LOGIN_SIGNUP_REQUIRED,
  FETCHING_COMMENTS,
  SET_USERNAME
} from "./actions";

const rootReducer = (state, action) => {
  switch (action.type) {
    case SET_USERNAME:
      return {
        ...state,
        username: action.payload
      };
    case FETCHING_COMMENTS:
      return {
        ...state,
        fetchingComments: action.payload
      };
    case SET_LOGIN_SIGNUP_REQUIRED:
      return {...state,
        loginRequired: action.payload
      };
    case TOGGLE_ERROR_MODAL:
      return {
        ...state,
        toggleErrorMessage: action.payload
      };
    case SET_NEW_COMMENTS:
      return  {
        ...state,
        comments: [...action.payload]
      };
    case INSERT_COMMENT:
      return {
        ...state,
        comments: [...state.comments,
          {...action.payload, commenterUsername:state.username}
        ]
      };
    case INSERT_UPVOTE:
      return {
        ...state,
        comments: state.comments.map(comment=>{
          if (comment.id === action.payload.id) {
            let updatedComment = { ...comment, ...action.payload };
            return updatedComment;
          }
          return comment;
        })
      };
    case INSERT_DOWNVOTE:
      return {
        ...state,
        comments: state.comments.map(comment => {
          if (comment.id === action.payload.id) {
            let updatedComment = { ...comment, ...action.payload };
            return updatedComment;
          }
          return comment;
        })
      };
    case REMOVE_UPVOTE:
      return {
        ...state,
        comments: state.comments.map(comment => {
          if (comment.id === action.payload.id) {
            let updatedComment = { ...comment, ...action.payload };
            updatedComment.upvoted = false;
            updatedComment.downvoted = false;
            return updatedComment;
          }
          return comment;
        })
      };
    case REMOVE_DOWNVOTE:
      return {
        ...state,
        comments: state.comments.map(comment => {
          if (comment.id === action.payload.id) {
            let updatedComment = { ...comment, ...action.payload };
            updatedComment.upvoted = false;
            updatedComment.downvoted = false;
            return updatedComment;
          }
          return comment;
        })
      };
    default:
      return state;
  }
};

export default rootReducer;