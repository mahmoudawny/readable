import {
    COMMENT, EDIT_COMMENT, //async response for single items
    GET_POST, RECEIVE_POST, //get single post and save in store
    DANGER,  //alert actions
    COMMENT_DATE_SORT, COMMENT_VOTE_SORT, // comment sort actions
    COMMENT_CURRENT_SORT   // retain current sorting between pages
} from '../actions/types'

//current post state
function post(state = null, action) {
    const { post, comment } = action
    switch (action.type) {
        case DANGER:
            return Object.assign({}, state, {
                isLoading: false
            })
        case GET_POST:
            return Object.assign({}, state, {
                isLoading: true
            })
        case RECEIVE_POST:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: true,
                ...post,
                comments: action.comments,
            })
        case COMMENT:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: true,
                comments: state.comments ? state.comments.concat(action.comment) : [].push(action.comment),
            })
        case EDIT_COMMENT:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: true,
                comments: state.comments.map((oldcomment) => {
                    if (oldcomment.id === comment.id)
                        return { ...oldcomment, ...action.comment }
                    return oldcomment
                }),
            })
        case COMMENT_DATE_SORT:
            return Object.assign({}, state, {
                sortBy: Math.abs(state.sortBy) === 1 ? state.sortBy * -1 : -1, //if current sorting is by date reverse it, else set sorting by date desc
                comments: state.comments ?
                    Math.abs(state.sortBy) === 1 ?
                        state.comments.sort(function (a, b) {
                            return ((b.timestamp - a.timestamp) * state.sortBy)
                        })
                        : state.comments.sort(function (a, b) {
                            return b.timestamp - a.timestamp
                        })
                    : []
            })
        case COMMENT_VOTE_SORT:
            return Object.assign({}, state, {
                sortBy: Math.abs(state.sortBy) === 2 ? state.sortBy * -1 : -2, //if current sorting is by vote reverse it, else set sorting by vote desc            
                comments: state.comments ?
                    Math.abs(state.sortBy) === 2 ?
                        state.comments.sort(function (a, b) {
                            return ((b.voteScore - a.voteScore) * state.sortBy)
                        })
                        : state.comments.sort(function (a, b) {
                            return b.voteScore - a.voteScore
                        })
                    : []
            })
        case COMMENT_CURRENT_SORT:
            return Object.assign({}, state, {
                comments: state.comments.sort((a, b) => {
                    switch (state.sortBy) {
                        case 1:  //date asc
                            return a.timestamp - b.timestamp
                        case -1: //date desc
                            return b.timestamp - a.timestamp
                        case 2:  //vote score asc
                            return a.voteScore - b.voteScore
                        case -2: //vote score desc
                            return b.voteScore - a.voteScore
                        default:
                            return 0
                    }
                })
            })
        default:
            return state
    }
}

export default post;