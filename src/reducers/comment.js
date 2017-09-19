import {
    CANCEL_COMMENTING, //to cancel editing comment
    GET_COMMENT, //get single comment and save in store
    } from '../actions/types'



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

export default comment;