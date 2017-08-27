/*Comment component displays a comment's fields to be displayed in a list*/
import React, { Component } from 'react'
import {connect} from 'react-redux'
import * as dispatchers from '../actions'

class Comment extends Component{
    render(){
        const {comment} = this.props
        let timestamp = new Date(Number(comment.timestamp));
        return(
          <div>
            <div className='comment-details'>
                <p>Body: {comment.body}</p>
                <p>Author: {comment.author}</p>
                <p>Date: {timestamp.toLocaleDateString()}</p>
                <p>Time: {timestamp.toLocaleTimeString()}</p>
                <p>Score: {comment.voteScore}</p>
            </div>
            <button className='comment-edit' >Edit</button>
            <button className='comment-remove' >Delete</button>
            <button className='comment-voteup' >Vote Up</button>
            <button className='comment-votedown' >Vote Down</button>
          </div>
        )
    }
}

function mapStateToProps({post}){
  return {
    post
  }
}

function mapDispatchToProps(dispatch){
  return{
    addComment: (data) => dispatch(dispatchers.comment(data)),
    deleteComment: (data) => dispatch(dispatchers.deleteComment(data)),
    editComment: (data) => dispatch(dispatchers.editComment(data)),
    rateComment: (data) => dispatch(dispatchers.rateComment(data)),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Comment);
