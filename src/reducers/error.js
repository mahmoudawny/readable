import {
    ERROR, //for error page
    } from '../actions/types'

//error page flag
function error(state = null, action) {
    switch (action.type) {
        case ERROR:
            return action.message
        default:
            return state
    }
}

export default error;