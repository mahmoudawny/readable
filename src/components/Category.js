/*Category component displays page of posts which belong to the selected category*/
import React, { Component } from 'react'
import {capitalize} from '../utils/Helpers'
import Post from './Post'
import FaSortAsc from 'react-icons/lib/fa/sort-asc'
import FaSortDesc from 'react-icons/lib/fa/sort-desc'
import {connect} from 'react-redux'
import * as dispatchers from '../actions'


//TODO: Sorting 

class Category extends Component { 

    render(){
        const {posts, currentCategory} = this.props
        return(
            currentCategory &&
            <div className='category'>                
                <h2 className='header'>{capitalize(currentCategory.name)}</h2>
                <div className="panel menu-item">                
                    <button className = 'icon-btn' onClick={() => this.props.sortPosts(dispatchers.DATE_SORT)}
                    >Date<FaSortAsc size='40'/></button>
                    <button className = 'icon-btn' onClick={() => this.props.sortPosts(dispatchers.VOTE_SORT)}
                    >Votes<FaSortAsc size='40'/></button>                  
                </div>
                <ul className='panel'>
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