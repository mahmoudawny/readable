import { combineReducers } from 'redux'
import {
    SUBMITTING, NOTSUBMITTING, //set flag for posting operations
    ERROR, //for error page
    SET_CATEGORY, //set the current category
    FETCH_CATEGORIES, CATEGORIES, //get categories
    START_COMMENT, START_POST, //async request actions for single items
    CANCEL_COMMENTING, //to cancel editing comment
    POST, COMMENT, EDIT_POST, EDIT_COMMENT, //async response for single items
    DELETE_POST, DELETE_COMMENT, //delete actions
    RATE_COMMENT, RATE_POST, VOTEUP, //rating actions
    GET_POST, RECEIVE_POST, GET_COMMENT, //get single post/comment and save them in store
    INVALIDATE_POST, INVALIDATE_COMMENT, //async refresh actions
    GET_POSTS, GET_COMMENTS, //async request actions for all items
    RECEIVE_POSTS, RECEIVE_COMMENTS, //async response actions for all items
    CLEAR, SUCCESS, DANGER, WARNING, //alert actions
    DATE_SORT, CATEGORY_SORT, VOTE_SORT, //post sort actions
    COMMENT_DATE_SORT, COMMENT_VOTE_SORT, // comment sort actions
    CURRENT_SORT, COMMENT_CURRENT_SORT   // retain current sorting between pages
} from '../actions'

//TODO: Add comment ids in posts

function categories(state = null, action) {
    const { categories } = action
    switch (action.type) {
        //case FETCH_CATEGORIES:
        case CATEGORIES:
            return categories
        default:
            return state
    }
}

function category(state = null, action) {
    const { category } = action
    switch (action.type) {
        case GET_POSTS:
        case SET_CATEGORY:
            return category
        default:
            return state
    }
}

