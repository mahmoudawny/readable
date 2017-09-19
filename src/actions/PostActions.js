//post actions 
import fetch from 'isomorphic-fetch'
import * as messages from '../utils/Messages'
import * as types from "./types"
import * as commentActions from "./CommentActions"
import * as globalActions from "./index.js"

//server constants
const api = process.env.REACT_APP_READABLE_API_URL || 'http://localhost:5001'

let token = localStorage.token

if (!token)
    token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
    'Accept': 'application/json',
    'Authorization': token
}

const {dangerMessage, successMessage, clearMessage, handleErrors} = globalActions

export function invalidatePosts() {
    return {
        type: types.INVALIDATE_POST
    }
}

function requestPosts(category) {
    return {
        type: types.GET_POSTS,
        category
    }
}


function receivePosts(category, posts, allPosts) {
    return {
        type: types.RECEIVE_POSTS,
        category,
        posts,
        allPosts,
        receivedAt: Date.now()
    }
}

function startPosting() {
    return {
        type: types.START_POST
    }
}

function postDone(post) {
    return {
        type: types.POST,
        post
    }
}

function editPostDone(post) {
    return {
        type: types.EDIT_POST,
        post
    }
}

//function to return fetch posts promise and then dispatch get posts' (if any) comments 
function fetchPosts(category) {
    return dispatch => {
        dispatch(requestPosts(category))
        //get all posts if category is not specified
        if (!category)
            return fetch(`${api}/posts`, { headers })
                .then(response => response.json())
                .then(posts => {
                    // added filter to handle getallposts retrieving deleted posts  
                    //(bug in posts.js, change const posts into let)
                    let filteredPosts = posts.filter((post) => !post.deleted)
                    dispatch(receivePosts(category, filteredPosts, true))
                    if (filteredPosts.length > 0) {
                        dispatch(commentActions.fetchComments(filteredPosts))
                    }
                })
        //get posts for a category    
        else
            return fetch(`${api}/${category}/posts`, { headers })
                .then(response => response.json())
                .then(posts => {
                    let filteredPosts = posts.filter((post) => !post.deleted)
                    dispatch(receivePosts(category, filteredPosts, false))
                    if (filteredPosts.length > 0) {
                        dispatch(commentActions.fetchComments(filteredPosts))
                    }
                })
    }
}



//function to check if a new call should be made (true if current state is empty or if posts are invalidated)
function shouldFetchPosts(state, category) {
    const { posts } = state
    if (!posts.items.length) {
        return true
    } else if (posts.isLoading) {
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


function doRatePost({ post, option }) {
    return {
        type: types.RATE_POST,
        post,
        option
    }
}

export function ratePost({ post, option }) {
    return dispatch => {
        dispatch(startPosting())
        return fetch(`${api}/posts/${post.id}`, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ option })
        })
            .then(handleErrors)
            .then((res) => {
                if (!res.error) {
                    dispatch(doRatePost({ post, option }))
                }
                else {
                    dispatch(dangerMessage({ message: messages.generalFailed }))
                    setTimeout(() => { dispatch(clearMessage()) }, 3000)
                }
            })
            .catch((error) => {
                dispatch(dangerMessage({ message: messages.generalFailed + `\n` + error.toString() }))
                setTimeout(() => { dispatch(clearMessage()) }, 3000)
            })
    }
}

export function doPost(post) {
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
                if (post.id) {
                    dispatch(postDone(post))
                    dispatch(successMessage({ message: messages.postCreated }))
                }
                else {
                    dispatch(dangerMessage({ message: messages.postFailed }))
                }
                setTimeout(() => { dispatch(clearMessage()) }, 3000)
            }).catch((error) => {
                dispatch(dangerMessage({ message: error.toString() }))
                setTimeout(() => { dispatch(clearMessage()) }, 3000)
            })
    }
}

export function editPost({ post, body }) {
    return dispatch => {
        dispatch(startPosting())
        return fetch(`${api}/posts/${post.id}`, {
            method: 'PUT',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(handleErrors)
            .then(res => res.json())
            .then((post) => {
                if (post.id) {
                    dispatch(editPostDone(post))
                    dispatch(successMessage({ message: messages.postEdited }))
                }
                else {
                    dispatch(dangerMessage({ message: messages.postEditFailed }))
                }
                setTimeout(() => { dispatch(clearMessage()) }, 3000)
            }).catch((error) => {
                dispatch(dangerMessage({ message: error.toString() }))
                setTimeout(() => { dispatch(clearMessage()) }, 3000)
            })
    }
}

function doDeletePost(post) {
    return {
        type: types.DELETE_POST,
        post
    }
}

export function deletePost(post) {
    return dispatch => {
        dispatch(startPosting())
        return fetch(`${api}/posts/${post.id}`, { method: 'DELETE', headers })
            .then(handleErrors)
            .then((res) => {
                if (!res.error) {
                    dispatch(doDeletePost(post))
                    dispatch(successMessage({ message: messages.postDeleted }))
                }
                else {
                    dispatch(dangerMessage({ message: messages.postDeleteFailed }))
                }
                setTimeout(() => { dispatch(clearMessage()) }, 3000)
            }).catch((error) => {
                dispatch(dangerMessage({ message: messages.postDeleteFailed + `\n` + error.toString() }))
                setTimeout(() => { dispatch(clearMessage()) }, 3000)
            })
    }
}

export function sortPosts(by) {
    return {
        type: by
    }
}

//single post details

function requestPost() {
    return {
        type: types.GET_POST,
    }
}

function receivePost({ post, comments }) {
    return {
        type: types.RECEIVE_POST,
        post,
        comments
    }
}

//function to check if a new call should be made (true if current state is empty or if posts are invalidated)
function shouldFetchPost(state) {
    const { post } = state
    if (!post.id) {
        return true
    } else if (post.isLoading) {
        return false
    } else {
        return post.didInvalidate
    }
}

//main fetch function to call on loading posts and their comments
export function getPost(id) {
    return (dispatch, getState) => {
        if (shouldFetchPost(getState())) {
            return dispatch(getPostAndComments(id))
        } else {
            return Promise.resolve()
        }
    }
}


//getPostAndComments retrieves single post and inserts comments in a post object 
export function getPostAndComments(id) {
    return dispatch => {
        dispatch(requestPost())
        return fetch(`${api}/posts/${id}`, { headers })
            .then(handleErrors)
            .then((res) => res.json())
            .catch((error) => {
                dispatch(dangerMessage({ message: messages.generalFailed + `\n` + error.toString() }))
                setTimeout(() => { dispatch(clearMessage()) }, 3000)
            })
    }
}


//fetch single post's comments
export function getPostComments(post) {
    return dispatch => {
        return fetch(`${api}/posts/${post.id}/comments`, { headers })
            .then((response) => response.json())
            .then((comments) => {
                dispatch(receivePost({ post, comments }))
            })
            .catch((error) => {
                dispatch(dangerMessage({ message: messages.generalFailed + `\n` + error.toString() }))
                setTimeout(() => { dispatch(clearMessage()) }, 3000)
            })
    }

}