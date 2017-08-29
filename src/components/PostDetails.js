/*PostDetails component displays a single post's details and comments, and allows commenting and rating*/
import React, { Component } from 'react'
import {connect} from 'react-redux'
import * as dispatchers from '../actions'
import Comment from './Comment'
import serializeForm from 'form-serialize'
import FaArrowCircleORight from 'react-icons/lib/fa/arrow-circle-right'

//TODO invalidate posts and comments on delete
//TODO alert not fired from actions file on commenting

class PostDetails extends Component{
    newSubmit = (e) => {
        e.preventDefault()
        const values = serializeForm(e.target,{hash:true})
        this.props.doComment(values)
    }

    componentDidMount(){
        this.props.getPostAndComments(this.props.postId)
    }

    componentWillReceiveProps(nextProps){ 
    const {comments} = this.props
    if(comments)
        if(comments.items.length !== nextProps.comments.items.length){
                this.props.getPostAndComments(this.props.postId)
            }
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
                <div className='comments-list'>
                  <a>Comments: {post.comments.length}</a>
                  {post.comments.map((comment) => 
                  <Comment key={comment.id} comment = {comment}/>
                  )}
                </div>
                }
            </div>
            <form name="commentform" onSubmit={this.newSubmit} className='create-contact-form'>
                <div className='create-comment-details'>
                    <input type='hidden' name='parentId' value={post.id}/>
                    <input type='hidden' name='id' value={Math.random().toString(36).substr(-8)}/>
                    <input type='hidden' name='timestamp' value={Number(Date.now())}/>
                    <input required name='body' placeholder='Body' type='text'/>
                    <input required name='author' placeholder='Author' type='text'/>
                    <button id="submit" className='icon-btn' title='Add Comment'>
                        <FaArrowCircleORight size='20'/>
                    </button>
                </div>
            </form>
            <button className='post-edit' >Edit</button>
            <button className='post-remove' >Delete</button>
            <button className='post-voteup' >Vote Up</button>
            <button className='post-votedown' >Vote Down</button>
          </div>
        )
        }
    else return(
        <div><p>Unfortunately, the post you requested cannot be displayed at the moment.</p></div>
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
    deletePost: (data) => dispatch(dispatchers.deletePost(data)),
    editPost: (data) => dispatch(dispatchers.editPost(data)),
    ratePost: (data) => dispatch(dispatchers.ratePost(data)),
    doComment: (data) => dispatch(dispatchers.doComment(data)),
    deleteComment: (data) => dispatch(dispatchers.deleteComment(data)),
    editComment: (data) => dispatch(dispatchers.editComment(data)),
    rateComment: (data) => dispatch(dispatchers.rateComment(data)),
    getAllPosts: (data) => dispatch(dispatchers.getPosts(data)),
    getCategoryPosts: (data) => dispatch(dispatchers.getCategoryPosts(data)),
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(PostDetails)