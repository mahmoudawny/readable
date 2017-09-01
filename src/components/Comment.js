/*Comment component displays a comment's fields to be displayed in a list*/
import React, { Component } from 'react'
import {connect} from 'react-redux'
import * as dispatchers from '../actions'
import FaEdit from 'react-icons/lib/fa/edit'
import FaMinusSquare from 'react-icons/lib/fa/minus-square'

class Comment extends Component{
    fireConfirmation(comment){
      if(window.confirm("Are you sure you want to delete this comment?")){
        this.props.deleteComment(comment)
      }
    }

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
            <button 
                onClick = {() => this.props.getComment({comment})}
                className = 'icon-btn' 
            ><FaEdit size='40'/>Edit Comment</button>
            <button 
                onClick = {() => this.fireConfirmation(comment)}
                className = 'icon-btn' 
            ><FaMinusSquare size='40'/>Delete Comment</button>
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
    getComment: (data) => dispatch(dispatchers.getComment(data)),
    deleteComment: (data) => dispatch(dispatchers.deleteComment(data)),
    editComment: (data) => dispatch(dispatchers.editComment(data)),
    rateComment: (data) => dispatch(dispatchers.rateComment(data)),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Comment);
