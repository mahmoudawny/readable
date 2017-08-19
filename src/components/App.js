/*App component handles main application routes*/
import React, { Component } from 'react';
import {Route, Link} from 'react-router-dom'
import {capitalize} from '../utils/Helpers'
import Category from './Category'
import Post from './Post'
import * as api from '../utils/ReadableAPI'
import {connect} from 'react-redux'
import * as dispatchers from '../actions'

//TODO: Add global add post button 

class App extends Component {
  state = {
    categories: []
  }

  componentWillMount(){
    const {category, location} = this.props
    //Get all categories on loading App
    api.getCategories().then((categories) => {
      this.setState({categories})
    })

    if(location.pathname === '/') api.getAllPosts().then((posts) => {
      this.props.getAllPosts({posts, category})
    })

  }

  componentWillReceiveProps(nextProps){ 
    const {category, location} = this.props
    if(nextProps.location.pathname !== location.pathname){
      if(nextProps.location.pathname === '/') 
        api.getAllPosts().then((posts) => {
        this.props.getAllPosts({posts, category})
      })
    }
  }

/*Main App routes:
- Global menu component (displays categories as menu items)
- Home route '/' displays all posts
- Category route displays selected category page
- Add route displays add post page
*/
  render() {
    const {posts} = this.props
    const {categories} = this.state
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
                  key={category.name}>{capitalize(category.name)}</Link>
                </div>)
                : <h2>No categories to display</h2>}
                <ul className='list'>
                  <span className='header'> All Posts</span>
                    {posts && posts.map((post) => 
                      <li key={post.id}>
                          <Post post={post}>
                          </Post>
                      </li>)
                    } 
                </ul>  
              </div>              
              }
            />
            {
            <Route path="/:category" className="container"
                render={(props) => 
                  <Category location={props.location} currentCategory={{name: props.match.params.category, path: props.match.params.category}}></Category>
                }
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
