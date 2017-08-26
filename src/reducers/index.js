import {combineReducers} from 'redux'
import {GET_POST, GET_COMMENTS, CLEAR, SUCCESS, DANGER, WARNING, CATEGORIES, POST_PAGE, CATEGORY_POSTS, GET_POSTS, POST, DELETE_POST, EDIT_POST, COMMENT, EDIT_COMMENT, DELETE_COMMENT, RATE_COMMENT, RATE_POST} from '../actions'
import {INVALIDATE_POST, REQUEST_POSTS, RECEIVE_POSTS} from '../actions'


// function posts(
//   state = {
//     isFetching: false,
//     didInvalidate: false,
//     items: []
//   },
//   action
// ) {
//   switch (action.type) {
//     case INVALIDATE_POST:
//       return Object.assign({}, state, {
//         didInvalidate: true
//       })
//     case REQUEST_POSTS:
//       return Object.assign({}, state, {
//         isFetching: true,
//         didInvalidate: false
//       })
//     case RECEIVE_POSTS:
//       return Object.assign({}, state, {
//         isFetching: false,
//         didInvalidate: false,
//         items: action.posts,
//         lastUpdated: action.receivedAt
//       })
//     default:
//       return state
//   }
// }

// function postsAndComments(state = {}, action) {
//   switch (action.type) {
//     case INVALIDATE_POST:
//     case RECEIVE_POSTS:
//     case REQUEST_POSTS:
//       return Object.assign({}, state, {
//         [action.subreddit]: posts(state[action.subreddit], action)
//       })
//     default:
//       return state
//   }
// }

function alert(state = null, action){
    const {message} = action
    switch(action.type){
        case SUCCESS:
            return message
        case DANGER:
            return message
        case WARNING:
            return message
        case CLEAR:
            return null
        default:
            return state
    }
}

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
        case CATEGORY_POSTS:
            return category
        case GET_POSTS:
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

function post(state = null, action){
    const {post} = action
    switch(action.type){
        case GET_POST:
            return post
        default:
            return state
    }
}

function posts(state = null, action){
    const {post, posts, category} = action
    switch(action.type){
        case POST_PAGE:
            return post

        case GET_POSTS:
            return posts

        // case GET_COMMENTS:
        // {            
        //     return posts.map((p) => {
        //         if(p.id === post.id) p.comments = comments
        //         return p
        //     })
        // }

        case CATEGORY_POSTS:
            return posts.filter((post) => post.category === category.name)
           
        case POST:
            return posts.concat(post)
                    
        case DELETE_POST:
            return {
                     ...state,
                     [post]: state[post].deleted = true 
                    }
        case EDIT_POST:
            return {
                     ...state,
                     [post]: state[post] = post 
                    }
        case RATE_POST:
            return {
                     ...state,
                     [post]: action.option === "upVote"? 
                     state[post].voteScore++ 
                     : state[post].voteScore--
                    }
        default:
            return state
    }
}

export default combineReducers({post, posts, category, categories, alert})

