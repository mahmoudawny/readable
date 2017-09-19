import {
    SET_CATEGORY, //set the current category
    GET_POSTS,  //async request actions for all items
    } from '../actions/types'


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

export default category;