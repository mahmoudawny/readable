/*PostDetails component displays a single post's details and comments, and allows commenting and rating*/
import React, { Component } from 'react'
import {connect} from 'react-redux'
import * as dispatchers from '../actions'
import Comment from './Comment'
import serializeForm from 'form-serialize'
import FaArrowCircleORight from 'react-icons/lib/fa/arrow-circle-right'
import {Link} from 'react-router-dom'
import FaEdit from 'react-icons/lib/fa/edit'
import FaBan from 'react-icons/lib/fa/ban'
import FaMinusSquare from 'react-icons/lib/fa/minus-square'
import {withRouter} from "react-router-dom"
import FaThumbsODown from 'react-icons/lib/fa/thumbs-o-down'
import FaThumbsOUp from 'react-icons/lib/fa/thumbs-o-up'

//TODO: scroll on clicking edit to show edit fields

class PostDetails extends Component{
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

    //confirm delete and redirect to previous page
    fireConfirmation(post){
      if(window.confirm("Are you sure you want to delete this post?")){
        this.props.deletePost(post)
        this.props.history.goBack()
      }
    }

    //submit comment
    newSubmit = (e) => {
        const {comment} = this.props
        e.preventDefault()
        this.props.setSubmitting()
        const body = serializeForm(e.currentTarget,{hash:true})
        if(comment) this.props.editComment({comment, body})
            .then(() => {
                this.props.cancelEditComment()
                this.props.setNotSubmitting()
                if(this.props.alert.type === "success")
                    this.props.getPostAndComments(this.props.postId) 
            })
        else this.props.doComment(body)
            .then(() => {
                this.props.cancelEditComment()
                this.props.setNotSubmitting()
                if(this.props.alert.type === "success")
                    this.props.getPostAndComments(this.props.postId)
            })
    }


    render(){
        const {post, comment} = this.props
        if(post) {
            let timestamp = new Date(Number(post.timestamp));
            return(
            <div>
                <div className='post-details'>
                    <h1>{post.category}</h1>
                    <p><strong>Title: {post.title}</strong></p>
                    <p>Body: {post.body}</p>
                    <p>Author: {post.author}</p>
                    <p>Date: {timestamp.toLocaleDateString()}</p>
                    <p>Time: {timestamp.toLocaleTimeString()}</p>
                    <p>Score: {post.voteScore}</p>
                    {post.comments && 
                    <div className='comment-list'>
                    <p><strong>Comments: {post.comments.length}</strong></p>
                    {post.comments.map((comment) => 
                    <Comment key={comment.id} comment = {comment}/>
                    )}
                    </div>
                    }
                </div>
                <form  name="commentform" onSubmit={this.newSubmit} className='create-contact-form'>
                    <div className='create-comment-details'>
                        {comment?
                        <div key={comment.id}>
                            <input type='hidden' name='parentId' value={comment.parentId}/>
                            <input type='hidden' name='id' value={comment.id}/>
                            <input type='hidden' name='timestamp' value={comment.timestamp}/>
                            <textarea defaultValue={comment.body} ref={(input) => this.input = input} required name='body' placeholder='Body' type='text'/>
                            <input defaultValue={comment.author} ref={(input) => this.input = input} required name='author' placeholder='Author' type='text'/>
                        </div>
                        : <div>
                            <input type='hidden' name='parentId' value={post.id}/>
                            <input type='hidden' name='id' value={Math.random().toString(36).substr(-8)}/>
                            <input type='hidden' name='timestamp' value={Number(Date.now())}/>
                            <textarea className="body-field" required name='body' placeholder='Body' type='text'/>
                            <input required name='author' placeholder='Author' type='text'/>
                        </div>
                        }
                        <button id="submit" className='icon-btn' title='Add/Edit Comment'>
                            <FaArrowCircleORight size='30'/>
                        </button>
                        {comment && <button id="cancel" onClick={() => this.props.cancelEditComment()} className='icon-btn' title='Cancel Edit'>
                            <FaBan size='30'/>
                        </button>}
                    </div>
                </form>
                <Link 
                    to = {`/${post.category}/${post.id}/edit_post`}
                    className = 'icon-btn' 
                ><FaEdit size='40'/></Link>
                <button 
                    onClick = {() => this.fireConfirmation(post)}
                    className = 'icon-btn' 
                ><FaMinusSquare size='40'/></button>
                <button 
                    onClick = {() => this.props.ratePost({post, option: dispatchers.VOTEUP})}
                    className = 'icon-btn vote-up' 
                ><FaThumbsOUp size='40'/></button>
                <button 
                    onClick = {() => this.props.ratePost({post, option: dispatchers.VOTEDOWN})}
                    className = 'icon-btn vote-down' 
                ><FaThumbsODown size='40'/></button>
            </div>
            )
            }
        else return(
            <div><p>Your page is being loaded, hit refresh if it takes too long.</p></div>
        )
    }
}

function mapStateToProps({post, comments, comment, alert}){
  return {
    post,
    comments,
    comment,
    alert
  }
}

function mapDispatchToProps(dispatch){
  return{
    sortComments: (data) => dispatch(dispatchers.sortComments(data)),
    deletePost: (data) => dispatch(dispatchers.deletePost(data)),
    editPost: (data) => dispatch(dispatchers.editPost(data)),
    ratePost: (data) => dispatch(dispatchers.ratePost(data)),
    doComment: (data) => dispatch(dispatchers.doComment(data)),
    editComment: (data) => dispatch(dispatchers.editComment(data)),
    cancelEditComment: (data) => dispatch(dispatchers.cancelEditComment(data)),
    setSubmitting: (data) => dispatch(dispatchers.setSubmitting(data)),
    invalidateComments: (data) => dispatch(dispatchers.invalidateComments(data)),
    setNotSubmitting: (data) => dispatch(dispatchers.setNotSubmitting(data))
  }
}
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(PostDetails))