function posts(state = {
    isLoading: false,
    didInvalidate: false,
    items: []
}, action) {
    const { post } = action
    switch (action.type) {
        case INVALIDATE_POST:
            return Object.assign({}, state, {
                didInvalidate: true
            })
        case GET_POSTS:
            return Object.assign({}, state, {
                isLoading: true,
                didInvalidate: false
            })
        case GET_COMMENTS:
            return Object.assign({}, state, {
                isLoading: true,
                didInvalidate: false
            })
        case DANGER: //stop loading if error received
        case RATE_COMMENT:
        case RECEIVE_COMMENTS:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: false
            })
        case RECEIVE_POSTS:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: false,
                items: action.posts,
                allPosts: action.allPosts,
                lastUpdated: action.receivedAt
            })
        case START_POST:
            return Object.assign({}, state, {
                isLoading: true,
                didInvalidate: false
            })
        case POST:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: false,
                //concat post and sort according to current sorting setting
                items: state.items ? state.items.concat(action.post).sort((a, b) => {
                    switch (state.sortBy) {
                        case 1:  //date asc
                            return a.timestamp - b.timestamp
                        case -1: //date desc
                            return b.timestamp - a.timestamp
                        case 2:  //vote score asc
                            return a.voteScore - b.voteScore
                        case -2: //vote score desc
                            return b.voteScore - a.voteScore
                        case 3:  //cat score asc
                            return a.category > b.category ? 1 : -1
                        case -3: //cat score desc
                            return b.category > a.category ? 1 : -1
                        default:
                            return 0
                    }
                })
                    : [].push(action.post),
            })
        case EDIT_POST:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: false,
                items: state.items.map((oldpost) => {
                    if (oldpost.id === post.id)
                        return { ...oldpost, ...action.post }
                    return oldpost
                }),
            })
        case DELETE_POST:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: true,
                items: state.items.filter((oldpost) =>
                    oldpost.id !== post.id
                ),
            })
        case RATE_POST:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: false,
                items: state.items.map((oldpost) => {
                    if (oldpost.id === post.id)
                        return action.option === VOTEUP ? { ...oldpost, ...action.post, ...action.post.voteScore++ }
                            : { ...oldpost, ...action.post, ...action.post.voteScore-- }
                    return oldpost
                }),
            })
        case DATE_SORT:
            return Object.assign({}, state, {
                sortBy: Math.abs(state.sortBy) === 1 ? state.sortBy * -1 : -1, //if current sorting is by date reverse it, else set sorting by date desc
                items: Math.abs(state.sortBy) === 1 ?
                    state.items.sort((a, b) => {
                        return ((b.timestamp - a.timestamp) * state.sortBy)
                    })
                    : state.items.sort((a, b) => {
                        return b.timestamp - a.timestamp
                    })
            })
        case VOTE_SORT:
            return Object.assign({}, state, {
                sortBy: Math.abs(state.sortBy) === 2 ? state.sortBy * -1 : -2, //if current sorting is by vote reverse it, else set sorting by vote desc            
                items: Math.abs(state.sortBy) === 2 ?
                    state.items.sort((a, b) => {
                        return ((b.voteScore - a.voteScore) * state.sortBy)
                    })
                    : state.items.sort((a, b) => {
                        return b.voteScore - a.voteScore
                    })
            })
        case CATEGORY_SORT:
            return Object.assign({}, state, {
                sortBy: Math.abs(state.sortBy) === 3 ? state.sortBy * -1 : 3, //if current sorting is by category reverse it, else set sorting by category asc            
                items: Math.abs(state.sortBy) === 3 ?
                    state.items.sort((a, b) => {
                        if (a.category < b.category) {
                            return state.sortBy;
                        }
                        if (a.category > b.category) {

                            return state.sortBy * -1;
                        }
                        return 0;
                    })
                    : state.items.sort((a, b) => {
                        if (a.category < b.category) {
                            return -1;
                        }
                        if (a.category > b.category) {
                            return 1;
                        }
                        return 0;
                    })
            })
        case CURRENT_SORT:
            return Object.assign({}, state, {
                items: state.items.sort((a, b) => {
                    switch (state.sortBy) {
                        case 1:  //date asc
                            return a.timestamp - b.timestamp
                        case -1: //date desc
                            return b.timestamp - a.timestamp
                        case 2:  //vote score asc
                            return a.voteScore - b.voteScore
                        case -2: //vote score desc
                            return b.voteScore - a.voteScore
                        case 3:  //cat score asc
                            return a.category > b.category ? 1 : -1
                        case -3: //cat score desc
                            return b.category > a.category ? 1 : -1
                        default:
                            return 0
                    }
                })
            })
        default:
            return state
    }
}

function comments(state = {
    isLoading: false,
    didInvalidate: false,
    items: []
}, action) {
    const { comment, post } = action
    switch (action.type) {
        case INVALIDATE_COMMENT:
            return Object.assign({}, state, {
                didInvalidate: true
            })
        case GET_COMMENTS:
            return Object.assign({}, state, {
                isLoading: true,
                didInvalidate: false
            })
        case GET_POSTS:
            return Object.assign({}, state, {
                items: []
            })
        case RECEIVE_COMMENTS:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: false,
                items: state.items ? state.items.concat(action.comments) : action.comments,
                lastUpdated: action.receivedAt
            })
        case START_COMMENT:
            return Object.assign({}, state, {
                isLoading: true,
                didInvalidate: false
            })
        case DANGER: //stop loading if error received
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: false
            })
        case COMMENT:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: true,
                items: state.items ? state.items.concat(action.comment) : [].push(action.comment),
            })
        case EDIT_COMMENT:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: true,
                items: state.items.map((oldcomment) => {
                    if (oldcomment.id === comment.id)
                        return { ...oldcomment, ...action.comment }
                    return oldcomment
                }),
            })
        case DELETE_COMMENT:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: false,
                items: state.items.filter((oldcomment) =>
                    oldcomment.id !== comment.id
                ),
            })
        case DELETE_POST:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: false,
                items: state.items.filter((oldcomment) =>
                    oldcomment.parentId !== post.id
                ),
            })
        case RATE_COMMENT:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: false,
                items: state.items.map((oldcomment) => {
                    if (oldcomment.id === comment.id)
                        return action.option === VOTEUP ? { ...oldcomment, ...action.comment, ...action.comment.voteScore++ }
                            : { ...oldcomment, ...action.comment, ...action.comment.voteScore-- }
                    return oldcomment
                }),
            })
        default:
            return state
    }
}




