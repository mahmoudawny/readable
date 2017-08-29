/*Category component displays page of posts which belong to the selected category*/
import React, { Component } from 'react'
import {capitalize} from '../utils/Helpers'
import Post from './Post'
// import * as api from '../utils/ReadableAPI'
import {connect} from 'react-redux'
import * as dispatchers from '../actions'


//TODO: Sorting 

class Category extends Component { 

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
     fetchPosts: (data) => dispatch(dispatchers.fetchPostsIfNeeded(data)),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Category)