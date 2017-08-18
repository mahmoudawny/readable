import React, { Component } from 'react';
import {connect} from 'react-redux'
import * as dispatchers from '../actions'

class Post extends Component{
    render(){
        const {post, category} = this.props
        return(
            <div className='container'>
                {!category && <p>{post.category}</p>}
                <p>{post.title}</p>
                <p>{post.body}</p>
                <p>{post.author}</p>
                <p>{post.timestamp}</p>
                <p>{post.voteScore}</p>
            </div>
        )
    }
}
function mapStateToProps({posts, comments, category}){
  return {
    posts, 
    comments,
    category
  }
}

function mapDispatchToProps(dispatch){
  return{
    addPost: (data) => dispatch(dispatchers.post(data)),
    deletePost: (data) => dispatch(dispatchers.deletePost(data)),
    editPost: (data) => dispatch(dispatchers.editPost(data)),
    ratePost: (data) => dispatch(dispatchers.ratePost(data)),
    addComment: (data) => dispatch(dispatchers.comment(data)),
    deleteComment: (data) => dispatch(dispatchers.deleteComment(data)),
    editComment: (data) => dispatch(dispatchers.editComment(data)),
    rateComment: (data) => dispatch(dispatchers.rateComment(data)),
    getAllPosts: (data) => dispatch(dispatchers.getPosts(data)),
    getCategoryPosts: (data) => dispatch(dispatchers.getCategoryPosts(data)),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Post);