import fetch from 'isomorphic-fetch'
import * as messages from '../utils/Messages'

export const DELETE_POST = 'DELETE_POST'
export const POST = 'POST'
export const EDIT_POST = 'EDIT_POST'
export const RATE_POST = 'RATE_POST'
export const VOTEUP = 'upVote'
export const VOTEDOWN = "downVote"
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
export const GET_COMMENT = 'GET_COMMENT'
export const INVALIDATE_POST = 'INVALIDATE_POST'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SET_CATEGORY = 'SET_CATEGORY'
export const SUBMITTING = 'SUBMITTING'
export const NOTSUBMITTING = 'NOTSUBMITTING'
export const START_POST = 'START_POST'
export const START_COMMENT = 'START_COMMENT'
export const CANCEL_COMMENTING = 'CANCEL_COMMENTING'
export const DATE_SORT = "DATE_SORT"
export const CATEGORY_SORT = "CATEGORY_SORT"
export const VOTE_SORT = "VOTE_SORT"


//server constants
const api = process.env.REACT_APP_READABLE_API_URL || 'http://localhost:5001'

let token = localStorage.token

if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}

//global 

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

export function setSubmitting(){
    return {
        type: SUBMITTING
    }
}

export function setNotSubmitting(){
    return {
        type: NOTSUBMITTING
    }
}

export function setCategory(category){
    return {
        type: SET_CATEGORY,
        category
    }
}

//posts 

export function invalidatePosts(){
    return {
        type: INVALIDATE_POST
    }
}

function requestPosts(category) {
  return {
    type: GET_POSTS,
    category
  }
}


function receivePosts(category, posts, allPosts) {
  return {
    type: RECEIVE_POSTS,
    category,
    posts,
    allPosts,
    receivedAt: Date.now()
  }
}

function startPosting(){
    return {
        type: START_POST
    }
}

function postDone(post){
    return {
        type: POST,
        post
    }
}

function editPostDone(post){
    return {
        type: EDIT_POST,
        post
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
// added filter to handle getallposts retrieving deleted posts  
//(bug in posts.js, change const posts into let)
                let filteredPosts = posts.filter((post) => !post.deleted)
                dispatch(receivePosts(category, filteredPosts, true)) 
                dispatch(fetchComments(posts))         
        })
    //get posts for a category    
    else
        return fetch(`${api}/${category}/posts`, { headers })
        .then(response => response.json())
        .then(posts => {
            let filteredPosts = posts.filter((post) => !post.deleted)
            dispatch(receivePosts(category, filteredPosts, false))
            dispatch(fetchComments(posts))                     
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


export function getPost({post}){
    return{
        type: GET_POST,
        post
    }
}


function doRatePost({post, option}){
    return{
        type: RATE_POST,
        post,
        option
    }
}

export function ratePost({post, option}){
    return dispatch => {
        dispatch(startPosting())
        return  fetch(`${api}/posts/${post.id}`, {
            method: 'POST',
            headers: {
            ...headers,
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({option})
        })
        .then(handleErrors)
        .then((res) => {
            if(!res.error) {
                dispatch(doRatePost({post, option}))
            }
            else{
                dispatch(dangerMessage({message: messages.generalFailed}))
                setTimeout(() => {dispatch(clearMessage())}, 3000) 
            }})
        .catch((error) =>  {
            dispatch(dangerMessage({message: messages.generalFailed + `\n` + error.toString()}))
            setTimeout(() => {dispatch(clearMessage())}, 3000) 
        })
    }
}

export function doPost(post){
    return dispatch => {
        dispatch(startPosting())
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
                dispatch(postDone(post))
                dispatch(successMessage({message: messages.postCreated}))
            }
            else{
                dispatch(dangerMessage({message: messages.postFailed}))
            }
            setTimeout(() => {dispatch(clearMessage())}, 3000)                
        }).catch((error) =>  {
            dispatch(dangerMessage({message: error.toString()}))
            setTimeout(() => {dispatch(clearMessage())}, 3000) 
        })
    }
}

