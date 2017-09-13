import React, { Component } from 'react';
import Post from './Post'
import { connect } from 'react-redux'
import * as dispatchers from '../actions'
import { Alert, Collapse } from 'react-bootstrap'
import FaSortAsc from 'react-icons/lib/fa/sort-asc'
import FaSortDesc from 'react-icons/lib/fa/sort-desc'

class HomePage extends Component{
    render(){
        const { posts } = this.props
        const { items } = posts
        return (
            <div className="posts-container">
                      <ul className='list'>
                        <span className='header'>All Posts</span>
                        <div className=" sorting-container">
                          <p className='sorted-by'>Sorted by: {posts.sortBy === 1 ? "Date (oldest first)"
                            : posts.sortBy === -1 ? "Date (newest first)"
                              : posts.sortBy === 2 ? "Votes (lowest first)"
                                : posts.sortBy === -2 ? "Votes (highest first)"
                                  : posts.sortBy === 3 ? "Category (ascendingly)"
                                    : "Category (descendingly)"}</p>
                          <div className="sorting">
                            <button className='clickable icon-btn' onClick={() => this.props.sortPosts(dispatchers.DATE_SORT)}
                            >Date
                            {posts.sortBy === -1 ? <FaSortAsc size='40' />
                                : <FaSortDesc size='40' />}
                            </button>
                            <button className='clickable icon-btn' onClick={() => this.props.sortPosts(dispatchers.VOTE_SORT)}
                            >Votes{posts.sortBy === -2 ? <FaSortAsc size='40' />
                              : <FaSortDesc size='40' />}
                            </button>
                            <button className='clickable icon-btn' onClick={() => this.props.sortPosts(dispatchers.CATEGORY_SORT)}
                            >Category{posts.sortBy === 3 ? <FaSortDesc size='40' />
                              : <FaSortAsc size='40' />}
                            </button>
                          </div>
                        </div>
                        <div className='container'>
                          {items && items.map((post) =>
                            <li key={post.id}>
                              <Post post={post}>
                              </Post>
                            </li>)
                          }</div>
                      </ul>
                    </div>
        )
    }
}

function mapStateToProps({ posts }) {
  return {
    posts,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    sortPosts: (data) => dispatch(dispatchers.sortPosts(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);