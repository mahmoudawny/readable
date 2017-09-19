import {
    START_COMMENT,  //async request actions for single items
    COMMENT, EDIT_COMMENT, //async response for single items
    DELETE_POST, DELETE_COMMENT, //delete actions
    RATE_COMMENT, VOTEUP, //rating actions
    INVALIDATE_COMMENT, //async refresh actions
    GET_POSTS, GET_COMMENTS, //async request actions for all items
    RECEIVE_COMMENTS, //async response actions for all items
    DANGER, //alert actions
    } from '../actions/types'


function comments(state = {
    isLoading: false,
    didInvalidate: false,
    items: []
}, action) {
    const { comment, post } = action
    switch (action.type) {
        case INVALIDATE_COMMENT:
            return Object.assign({}, state, {
                didInvalidate: true
            })
        case GET_COMMENTS:
            return Object.assign({}, state, {
                isLoading: true,
                didInvalidate: false
            })
        case GET_POSTS:
            return Object.assign({}, state, {
                items: []
            })
        case RECEIVE_COMMENTS:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: false,
                items: state.items ? state.items.concat(action.comments) : action.comments,
                lastUpdated: action.receivedAt
            })
        case START_COMMENT:
            return Object.assign({}, state, {
                isLoading: true,
                didInvalidate: false
            })
        case DANGER: //stop loading if error received
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: false
            })
        case COMMENT:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: true,
                items: state.items ? state.items.concat(action.comment) : [].push(action.comment),
            })
        case EDIT_COMMENT:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: true,
                items: state.items.map((oldcomment) => {
                    if (oldcomment.id === comment.id)
                        return { ...oldcomment, ...action.comment }
                    return oldcomment
                }),
            })
        case DELETE_COMMENT:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: false,
                items: state.items.filter((oldcomment) =>
                    oldcomment.id !== comment.id
                ),
            })
        case DELETE_POST:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: false,
                items: state.items.filter((oldcomment) =>
                    oldcomment.parentId !== post.id
                ),
            })
        case RATE_COMMENT:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: false,
                items: state.items.map((oldcomment) => {
                    if (oldcomment.id === comment.id)
                        return action.option === VOTEUP ? { ...oldcomment, ...action.comment, ...action.comment.voteScore++ }
                            : { ...oldcomment, ...action.comment, ...action.comment.voteScore-- }
                    return oldcomment
                }),
            })
        default:
            return state
    }
}



export default comments;