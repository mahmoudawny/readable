import {
    CLEAR, SUCCESS, DANGER, WARNING, //alert actions
    } from '../actions/types'


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


export default alert;

