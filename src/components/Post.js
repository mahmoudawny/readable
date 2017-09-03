/*Post component displays a post's fields to be displayed in a list of posts*/
import React, { Component } from 'react';
import {connect} from 'react-redux'
import * as dispatchers from '../actions'
import {Link} from 'react-router-dom'
import FaEdit from 'react-icons/lib/fa/edit'
import FaMinusSquare from 'react-icons/lib/fa/minus-square'
import FaThumbsODown from 'react-icons/lib/fa/thumbs-o-down'
import FaThumbsOUp from 'react-icons/lib/fa/thumbs-o-up'

class Post extends Component{

    //confirm delete
    fireConfirmation(post){
        if(window.confirm("Are you sure you want to delete this post?")){
          this.props.deletePost(post)
        }
    }

    render(){
        const {post, category, comments} = this.props
        //get current post's comments to show its count
        let postComments = comments.items.filter((comment) => comment.parentId === post.id)        
        let timestamp = new Date(Number(post.timestamp));
        return(
          <div>            
              <div className='post-details'>
                  {!category && <p>{post.category}</p>}
                  <Link 
                  to = {`/${post.category}/${post.id}`}
                  className = 'icon-btn'> 
                  <p>Title: {post.title}</p>
                  <p>Body: {post.body}</p>
                  <p>Author: {post.author}</p>
                  <p>Date: {timestamp.toLocaleDateString()}</p>
                  <p>Time: {timestamp.toLocaleTimeString()}</p>
                  <p>Score: {post.voteScore}</p>
                  {postComments && <p>Comments: {postComments.length}</p>}
                </Link>
            </div>
            <Link 
                to = {`/${post.category}/${post.id}/edit_post`}
                className = 'icon-btn' 
                ><FaEdit size='40'/></Link>
            <button 
                onClick = {() => this.fireConfirmation(post)}
                className = 'icon-btn dlt-btn' 
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
}

function mapStateToProps({comments, category}){
  return {
    comments,
    category
  }
}

function mapDispatchToProps(dispatch){
  return{
    deletePost: (data) => dispatch(dispatchers.deletePost(data)),
    editPost: (data) => dispatch(dispatchers.editPost(data)),
    ratePost: (data) => dispatch(dispatchers.ratePost(data)),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Post);