export function editPost({post, body}){
    return dispatch => {
        dispatch(startPosting())
        return fetch(`${api}/posts/${post.id}`, { method: 'PUT', 
            headers: {
            ...headers,
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(handleErrors)
        .then(res => res.json())
        .then((post) => {
            if(post.id) {
                dispatch(editPostDone(post))
                dispatch(successMessage({message: messages.postEdited}))
            }
            else{
                dispatch(dangerMessage({message: messages.postEditFailed}))
            }
            setTimeout(() => {dispatch(clearMessage())}, 3000)                
        }).catch((error) =>  {
            dispatch(dangerMessage({message: error.toString()}))
            setTimeout(() => {dispatch(clearMessage())}, 3000) 
        })
    }
}

function doDeletePost(post){
    return{
        type: DELETE_POST,
        post
    }
}

export function deletePost(post){
    return dispatch => {
        dispatch(startPosting())
        return fetch(`${api}/posts/${post.id}`, { method: 'DELETE', headers })
        .then(handleErrors)
        .then((res) => {
            if(!res.error) {
                dispatch(doDeletePost(post))
                dispatch(successMessage({message: messages.postDeleted}))
            }
            else{
                dispatch(dangerMessage({message: messages.postDeleteFailed}))
            }
            setTimeout(() => {dispatch(clearMessage())}, 3000)                
        }).catch((error) =>  {
            dispatch(dangerMessage({message: messages.postDeleteFailed + `\n` + error.toString()}))
            setTimeout(() => {dispatch(clearMessage())}, 3000) 
        })
    }
}

export function sortPosts(by){
    return{
        type: by
    }
}

//comments


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

export function invalidateComments(){
    return {
        type: INVALIDATE_COMMENT
    }
}

function startCommenting(comment){
    return {
        type: START_COMMENT,
        comment
    }
}

function commentDone(comment){
    return {
        type: COMMENT,
        comment
    }
}

function editCommentDone(comment){
    return {
        type: EDIT_COMMENT,
        comment
    }
}

export function cancelEditComment(){
    return {
        type: CANCEL_COMMENTING
    }
}

export function doComment(comment){
    return dispatch => {
        const {commentCreated, commentFailed} = messages
        dispatch(startCommenting(comment))
        return fetch(`${api}/comments`, {
            method: 'POST',
            headers: {
            ...headers,
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(comment)
        }).then((res) => res.json()).then((comment) => {
            if(comment.id) {
                dispatch(commentDone(comment))
                document.forms[0].reset()                
                dispatch(successMessage({message: commentCreated}))
            }
            else dispatch(dangerMessage({message: commentFailed}))
            setTimeout(() => {dispatch(clearMessage())}, 3000)  
        }).catch((error) =>  {
            dispatch(dangerMessage({message: error.toString()}))
            setTimeout(() => {dispatch(clearMessage())}, 3000) 
        })
    }
}

export function getComment({comment}){
    return{
        type: GET_COMMENT,
        comment
    }
}


export function editComment({comment, body}){
    return dispatch => {
        dispatch(startCommenting())
        return fetch(`${api}/comments/${comment.id}`, { method: 'PUT', 
            headers: {
            ...headers,
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(handleErrors)
        .then(res => res.json())
        .then((comment) => {
            if(comment.id) {
                document.forms[0].reset()
                dispatch(editCommentDone(comment))
                dispatch(successMessage({message: messages.commentEdited}))
            }
            else{
                dispatch(dangerMessage({message: messages.commentEditFailed}))
            }
            setTimeout(() => {dispatch(clearMessage())}, 3000)                
        }).catch((error) =>  {
            dispatch(dangerMessage({message: messages.commentEditFailed + `\n` + error.toString()}))
            setTimeout(() => {dispatch(clearMessage())}, 3000) 
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



function doDeleteComment(comment){
    return{
        type: DELETE_COMMENT,
        comment
    }
}

export function deleteComment(comment){
    return dispatch => {
        dispatch(startCommenting())
        return fetch(`${api}/comments/${comment.id}`, { method: 'DELETE', headers })
        .then(handleErrors)
        .then(res => res.json())
        .then((comment) => {
            if(comment.id) {
                dispatch(doDeleteComment(comment))
                dispatch(successMessage({message: messages.commentDeleted}))
            }
            else{
                dispatch(dangerMessage({message: messages.commentDeleteFailed}))
            }
            setTimeout(() => {dispatch(clearMessage())}, 3000)                
        }).catch((error) =>  {
            dispatch(dangerMessage({message: messages.commentDeleteFailed + `\n` + error.toString()}))
            setTimeout(() => {dispatch(clearMessage())}, 3000) 
        })
    }
}

function doRateComment({comment, option}){
    return{
        type: RATE_COMMENT,
        comment,
        option
    }
}


export function rateComment({comment, option}){
    return dispatch => {
        dispatch(startCommenting())
        return  fetch(`${api}/comments/${comment.id}`, {
            method: 'POST',
            headers: {...headers, 
                'content-type': 'application/json'},
            body: JSON.stringify({option})
        })
        .then(handleErrors)
        .then((res) => {
            if(!res.error) {
                dispatch(doRateComment({comment, option}))
            }
            else{
                dispatch(dangerMessage({message: messages.generalFailed}))
                setTimeout(() => {dispatch(clearMessage())}, 3000) 
            }})
        .catch((error) =>  {
            dispatch(dangerMessage({message: messages.generalFailed + `\n` + error.toString()}))
            setTimeout(() => {dispatch(clearMessage())}, 3000) 
        })
    }
}

export function sortComments(by){
    return{
        type: by
    }
}