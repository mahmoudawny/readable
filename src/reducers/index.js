import {combineReducers} from 'redux'
import {POST, DELETE_POST} from '../actions'

function comment(state = {}, action){
    const {comment} = action
    switch(action.type){

    }
    return state
}

function post(state = {}, action){
    const {post} = action
    switch(action.type){
        case 'POST':
            return {
                     state: state.concat(post)
                    }
        case 'DELETE_POST':
            return {
                     ...state,
                     [post]: post.deleted = true 
                    }
        default:
            return state
    }
}

export default combineReducers({post, comment})

