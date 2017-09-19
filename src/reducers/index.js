import { combineReducers } from 'redux'
import posts from './posts'
import comments from './comments'
import categories from './categories'
import post from './post'
import comment from './comment'
import category from './category'
import alert from './alert'
import error from './error'
import submitting from './submitting'



export default combineReducers({ error, submitting, post, posts, comment, comments, category, categories, alert })

