import fetch from 'isomorphic-fetch'
import * as messages from '../utils/Messages'
import * as types from "./types"

//server constants
const api = process.env.REACT_APP_READABLE_API_URL || 'http://localhost:5001'

let token = localStorage.token

if (!token)
    token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
    'Accept': 'application/json',
    'Authorization': token
}


//global dispatches

//update store with categories
function getCategories(categories) {
    return {
        type: types.CATEGORIES,
        categories
    }
}

//async fetch categories list
export function fetchCategories() {
    return dispatch => {
        return fetch(`${api}/categories`, { headers })
        .then(handleErrors)
        .then(res => res.json())
        .then(data => {
            dispatch(getCategories(data.categories))
        })
        .catch((error) => {
            dispatch(dangerMessage({ message: messages.generalFailed + `\n` + error.toString() }))
            setTimeout(() => { dispatch(clearMessage()) }, 3000)
        })
    }
}

export function setError({ message }) {
    return {
        type: types.ERROR,
        message
    }
}


export function successMessage({ message }) {
    return {
        type: types.SUCCESS,
        message
    }
}
export function warningMessage({ message }) {
    return {
        type: types.WARNING,
        message
    }
}
export function dangerMessage({ message }) {
    return {
        type: types.DANGER,
        message
    }
}

export function clearMessage() {
    return {
        type: types.CLEAR,
        message: null
    }
}

// error handler for fetch
export function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

export function setSubmitting() {
    return {
        type: types.SUBMITTING
    }
}

export function setNotSubmitting() {
    return {
        type: types.NOTSUBMITTING
    }
}

export function setCategory(category) {
    return {
        type: types.SET_CATEGORY,
        category
    }
}



