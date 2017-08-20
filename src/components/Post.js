/*Post component displays a post's fields to be displayed in a list of posts*/
import React, { Component } from 'react';
import {connect} from 'react-redux'
import * as dispatchers from '../actions'

class Post extends Component{
    //TODO: On click open post details with comments
    //TODO: better UI design
    render(){
        const {post, category} = this.props
        let timestamp = new Date(post.timestamp);
        return(
          <div>
            <div className='post-details'>
                {!category && <p>{post.category}</p>}
                <p>Title: {post.title}</p>
                <p>Body: {post.body}</p>
                <p>Author: {post.author}</p>
                <p>Date: {timestamp.toLocaleDateString()}</p>
                <p>Time: {timestamp.toLocaleTimeString()}</p>
                <p>Score: {post.voteScore}</p>
            </div>
            <button className='post-remove' >Remove me</button>
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