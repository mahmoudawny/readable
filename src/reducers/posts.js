
import {
    START_POST, //async request actions for single items
    POST, EDIT_POST,  //async response for single items
    DELETE_POST, //delete actions
    RATE_COMMENT, RATE_POST, VOTEUP, //rating actions
    INVALIDATE_POST,  //async refresh actions
    GET_POSTS, GET_COMMENTS, //async request actions for all items
    RECEIVE_POSTS, RECEIVE_COMMENTS, //async response actions for all items
    DANGER,  //alert actions
    DATE_SORT, CATEGORY_SORT, VOTE_SORT, //post sort actions
    CURRENT_SORT,   // retain current sorting between pages
} from '../actions/types'


function posts(state = {
    isLoading: false,
    didInvalidate: false,
    items: []
}, action) {
    const { post } = action
    switch (action.type) {
        case INVALIDATE_POST:
            return Object.assign({}, state, {
                didInvalidate: true
            })
        case GET_POSTS:
            return Object.assign({}, state, {
                isLoading: true,
                didInvalidate: false
            })
        case GET_COMMENTS:
            return Object.assign({}, state, {
                isLoading: true,
                didInvalidate: false
            })
        case DANGER: //stop loading if error received
        case RATE_COMMENT:
        case RECEIVE_COMMENTS:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: false
            })
        case RECEIVE_POSTS:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: false,
                items: action.posts,
                allPosts: action.allPosts,
                lastUpdated: action.receivedAt
            })
        case START_POST:
            return Object.assign({}, state, {
                isLoading: true,
                didInvalidate: false
            })
        case POST:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: false,
                //concat post and sort according to current sorting setting
                items: state.items ? state.items.concat(action.post).sort((a, b) => {
                    switch (state.sortBy) {
                        case 1:  //date asc
                            return a.timestamp - b.timestamp
                        case -1: //date desc
                            return b.timestamp - a.timestamp
                        case 2:  //vote score asc
                            return a.voteScore - b.voteScore
                        case -2: //vote score desc
                            return b.voteScore - a.voteScore
                        case 3:  //cat score asc
                            return a.category > b.category ? 1 : -1
                        case -3: //cat score desc
                            return b.category > a.category ? 1 : -1
                        default:
                            return 0
                    }
                })
                    : [].push(action.post),
            })
        case EDIT_POST:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: false,
                items: state.items.map((oldpost) => {
                    if (oldpost.id === post.id)
                        return { ...oldpost, ...action.post }
                    return oldpost
                }),
            })
        case DELETE_POST:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: true,
                items: state.items.filter((oldpost) =>
                    oldpost.id !== post.id
                ),
            })
        case RATE_POST:
            return Object.assign({}, state, {
                isLoading: false,
                didInvalidate: false,
                items: state.items.map((oldpost) => {
                    if (oldpost.id === post.id)
                        return action.option === VOTEUP ? { ...oldpost, ...action.post, ...action.post.voteScore++ }
                            : { ...oldpost, ...action.post, ...action.post.voteScore-- }
                    return oldpost
                }),
            })
        case DATE_SORT:
            return Object.assign({}, state, {
                sortBy: Math.abs(state.sortBy) === 1 ? state.sortBy * -1 : -1, //if current sorting is by date reverse it, else set sorting by date desc
                items: Math.abs(state.sortBy) === 1 ?
                    state.items.sort((a, b) => {
                        return ((b.timestamp - a.timestamp) * state.sortBy)
                    })
                    : state.items.sort((a, b) => {
                        return b.timestamp - a.timestamp
                    })
            })
        case VOTE_SORT:
            return Object.assign({}, state, {
                sortBy: Math.abs(state.sortBy) === 2 ? state.sortBy * -1 : -2, //if current sorting is by vote reverse it, else set sorting by vote desc            
                items: Math.abs(state.sortBy) === 2 ?
                    state.items.sort((a, b) => {
                        return ((b.voteScore - a.voteScore) * state.sortBy)
                    })
                    : state.items.sort((a, b) => {
                        return b.voteScore - a.voteScore
                    })
            })
        case CATEGORY_SORT:
            return Object.assign({}, state, {
                sortBy: Math.abs(state.sortBy) === 3 ? state.sortBy * -1 : 3, //if current sorting is by category reverse it, else set sorting by category asc            
                items: Math.abs(state.sortBy) === 3 ?
                    state.items.sort((a, b) => {
                        if (a.category < b.category) {
                            return state.sortBy;
                        }
                        if (a.category > b.category) {

                            return state.sortBy * -1;
                        }
                        return 0;
                    })
                    : state.items.sort((a, b) => {
                        if (a.category < b.category) {
                            return -1;
                        }
                        if (a.category > b.category) {
                            return 1;
                        }
                        return 0;
                    })
            })
        case CURRENT_SORT:
            return Object.assign({}, state, {
                items: state.items.sort((a, b) => {
                    switch (state.sortBy) {
                        case 1:  //date asc
                            return a.timestamp - b.timestamp
                        case -1: //date desc
                            return b.timestamp - a.timestamp
                        case 2:  //vote score asc
                            return a.voteScore - b.voteScore
                        case -2: //vote score desc
                            return b.voteScore - a.voteScore
                        case 3:  //cat score asc
                            return a.category > b.category ? 1 : -1
                        case -3: //cat score desc
                            return b.category > a.category ? 1 : -1
                        default:
                            return 0
                    }
                })
            })
        default:
            return state
    }
}


export default posts;

