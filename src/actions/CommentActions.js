//comment actions
import fetch from 'isomorphic-fetch'
import * as messages from '../utils/Messages'
import * as types from "./types"
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


function requestComments(posts) {
    return {
        type: types.GET_COMMENTS,
        posts
    }
}

function receiveComments(comments) {
    return {
        type: types.RECEIVE_COMMENTS,
        comments,
        receivedAt: Date.now()
    }
}

export function invalidateComments() {
    return {
        type: types.INVALIDATE_COMMENT
    }
}

function startCommenting(comment) {
    return {
        type: types.START_COMMENT,
        comment
    }
}

function commentDone(comment) {
    return {
        type: types.COMMENT,
        comment
    }
}

function editCommentDone(comment) {
    return {
        type: types.EDIT_COMMENT,
        comment
    }
}

export function cancelEditComment() {
    return {
        type: types.CANCEL_COMMENTING
    }
}

export function doComment(comment) {
    return dispatch => {
        const { commentCreated, commentFailed } = messages
        dispatch(startCommenting(comment))
        return fetch(`${api}/comments`, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(comment)
        }).then((res) => res.json()).then((comment) => {
            if (comment.id) {
                dispatch(commentDone(comment))
                document.forms[0].reset()
                dispatch(successMessage({ message: commentCreated }))
            }
            else dispatch(dangerMessage({ message: commentFailed }))
            setTimeout(() => { dispatch(clearMessage()) }, 3000)
        }).catch((error) => {
            dispatch(dangerMessage({ message: error.toString() }))
            setTimeout(() => { dispatch(clearMessage()) }, 3000)
        })
    }
}

export function getComment({ comment }) {
    return {
        type: types.GET_COMMENT,
        comment
    }
}


export function editComment({ comment, body }) {
    return dispatch => {
        dispatch(startCommenting())
        return fetch(`${api}/comments/${comment.id}`, {
            method: 'PUT',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(handleErrors)
            .then(res => res.json())
            .then((comment) => {
                if (comment.id) {
                    document.forms[0].reset()
                    dispatch(editCommentDone(comment))
                    dispatch(successMessage({ message: messages.commentEdited }))
                }
                else {
                    dispatch(dangerMessage({ message: messages.commentEditFailed }))
                }
                setTimeout(() => { dispatch(clearMessage()) }, 3000)
            }).catch((error) => {
                dispatch(dangerMessage({ message: messages.commentEditFailed + `\n` + error.toString() }))
                setTimeout(() => { dispatch(clearMessage()) }, 3000)
            })
    }
}



export function fetchComments(posts) {
    return dispatch => {
        dispatch(requestComments(posts))
        return Promise.all(posts.map((post) => {
            return fetch(`${api}/posts/${post.id}/comments`, { headers })
        }
        ))
            .then(responses => {
                responses.forEach((response) => {
                    response.json().then((comments) => {
                        dispatch(receiveComments(comments))
                    })
                })

            })
    }
}




function doDeleteComment(comment) {
    return {
        type: types.DELETE_COMMENT,
        comment
    }
}

export function deleteComment(comment) {
    return dispatch => {
        dispatch(startCommenting())
        return fetch(`${api}/comments/${comment.id}`, { method: 'DELETE', headers })
            .then(handleErrors)
            .then(res => res.json())
            .then((comment) => {
                if (comment.id) {
                    dispatch(doDeleteComment(comment))
                    dispatch(successMessage({ message: messages.commentDeleted }))
                }
                else {
                    dispatch(dangerMessage({ message: messages.commentDeleteFailed }))
                }
                setTimeout(() => { dispatch(clearMessage()) }, 3000)
            }).catch((error) => {
                dispatch(dangerMessage({ message: messages.commentDeleteFailed + `\n` + error.toString() }))
                setTimeout(() => { dispatch(clearMessage()) }, 3000)
            })
    }
}

function doRateComment({ comment, option }) {
    return {
        type: types.RATE_COMMENT,
        comment,
        option
    }
}


export function rateComment({ comment, option }) {
    return dispatch => {
        dispatch(startCommenting())
        return fetch(`${api}/comments/${comment.id}`, {
            method: 'POST',
            headers: {
                ...headers,
                'content-type': 'application/json'
            },
            body: JSON.stringify({ option })
        })
            .then(handleErrors)
            .then((res) => {
                if (!res.error) {
                    dispatch(doRateComment({ comment, option }))
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

export function sortComments(by) {
    return {
        type: by
    }
}