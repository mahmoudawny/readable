import {combineReducers} from 'redux'
import {POST_PAGE, CATEGORY_POSTS, GET_POSTS, POST, DELETE_POST, EDIT_POST, COMMENT, EDIT_COMMENT, DELETE_COMMENT, RATE_COMMENT, RATE_POST} from '../actions'


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

function comments(state = null, action){
    const {comment} = action
    switch(action.type){
        case COMMENT:
            return comments.concat(comment)
                    
        case DELETE_COMMENT:
            return {
                     ...state,
                     [comment]: state[comment].deleted = true 
                    }
        case EDIT_COMMENT:
            return {
                     ...state,
                     [comment]: state[comment] = comment 
                    }
        case RATE_COMMENT:
            return {
                     ...state,
                     [comment]: action.option === "upVote"? 
                     state[comment].voteScore++ 
                     : state[comment].voteScore--
                    }
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
            
        case CATEGORY_POSTS:
            return posts.filter((post) => post.category === category.name)
           
        case POST:
            return {
                     state: state.posts.concat(post)
                    }
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

export default combineReducers({posts, comments, category})

