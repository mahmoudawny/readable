import React, { Component } from 'react';
import {Route, Link} from 'react-router-dom'
import {capitalize} from '../utils/Helpers'
import Category from './Category'
import Post from './Post'
import * as api from '../utils/ReadableAPI'
import {connect} from 'react-redux'
import * as dispatchers from '../actions'

class App extends Component {
  state = {
    categories: [],
    currentCategory: null
  }

  componentDidMount(){
    const {category} = this.props
    //Load categories
    api.getCategories().then((categories) => {
      this.setState({categories})
    })
    //If there is a current category selected, load posts under it
    category? api.getPosts(category).then((posts) => {
      console.log("getting category posts")
      this.props.getCategoryPosts({posts, category})
    })
    //else load all posts
    : api.getAllPosts().then((posts) => {
      this.props.getAllPosts({posts, category})
    })//TODO add then() between categories and posts
  }

  // componentWillReceiveProps(){
  //   const {category} = this.props
  //   //Load categories

  //   //If there is a current category selected, load posts under it
  //   category? api.getPosts(category).then((posts) => {
  //     this.props.getCategoryPosts({posts, category})
  //   })
  //   //else load all posts
  //   : api.getAllPosts().then((posts) => {
  //     this.props.getAllPosts({posts, category})
  //   })
  // }

  render() {
    const {posts, category} = this.props
    const {categories, currentCategory} = this.state
    return (
      <div className="App">
        <div className="container">
          <div className="subheader">
            <h2>Welcome to the Readable posts project! </h2>
          </div>
          <div>
            <Route exact path='/' className="main"
              render={() => 
              <div className='container'>
                {categories? categories.map((category) => 
                <div key={category.name} className="list">                
                  <Link to={`/${category.path}`}
                  onClick={() => this.props.getCategoryPosts({posts, category})} 
                  key={category.name}>{capitalize(category.name)}</Link>
                </div>)
                : <h2>No categories to display</h2>}
                <ul className='list'>
                  <span className='header'> All Posts</span>
                    {posts && posts.map((post) => 
                      <li key={post.id}>
                          <Post key={post.id} post={post}>
                          </Post>
                      </li>)
                    } 
                </ul>  
              </div>              
              }
            />
            {category &&
            <Route path={`/${category.path}`} className="container"
                render={() => <Category ></Category>}
              />}
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps({posts, comments, category}){
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

export default connect(mapStateToProps,mapDispatchToProps)(App);
