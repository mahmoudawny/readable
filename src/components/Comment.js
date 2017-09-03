/*Comment component displays a comment's fields to be displayed in a list*/
import React, { Component } from 'react'
import {connect} from 'react-redux'
import * as dispatchers from '../actions'
import FaEdit from 'react-icons/lib/fa/edit'
import FaMinusSquare from 'react-icons/lib/fa/minus-square'
import FaThumbsODown from 'react-icons/lib/fa/thumbs-o-down'
import FaThumbsOUp from 'react-icons/lib/fa/thumbs-o-up'


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
            ><FaEdit size='40'/></button>
            <button 
                onClick = {() => this.fireConfirmation(comment)}
                className = 'icon-btn' 
            ><FaMinusSquare size='40'/></button>
            <button 
                onClick = {() => this.props.rateComment({comment, option: dispatchers.VOTEUP})}
                className = 'icon-btn vote-up' 
            ><FaThumbsOUp size='40'/></button>
            <button 
                onClick = {() => this.props.rateComment({comment, option: "downVote"})}
                className = 'icon-btn vote-down' 
            ><FaThumbsODown size='40'/></button>
          </div>
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
    getComment: (data) => dispatch(dispatchers.getComment(data)),
    deleteComment: (data) => dispatch(dispatchers.deleteComment(data)),
    editComment: (data) => dispatch(dispatchers.editComment(data)),
    rateComment: (data) => dispatch(dispatchers.rateComment(data)),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Comment);
