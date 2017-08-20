/*App component handles main application routes*/
import React, { Component } from 'react';
import {Route, Link} from 'react-router-dom'
import {capitalize} from '../utils/Helpers'
import Category from './Category'
import Post from './Post'
import CreatePost from './CreatePost'
import * as api from '../utils/ReadableAPI'
import {connect} from 'react-redux'
import * as dispatchers from '../actions'
import FaPlusSquare from 'react-icons/lib/fa/plus-square'

//TODO: Make add post button disappear in Create Post
//TODO: Design CSS

class App extends Component {

  componentDidMount(){
    const {category, location} = this.props
    //Get all categories on loading App
    api.getCategories().then((categories) => {
      this.props.getCategories({categories})
    })
    //If homepage load all posts
    if(location.pathname === '/')
      api.getAllPosts().then((posts) => {
        this.props.getAllPosts({posts, category})
    })

  }

  componentWillReceiveProps(nextProps){ 
    //If url changes check props to reload all posts when returning 
    //to homepage 
    const {category, location} = this.props
    let checkCategory = this.isCategory(nextProps.location.pathname.substr(1))
    if(nextProps.location.pathname !== location.pathname){
      if(nextProps.location.pathname === '/') 
        api.getAllPosts().then((posts) => {
          this.props.getAllPosts({posts, category})
      })
    }
  }
  //isCategory method to check if a string value exists in currently
  // loaded categories
  isCategory(category){
    if(this.props.categories) {
      for(let i=0; i< this.props.categories.length; i++){
        if(category === this.props.categories[i].name) return true
      }
    }
    return false
  }

/*Main App routes:
- Global menu component (displays categories as menu items)
- Home route '/' displays all posts
- Category route displays selected category page
- Add route displays add post page
*/
  render() {
    const {posts, categories, location} = this.props 
    return (
      <div className="App">
        <div className="container">
          <div className="subheader">
            <h2>Welcome to the Readable posts project! </h2>
            <Link 
                to = "/add_post"
                className = 'icon-btn' 
                ><FaPlusSquare size='40'/></Link>
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
            />{this.isCategory(location.pathname.substr(1)) &&
            <Route path="/:category" className="container"
                render={(props) => 
                  <Category  currentCategory={this.isCategory(props.match.params.category)?
                  {name: props.match.params.category, path: props.match.params.category}
                  :null}></Category>
                }
            />}
            <Route path="/add_post" className="container"
              render={() => 
                <CreatePost  ></CreatePost>
              }
            />
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps({posts, comments, category, categories}){
  return {
    posts, 
    comments,
    category,
    categories
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
    getCategories: (data) => dispatch(dispatchers.getCategories(data))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(App);
