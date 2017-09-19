
import {
    CATEGORIES, //get categories
    } from '../actions/types'


function categories(state = null, action) {
    const { categories } = action
    switch (action.type) {
        //case FETCH_CATEGORIES:
        case CATEGORIES:
            return categories
        default:
            return state
    }
}



export default categories;

