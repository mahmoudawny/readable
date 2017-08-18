const api = process.env.REACT_APP_READABLE_API_URL || 'http://localhost:5001'

let token = localStorage.token

if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token
}

export const getCategories = () =>
  fetch(`${api}/categories`, { headers })
    .then(res => res.json())
    .then(data => data.categories)

export const getPosts = (category) =>
  fetch(`${api}/${category}/posts`, { headers })
    .then(res => res.json())
 
//TODO: check which methods to remove data from?
export const getAllPosts = () =>
  fetch(`${api}/posts`, { headers })
    .then(res => res.json())

export const getPost = (post) =>
  fetch(`${api}/posts/${post.id}`, { headers })
    .then(res => res.json())
    .then(data => data.post)

export const deletePost = (post) =>
  fetch(`${api}/posts/${post.id}`, { method: 'DELETE', headers })
    .then(res => res.json())
    .then(data => data.post)

export const editPost = (post, body) =>
  fetch(`${api}/posts/${post.id}`, { method: 'PUT', 
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(res => res.json())

export const post = (body) =>
  fetch(`${api}/posts`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(res => res.json())

export const postRate = (post, body) =>
  fetch(`${api}/posts/${post.id}`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(res => res.json())

export const postComment = (body) =>
  fetch(`${api}/comments`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(res => res.json())

export const getComments = (post) =>
  fetch(`${api}/posts/${post.id}/comments`, { headers })
    .then(res => res.json())
    .then(data => data.post)

export const getComment = (comment) =>
  fetch(`${api}/comments/${comment.id}`, { headers })
    .then(res => res.json())
    .then(data => data.post)

export const rateComment = (comment, body) =>
  fetch(`${api}/comments/${comment.id}`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(res => res.json())

  export const editComment = (comment, body) =>
  fetch(`${api}/comments/${comment.id}`, { method: 'PUT', 
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(res => res.json())

  export const deleteComment = (comment) =>
  fetch(`${api}/comments/${comment.id}`, { method: 'DELETE', headers })
    .then(res => res.json())
    .then(data => data.post)