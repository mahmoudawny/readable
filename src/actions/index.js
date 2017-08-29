import fetch from 'isomorphic-fetch'
import * as messages from '../utils/Messages'

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
export const INVALIDATE_COMMENT = 'INVALIDATE_COMMENT'
export const RECEIVE_COMMENTS = 'RECEIVE_COMMENTS'
export const GET_POST = 'GET_POST'
export const INVALIDATE_POST = 'INVALIDATE_POST'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SET_CATEGORY = 'SET_CATEGORY'

//TODO: Add Handling failed fetches in all fetches

//server constants
const api = process.env.REACT_APP_READABLE_API_URL || 'http://localhost:5001'

let token = localStorage.token

if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}


export function setCategory(category){
    return {
        type: SET_CATEGORY,
        category
    }
}

export function invalidatePosts(){
    return {
        type: INVALIDATE_POST
    }
}

export function invalidateComments(){
    return {
        type: INVALIDATE_COMMENT
    }
}

function posts(post){
    return {
        type: POST,
        post
    }
}

export function doPost(post){
    return dispatch => {
        dispatch(posts(post))
        return fetch(`${api}/posts`, {
            method: 'POST',
            headers: {
            ...headers,
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        }).then(handleErrors)
        .then((res) => res.json())
        .then((post) => {
            if(post.id) {
                dispatch(successMessage({message: messages.postCreated}))
            }
            else{
                dispatch(dangerMessage({message: messages.postFailed}))
            }
            setTimeout(() => {dispatch(clearMessage())}, 3000)                
        }).catch((error) =>  {
            console.log(error)
            dispatch(dangerMessage({message: error.toString()}))
            setTimeout(() => {dispatch(clearMessage())}, 3000) 
        })
    }
}

function comments(comment){
    return {
        type: COMMENT,
        comment
    }
}

export function doComment(comment){
    return dispatch => {
        const {commentCreated, commentFailed} = messages
        dispatch(comments(comment))
        return fetch(`${api}/comments`, {
            method: 'POST',
            headers: {
            ...headers,
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(comment)
        }).then((res) => res.json()).then((comment) => {
            if(comment.id) {
                document.forms[0].reset()
                dispatch(successMessage({message: commentCreated}))
            }
            else dispatch(dangerMessage({message: commentFailed}))
            setTimeout(() => {dispatch(clearMessage())}, 3000)  
        })
    }
}

function requestPosts(category) {
  return {
    type: GET_POSTS,
    category
  }
}


function receivePosts(category, posts) {
  return {
    type: RECEIVE_POSTS,
    category,
    posts,
    receivedAt: Date.now()
  }
}

function requestComments(posts){
    return {
        type: GET_COMMENTS,
        posts
    }
}

function receiveComments(comments) {
  return {
    type: RECEIVE_COMMENTS,
    comments,
    receivedAt: Date.now()
  }
}


//function to return fetch posts promise and then dispatch get posts' (if any) comments 
function fetchPosts(category) {
  return dispatch => {
    dispatch(requestPosts(category))
    //get all posts if category is not specified
    if(!category)
        return fetch(`${api}/posts`, { headers })
        .then(response => response.json())
        .then(posts => {
                dispatch(receivePosts(category, posts)) 
                dispatch(fetchComments(posts))         
        })
    //get posts for a category    
    else
        return fetch(`${api}/${category}/posts`, { headers })
        .then(response => response.json())
        .then(posts => {
            dispatch(receivePosts(category, posts))
            dispatch(fetchComments(posts))                     
        })
  }
}

function fetchComments(posts){
    return dispatch => {
    dispatch(requestComments(posts))
    return Promise.all(posts.map((post) => {
        return fetch(`${api}/posts/${post.id}/comments`, { headers })}
    ))
        .then(responses => {
            responses.forEach((response) => {
                response.json().then((comments) => dispatch(receiveComments(comments)))
            })
            
        })
    }
    
}

//function to check if a new call should be made (true if current state is empty or if posts are invalidated)
function shouldFetchPosts(state, category) {
  const {posts} = state
  if (!posts.items.length) {
    return true
  } else if (posts.isFetching) {
    return false
  } else {
    return posts.didInvalidate
  }
}

//main fetch function to call on loading posts and their comments
export function fetchPostsIfNeeded(category) {
  return (dispatch, getState) => {
   if (shouldFetchPosts(getState(), category)) {
      return dispatch(fetchPosts(category))
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

// error handler for fetch
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}