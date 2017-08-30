import {combineReducers} from 'redux'
import {START_COMMENT, START_POST, SUBMITTING, NOTSUBMITTING, SET_CATEGORY, INVALIDATE_POST, RECEIVE_POSTS, GET_POST, INVALIDATE_COMMENT, GET_COMMENTS, RECEIVE_COMMENTS, CLEAR, SUCCESS, DANGER, WARNING, CATEGORIES, POST_PAGE, CATEGORY_POSTS, GET_POSTS, POST, DELETE_POST, EDIT_POST, COMMENT, EDIT_COMMENT, DELETE_COMMENT, RATE_COMMENT, RATE_POST} from '../actions'

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
        lastUpdated: action.receivedAt
      })
    case EDIT_POST:
    const {post} = action
      return Object.assign({}, state, {
        isLoading: false,
        didInvalidate: false,
        items: state.items.map((oldpost) => {
            if(oldpost.id === post.id) 
                return {...oldpost, ...action.post}
            return oldpost
        }),
        lastUpdated: action.receivedAt
      })
    // case RECEIVE_COMMENTS:
    // return Object.assign({}, state, {
    //     isLoading: false,
    //     didInvalidate: false,
    //     items: action.posts.map((post) => comments(post, action)),
    //     lastUpdated: action.receivedAt
    //   })
    default:
      return state
  }
}

function comments(state = {
                isLoading: false,
                didInvalidate: false,
                items: []
                }, action) {
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
        case COMMENT:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: false,
                items: state.items? state.items.concat(action.comment): [].push(action.comment),
                lastUpdated: action.receivedAt
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



// function comments(state = null, action){
//     const {comment, comments, post} = action
//     switch(action.type){



//         case COMMENT:
//             return comments.concat(comment)
                    
//         case DELETE_COMMENT:
//             return {
//                      ...state,
//                      [comment]: state[comment].deleted = true 
//                     }
//         case EDIT_COMMENT:
//             return {
//                      ...state,
//                      [comment]: state[comment] = comment 
//                     }
//         case RATE_COMMENT:
//             return {
//                      ...state,
//                      [comment]: action.option === "upVote"? 
//                      state[comment].voteScore++ 
//                      : state[comment].voteScore--
//                     }
//         default:
//             return state
//     }
// }


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

// function posts(state = null, action){
//     const {post, posts, category} = action
//     switch(action.type){
//         case POST_PAGE:
//             return post

//         case GET_POSTS:
//             return posts

//         case CATEGORY_POSTS:
//             return posts.filter((post) => post.category === category.name)
           
//         case POST:
//             return posts.concat(post)
                    
//         case DELETE_POST:
//             return {
//                      ...state,
//                      [post]: state[post].deleted = true 
//                     }
//         case EDIT_POST:
//             return {
//                      ...state,
//                      [post]: state[post] = post 
//                     }
//         case RATE_POST:
//             return {
//                      ...state,
//                      [post]: action.option === "upVote"? 
//                      state[post].voteScore++ 
//                      : state[post].voteScore--
//                     }
//         default:
//             return state
//     }
// }

export default combineReducers({submitting, post, posts, comments, category, categories, alert})

