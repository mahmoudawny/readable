export const DELETE_POST = 'DELETE_POST'
export const POST = 'POST'
export const EDIT_POST = 'EDIT_POST'
export const RATE_POST = 'RATE_POST'
export const DELETE_COMMENT = 'DELETE_COMMENT'
export const COMMENT = 'COMMENT'
export const EDIT_COMMENT = 'EDIT_COMMENT'
export const RATE_COMMENT = 'RATE_COMMENT'
export const GET_POSTS = 'GET_POSTS'
export const CATEGORY_POSTS = 'CATEGORY_POSTS'
export const POST_PAGE = 'POST_PAGE'


export function deletePost({post}){
    return{
        type: DELETE_POST,
        post
    }
}

export function post({post}){
    return{
        type: POST,
        post
    }
}

export function editPost({post}){
    return{
        type: EDIT_POST,
        post
    }
}

export function ratePost({post, option}){
    return{
        type: RATE_POST,
        post,
        option
    }
}

export function deleteComment({comment}){
    return{
        type: DELETE_COMMENT,
        comment
    }
}

export function comment({comment}){
    return{
        type: COMMENT,
        comment
    }
}

export function editComment({comment}){
    return{
        type: EDIT_COMMENT,
        comment
    }
}

export function rateComment({comment, option}){
    return{
        type: RATE_COMMENT,
        comment,
        option
    }
}



export function getPosts({posts}) {
  return {
    type: GET_POSTS,
    posts,
    category: null
  }
}



export function getCategoryPosts({posts, category, history}) {
  return {
    type: CATEGORY_POSTS,
    posts,
    category,
    history
  }
}



