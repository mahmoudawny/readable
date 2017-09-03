import {combineReducers} from 'redux'
import {SUBMITTING, NOTSUBMITTING, //set flag for posting operations
        SET_CATEGORY, //set the current category
        CATEGORIES, //get categories
        START_COMMENT, START_POST, //async request actions for single items
        CANCEL_COMMENTING, //to cancel editing comment
        POST, COMMENT, EDIT_POST, EDIT_COMMENT, //async response for single items
        DELETE_POST, DELETE_COMMENT, 
        RATE_COMMENT, RATE_POST, VOTEUP,
        GET_POST, GET_COMMENT, //get single post/comment and save them in store
        INVALIDATE_POST, INVALIDATE_COMMENT, //async refresh actions
        GET_POSTS, GET_COMMENTS, //async request actions for all items
        RECEIVE_POSTS, RECEIVE_COMMENTS, //async response actions for all items
        CLEAR, SUCCESS, DANGER, WARNING, //alert actions
    } from '../actions'

//TODO: Add comment ids in posts

function categories(state = null, action){
    const {categories} = action
    switch(action.type){
        case CATEGORIES:
            return categories
        default:
            return state
    }
}

function category(state = null, action){
    const {category} = action
    switch(action.type){
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
  const {post} = action
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
        items: state.items? state.items.concat(action.post): [].push(action.post),
      })
    case EDIT_POST:  
      return Object.assign({}, state, {
        isLoading: false,
        didInvalidate: false,
        items: state.items.map((oldpost) => {
            if(oldpost.id === post.id) 
                return {...oldpost, ...action.post}
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
            if(oldpost.id === post.id) 
               return action.option === "upVote"? {...oldpost, ...action.post, ...action.post.voteScore++}
                :{...oldpost, ...action.post, ...action.post.voteScore--}
            return oldpost
        }),
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
    const {comment, post} = action
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
        case RECEIVE_COMMENTS:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: false,
                items: state.items? state.items.concat(action.comments): action.comments,
                lastUpdated: action.receivedAt
            })
        case GET_POSTS:
            return Object.assign({}, state, {
                isLoading: true,
                didInvalidate: true,
                items: []
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
                items: state.items? state.items.concat(action.comment): [].push(action.comment),
            })
        case EDIT_COMMENT:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: true,
                items: state.items.map((oldcomment) => {
                    if(oldcomment.id === comment.id) 
                        return {...oldcomment, ...action.comment}
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
                    if(oldcomment.id === comment.id) 
                    return action.option === VOTEUP? {...oldcomment, ...action.comment, ...action.comment.voteScore++}
                        :{...oldcomment, ...action.comment, ...action.comment.voteScore--}
                    return oldcomment
                }),
            })
        default:
        return state
    }
}

function alert(state = null, action){
    const {message} = action
    switch(action.type){
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
            return message
        case CLEAR:
            return null
        default:
            return state
    }
}



//current post state
function post(state = null, action){
    const {post} = action
    switch(action.type){
        case GET_POST:
            return post
        default:
            return state
    }
}

//current comment state (for editing a comment)
function comment(state = null, action){
    const {comment} = action
    switch(action.type){
        case GET_COMMENT:
            return comment
        case CANCEL_COMMENTING:
            return null
        default:
            return state
    }
}

//submitting flag
function submitting(state = false, action){
    switch(action.type){
        case SUBMITTING:
            return true
        case NOTSUBMITTING:
            return false
        default:
            return state
    }
}


export default combineReducers({submitting, post, posts, comment, comments, category, categories, alert})

