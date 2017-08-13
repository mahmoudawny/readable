export const DELETE_POST = 'DELETE_POST'
export const POST = 'POST'

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