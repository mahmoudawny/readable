/*Post component displays a post's fields to be displayed in a list of posts*/
import React, { Component } from 'react';
import {connect} from 'react-redux'
import * as dispatchers from '../actions'
import {Link} from 'react-router-dom'
// import * as api from '../utils/ReadableAPI.js'


class Post extends Component{
    //TODO: On click open post details with comments
    //TODO: better UI design
    
    // componentDidMount(){
    //     const {post, posts} = this.props
    //     api.getComments(post).then((comments) => {
    //       this.props.getComments({posts, post, comments})
    //     })
    // }

    // componentWillReceiveProps(nextProps){ 
    //   //If url changes check props to reload comments 
    //   const {location} = this.props
    //   if(nextProps.location.pathname !== location.pathname){
    //       const {post, posts} = this.props
    //       api.getComments(post).then((comments) => {
    //         this.props.getComments({posts, post, comments})
    //       })
    //   }
    // }

    render(){
        const {post, category, posts, comments} = this.props
        let postComments = comments.items.filter((comment) => comment.parentId === post.id)
        
        let timestamp = new Date(Number(post.timestamp));
        return(
          <div>{posts.isLoading? <div></div>
            :<div>
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
            <button className='post-edit' >Edit</button>
            <button className='post-remove' >Delete</button>
            <button className='post-voteup' >Vote Up</button>
            <button className='post-votedown' >Vote Down</button>
            </div>
          }</div>
        )
    }
}

function mapStateToProps({comments, posts, category}){
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