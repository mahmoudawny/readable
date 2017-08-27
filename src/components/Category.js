/*Category component displays page of posts which belong to the selected category*/
import React, { Component } from 'react'
import {capitalize} from '../utils/Helpers'
import Post from './Post'
// import * as api from '../utils/ReadableAPI'
import {connect} from 'react-redux'
import * as dispatchers from '../actions'


//TODO: Sorting 
//TODO: only category posts from server on refreshing

class Category extends Component { 

    componentDidMount(){
        //load current category's posts
        const {currentCategory} = this.props
        if(currentCategory)
            this.props.getPostsAndComments(currentCategory.name)
    }

    render(){
        const {posts, currentCategory} = this.props
        return(
            currentCategory &&
            <div className='category'>                
                <h2 className='subheader'>{capitalize(currentCategory.name)}</h2>
                <ul className='post-list'>
                    {posts.items && posts.items.map((post) => 
                    <div key={post.id}>{post.category === currentCategory.name &&
                        <li key={post.id}>
                        <Post post={post}>
                        </Post>
                        </li>}
                    </div>
                    )}
                </ul>
            </div>
        )
    }
}

function mapStateToProps({posts, comments, category}){
  return {posts, comments, category}
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
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Category)