/*PostDetails component displays a single post's details and comments, and allows commenting and rating*/
import React, { Component } from 'react'
import {connect} from 'react-redux'
import * as dispatchers from '../actions'
import Comment from './Comment'

class PostDetails extends Component{
    
    componentDidMount(){
        this.props.getPostAndComments(this.props.postId)
    }

    render(){
        const {post} = this.props
        if(post) {
        let timestamp = new Date(Number(post.timestamp));
        return(
          <div>
            <div className='post-details'>
                <p>{post.category}</p>
                <p>Title: {post.title}</p>
                <p>Body: {post.body}</p>
                <p>Author: {post.author}</p>
                <p>Date: {timestamp.toLocaleDateString()}</p>
                <p>Time: {timestamp.toLocaleTimeString()}</p>
                <p>Score: {post.voteScore}</p>
                {post.comments && 
                <div>
                  <a>Comments: {post.comments.length}</a>
                  {post.comments.map((comment) => 
                  <Comment key={comment.id} comment = {comment}/>
                  )}
                </div>
                }
            </div>
            <button className='post-edit' >Edit</button>
            <button className='post-remove' >Delete</button>
            <button className='post-voteup' >Vote Up</button>
            <button className='post-votedown' >Vote Down</button>
          </div>
        )
        }
    else return(
        <div><p>Nothing</p></div>
    )
    }
}

function mapStateToProps({post, comments}){
  return {
    post,
    comments
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
export default connect(mapStateToProps,mapDispatchToProps)(PostDetails)