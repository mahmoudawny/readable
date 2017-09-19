import {
    SUBMITTING, NOTSUBMITTING, //set flag for posting operations
    } from '../actions/types'

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

export default submitting;