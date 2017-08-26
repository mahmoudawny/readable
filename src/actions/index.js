import fetch from 'isomorphic-fetch'

export const DELETE_POST = 'DELETE_POST'
export const POST = 'POST'
export const EDIT_POST = 'EDIT_POST'
export const RATE_POST = 'RATE_POST'
export const DELETE_COMMENT = 'DELETE_COMMENT'
export const COMMENT = 'COMMENT'
export const EDIT_COMMENT = 'EDIT_COMMENT'
export const RATE_COMMENT = 'RATE_COMMENT'
export const GET_POSTS = 'GET_POSTS'
export const CATEGORY_POSTS = 'CATEGORY_POSTS'
export const POST_PAGE = 'POST_PAGE'
export const CATEGORIES = 'CATEGORIES'
export const SUCCESS = 'SUCCESS'
export const WARNING = 'WARNING'
export const DANGER = 'DANGER'
export const CLEAR = 'CLEAR'
export const GET_COMMENTS = 'GET_COMMENTS'
export const GET_POST = 'GET_POST'

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'

function requestPosts(category) {
  return {
    type: REQUEST_POSTS,
    category
  }
}


function receivePosts(category, json) {
  return {
    type: RECEIVE_POSTS,
    category,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}

const api = process.env.REACT_APP_READABLE_API_URL || 'http://localhost:5001'

let token = localStorage.token

if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}

function fetchPosts(category) {
  return dispatch => {
    dispatch(requestPosts(category))
    if(!category)
        return fetch(`${api}/posts`, { headers })
        .then(response => response.json())
        .then(json => dispatch(receivePosts(category, json)))
    else
        return fetch(`${api}/${category}/posts`, { headers })
        .then(response => response.json())
        .then(json => dispatch(receivePosts(category, json)))
  }
}

function shouldFetchPosts(state, category) {
  const posts = state[category]
  if (!posts) {
    return true
  } else if (posts.isFetching) {
    return false
  } else {
    return posts.didInvalidate
  }
}

export function fetchPostsIfNeeded(subreddit) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), subreddit)) {
      return dispatch(fetchPosts(subreddit))
    } else {
      return Promise.resolve()
    }
  }
}

export function deletePost({post}){
    return{
        type: DELETE_POST,
        post
    }
}

export function post({post}){
    return{
        type: POST,
        post
    }
}

export function getPost({post}){
    return{
        type: GET_POST,
        post
    }
}

export function editPost({post}){
    return{
        type: EDIT_POST,
        post
    }
}

export function ratePost({post, option}){
    return{
        type: RATE_POST,
        post,
        option
    }
}

export function deleteComment({comment}){
    return{
        type: DELETE_COMMENT,
        comment
    }
}

export function comment({comment}){
    return{
        type: COMMENT,
        comment
    }
}

export function editComment({comment}){
    return{
        type: EDIT_COMMENT,
        comment
    }
}

export function rateComment({comment, option}){
    return{
        type: RATE_COMMENT,
        comment,
        option
    }
}



export function getPosts({posts}) {
  return {
    type: GET_POSTS,
    posts,
    category: null
  }
}

export function getComments({posts, post, comments}) {
  return {
    type: GET_COMMENTS,
    comments,
    post,
    posts
  }
}



export function getCategoryPosts({posts, category, history}) {
  return {
    type: CATEGORY_POSTS,
    posts,
    category,
    history
  }
}


export function getCategories({categories}) {
    return {
        type: CATEGORIES,
        categories
    }
}

export function successMessage({message}) {
    return {
        type: SUCCESS,
        message
    }
}
export function warningMessage({message}) {
    return {
        type: WARNING,
        message
    }
}
export function dangerMessage({message}) {
    return {
        type: DANGER,
        message
    }
}

export function clearMessage() {
    return {
        type: CLEAR,
        message: null
    }
}