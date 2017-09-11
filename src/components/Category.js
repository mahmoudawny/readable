/*Category component displays page of posts which belong to the selected category*/
import React, { Component } from 'react'
import {capitalize} from '../utils/Helpers'
import Post from './Post'
import FaSortAsc from 'react-icons/lib/fa/sort-asc'
import FaSortDesc from 'react-icons/lib/fa/sort-desc'
import {connect} from 'react-redux'
import * as dispatchers from '../actions'


class Category extends Component { 

    render(){
        const {posts, currentCategory} = this.props
        return(
            currentCategory &&
            <div className="container">
            <div className='category'>                
                <h2 className='header'>{capitalize(currentCategory.name)}</h2>
                <div className="panel menu-item sorting"> 
                    <p>Sorted by: {posts.sortBy === 1? "Date (oldest first)"
                      : posts.sortBy === -1? "Date (newest first)"
                      : posts.sortBy === 2? "Vote (lowest first)"
                      : "Vote (highest first)"}</p>               
                    <button className = 'clickable icon-btn' onClick={() => this.props.sortPosts(dispatchers.DATE_SORT)}
                    >Date
                    {posts.sortBy === -1? <FaSortAsc size='40'/>
                    :<FaSortDesc size='40'/>}
                    </button>
                    <button className = 'clickable icon-btn' onClick={() => this.props.sortPosts(dispatchers.VOTE_SORT)}
                    >Votes{posts.sortBy === -2? <FaSortAsc size='40'/>
                    :<FaSortDesc size='40'/>}
                    </button>                  
                </div>
                <ul className=''>
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
     sortPosts: (data) => dispatch(dispatchers.sortPosts(data)),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Category)