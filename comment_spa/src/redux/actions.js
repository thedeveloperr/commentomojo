import fetch from 'cross-fetch';

export const INSERT_COMMENT = 'INSERT_COMMENT';
export const INSERT_UPVOTE = 'UPVOTE';
export const INSERT_DOWNVOTE = 'DOWNVOTE';
export const REMOVE_UPVOTE = 'REMOVE_UPVOTE'
export const REMOVE_DOWNVOTE = 'REQUEST_BUS_DETAILS';
export const SET_LOGIN_SIGNUP_REQUIRED = 'SET_LOGIN_SIGNUP_REQUIRED';
export const SET_NEW_COMMENTS = 'SET_NEW_COMMENTS';
export const TOGGLE_ERROR_MODAL = 'TOGGLE_ERROR_MODAL';
export const FETCHING_COMMENTS = 'FETCHING_COMMENTS';
export const SET_USERNAME = 'SET_USERNAME';

export function setUsername(payload) {
  return {
    type: SET_USERNAME,
    payload
  }
}

export function setFetchingComments(payload) {
  return {
    type: FETCHING_COMMENTS,
    payload
  }
}


export function insertComment(payload) {
  return {
    type: INSERT_COMMENT,
    payload
  }
}

export function insertUpvoteAndUpdateComment(payload) {
  return {
    type: INSERT_UPVOTE,
    payload
  }
}

export function insertDownvoteAndUpdateComment(payload) {
  return {
    type: INSERT_DOWNVOTE,
    payload
  }
}

export function setLoginSignupRequired(payload) {
  return {
    type: SET_LOGIN_SIGNUP_REQUIRED,
    payload
  }
}

export function removeUpvoteAndUpdateComment(payload) {
  return {
    type: REMOVE_UPVOTE,
    payload
  }
}

export function removeDownvoteAndUpdateComment(payload) {
  return {
    type: REMOVE_DOWNVOTE,
    payload
  }
}

export function setNewComments(payload) {
  return {
    type: SET_NEW_COMMENTS,
    payload
  }
}

export function toggleErrorModal(payload) {
  return {
    type: TOGGLE_ERROR_MODAL,
    payload
  }
}

export function postLoginRequestToServer(username, password) {
  return async dispatch => {
    try {
      const response = await fetch(`/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          username, password
        }),
      });
      const resObject = await response.json();
      if (response.status === 200) {
        dispatch(setLoginSignupRequired(false));
        dispatch(setUsername(username));
        window.location.reload();
      }
      else {
        window.alert(resObject.message);
      }
    } catch (err) {
      console.error(err);
    }
  };
}

export function logout() {
  return async dispatch => {
    try {
      const response = await fetch(`/user/session`, {
        method: "DELETE",
        credentials: 'include'
      });
      const resObject = await response.json();
      if (response.status === 200) {
        dispatch(setLoginSignupRequired(true));
        dispatch(setUsername(""));
        window.location.reload();
      }
      else {
        window.alert(resObject.message);
      }
    } catch (err) {
      console.error(err);
    }
  };
}

export function postCommentToServer(parentPostId, text) {
  return async dispatch => {
    try {
      const response = await fetch(`/${parentPostId}/comments/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
            comment: {
                parentPostId, text
            }
        }),
        credentials: 'include'
      });
      const resObject = await response.json();
      if (response.status === 401) {
        dispatch(setLoginSignupRequired({ message: resObject.message }));
      }
      else {
        dispatch(setLoginSignupRequired(false));
        dispatch(insertComment(resObject.data.comment));
      }

    } catch (err) {
      console.error(err);
    }
  };
}

export function putUpvoteOnServer(parentPostId, parentCommentId) {
  return async dispatch => {
    try {
      const response = await fetch(`/${parentPostId}/comments/${parentCommentId}/upvote`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
        },
        credentials: 'include'
      });
      const resObject = await response.json();
      if (response.status === 200) {
        dispatch(setLoginSignupRequired(false));
        dispatch(insertUpvoteAndUpdateComment(resObject.data.comment));
      } else if (response.status === 401) {
        dispatch(setLoginSignupRequired({ message: resObject.message }));
      }
      else {
        window.alert(resObject.message);
        console.warn(resObject.message);
      }
    } catch (err) {
      console.error(err);
    }
  };
}

export function deleteUpvoteFromServer(parentPostId, parentCommentId) {
  return async dispatch => {
    try {
      const response = await fetch(`/${parentPostId}/comments/${parentCommentId}/upvote`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
        },
        credentials: 'include'
      });
      const resObject = await response.json()
      if (response.status === 200) {
        dispatch(setLoginSignupRequired(false));
        dispatch(removeUpvoteAndUpdateComment(resObject.data.comment));
      } else if (response.status === 401) {
        dispatch(setLoginSignupRequired({ message: resObject.message }));
      }
      else {
        window.alert(resObject.message);
        console.warn(resObject.message);
      }
    } catch (err) {
        console.error(err);
    }
  };
}

export function putDownvoteOnServer(parentPostId, parentCommentId) {
  return async dispatch => {
    try {
      const response = await fetch(`/${parentPostId}/comments/${parentCommentId}/downvote`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
        },
        credentials: 'include'
      });
      const resObject = await response.json();
      if (response.status === 200) {
        dispatch(setLoginSignupRequired(false));
        dispatch(insertDownvoteAndUpdateComment(resObject.data.comment));
      } else if (response.status === 401) {
        dispatch(setLoginSignupRequired({ message: resObject.message }));
      }
      else {
        window.alert(resObject.message);
        console.warn(resObject.message);
      }
    } catch (err) {
      console.error(err);
    }
  };
}

export function deleteDownvoteFromServer(parentPostId, parentCommentId) {
  return async dispatch => {
    try {
      const response = await fetch(`/${parentPostId}/comments/${parentCommentId}/downvote`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
        },
        credentials: 'include'
      });
      const resObject = await response.json();
      if (response.status === 401) {
        dispatch(setLoginSignupRequired({ message: resObject.message }));
      }
      else {
        dispatch(setLoginSignupRequired(false));
        dispatch(removeDownvoteAndUpdateComment(resObject.data.comment));
      }
    } catch (err) {
      console.error(err);
    }
  };
}

export function fetchComments(parentPostId, lastCommentId, limit) {
  return async dispatch => {
    let requestUrl = `/${parentPostId}/comments/`;
    if (lastCommentId) requestUrl += `?lastComment=${lastCommentId}`;
    if (limit) requestUrl += `&limit=${limit}`;
    try {
      dispatch(setFetchingComments(true));
      const response = await fetch(requestUrl, {
        method: "GET",
        credentials: 'include'
      });
      dispatch(setFetchingComments(false));
      const resObject = await response.json();
      console.warn(resObject);
      if (response.status === 200) {
        dispatch(setNewComments(resObject.data.comments));
        if (resObject.data.username)
          dispatch(setUsername(resObject.data.username));

      }
      else if (response.status === 401) {
        dispatch(setLoginSignupRequired({ message: resObject.message }));
      }
      else {
        window.alert(resObject.message);
        console.warn(resObject.message);
      }
    } catch (err) {
      console.error(err);
      dispatch(setFetchingComments(false));
    }
  };
}