//current post state
function post(state = null, action) {
    const { post, comment } = action
    switch (action.type) {
        case DANGER:
            return Object.assign({}, state, {
                isLoading: false
            })
        case GET_POST:
            return Object.assign({}, state, {
                isLoading: true
            })
        case RECEIVE_POST:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: true,
                ...post,
                comments: action.comments,
            })
        case COMMENT:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: true,
                comments: state.comments ? state.comments.concat(action.comment) : [].push(action.comment),
            })
        case EDIT_COMMENT:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: true,
                comments: state.comments.map((oldcomment) => {
                    if (oldcomment.id === comment.id)
                        return { ...oldcomment, ...action.comment }
                    return oldcomment
                }),
            })
        case COMMENT_DATE_SORT:
            return Object.assign({}, state, {
                sortBy: Math.abs(state.sortBy) === 1 ? state.sortBy * -1 : -1, //if current sorting is by date reverse it, else set sorting by date desc
                comments: state.comments ?
                    Math.abs(state.sortBy) === 1 ?
                        state.comments.sort(function (a, b) {
                            return ((b.timestamp - a.timestamp) * state.sortBy)
                        })
                        : state.comments.sort(function (a, b) {
                            return b.timestamp - a.timestamp
                        })
                    : []
            })
        case COMMENT_VOTE_SORT:
            return Object.assign({}, state, {
                sortBy: Math.abs(state.sortBy) === 2 ? state.sortBy * -1 : -2, //if current sorting is by vote reverse it, else set sorting by vote desc            
                comments: state.comments ?
                    Math.abs(state.sortBy) === 2 ?
                        state.comments.sort(function (a, b) {
                            return ((b.voteScore - a.voteScore) * state.sortBy)
                        })
                        : state.comments.sort(function (a, b) {
                            return b.voteScore - a.voteScore
                        })
                    : []
            })
        case COMMENT_CURRENT_SORT:
            return Object.assign({}, state, {
                comments: state.comments.sort((a, b) => {
                    switch (state.sortBy) {
                        case 1:  //date asc
                            return a.timestamp - b.timestamp
                        case -1: //date desc
                            return b.timestamp - a.timestamp
                        case 2:  //vote score asc
                            return a.voteScore - b.voteScore
                        case -2: //vote score desc
                            return b.voteScore - a.voteScore
                        default:
                            return 0
                    }
                })
            })
        default:
            return state
    }
}

//current comment state (for editing a comment)
function comment(state = null, action) {
    const { comment } = action
    switch (action.type) {
        case GET_COMMENT:
            return comment
        case CANCEL_COMMENTING:
            return null
        default:
            return state
    }
}


//submitting flag
function submitting(state = false, action) {
    switch (action.type) {
        case SUBMITTING:
            return true
        case NOTSUBMITTING:
            return false
        default:
            return state
    }
}

//alert message
function alert(state = { type: "info" }, action) {
    const { message } = action
    switch (action.type) {
        case SUCCESS:
            return {
                message,
                type: "success"
            }
        case DANGER:
            return {
                message,
                type: "danger"
            }
        case WARNING:
            return {
                message,
                type: "warning"
            }
        case CLEAR:
            return {
                message: null,
                type: state.type
            }
        default:
            return state
    }
}

//error page flag
function error(state = null, action) {
    switch (action.type) {
        case ERROR:
            return action.message
        default:
            return state
    }
}

export default combineReducers({ error, submitting, post, posts, comment, comments, category, categories, alert })

