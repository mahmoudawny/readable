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
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import {Alert, Collapse} from 'react-bootstrap'
import PostDetails from './PostDetails'

//TODO: Design CSS
//TODO: Sorting 
//TODO: update and delete buttons, functions and messages 
//TODO: voting buttons
//TODO: why comments won't appear in home and categories
//TODO: make back button appear in post details
//TODO: display all comments in PostDetails
//TODO: Change state to have Loading status and use thunk actions
//to fetch from server only when needed

class App extends Component {

  componentDidMount(){
    const {location} = this.props
    //Get all categories on loading App
    api.getCategories().then((categories) => {
      this.props.getCategories({categories})
    })
    //If homepage load all posts
    if(location.pathname === '/')
        this.getPostsAndComments()
  }

  componentWillReceiveProps(nextProps){ 
    //If url changes check props to reload all posts when returning 
    //to homepage 
    const {location} = this.props
    if(nextProps.location.pathname !== location.pathname){
      if(nextProps.location.pathname === '/') 
        this.getPostsAndComments()
    }
  }

  //getPostsAndComments inserts comments in their posts objects
  getPostsAndComments = (category) => {
    if(!category){
        api.getAllPosts().then((posts) => {
          if(posts) posts.map((post) => {
              api.getComments(post).then((comments) => {
                post.comments = comments
              })
              return post
            })
            this.props.getAllPosts({posts}) 
        })
    }
      else{
        api.getPosts(category.name).then((posts) => {
        if(posts) this.props.getCategoryPosts({
          posts: posts.map((post) => {
            api.getComments(post).then((comments) => {
              post.comments = comments
            })
            return post
          }),
          category
        }) 
      })
    }
  }

   //getPostAndComments inserts comments in a post object
  getPostAndComments = (id) => {
        api.getPost({id}).then((post) => {
          if(post) api.getComments(post).then((comments) => {
                post.comments = comments
                this.props.getPost({post})
              })           
        })
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
    const {posts, categories, location, alert} = this.props 
    if(posts) console.log(posts[0])
    return (
      <div className="App">
        <Collapse 
            in={alert? true: false}>
            <div><Alert bsStyle="success" onDismiss={this.handleAlertDismiss}>
              <button type="button" className="close" aria-label="Close" data-dismiss="alert">
                  <span aria-hidden="true">&times;</span>
              </button>
              <h4>{alert}</h4></Alert></div>
        </Collapse> 
        <div className="container">
          <div className="subheader">
            <h2>Welcome to the Readable posts project! </h2>
            {location.pathname !== "/add_post" && <Link 
                to = "/add_post"
                className = 'icon-btn' 
                ><FaPlusSquare size='40'/></Link>}
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
                  <Category getPostsAndComments={(category) => this.getPostsAndComments(category)} currentCategory={this.isCategory(props.match.params.category)?
                  {name: props.match.params.category, path: props.match.params.category}
                  :null}></Category>
                }
            />}
            {this.isCategory(location.pathname.substr(1).split('/')[0]) &&
            <Route path="/:category/:post" className="container"
                render={(props) => 
                  <PostDetails getPostAndComments={(id) => this.getPostAndComments(id)} 
                  postId = {props.match.params.post}
                  ></PostDetails>
                }
            />}
            <Route path="/add_post" className="container"
              render={() => 
                <CreatePost ></CreatePost>
              }
            />
          </div>
        </div>
      </div>
    );
  }
}



function mapStateToProps({posts, category, categories, alert}){
  return {
    posts, 
    category,
    categories,
    alert
  }
}

function mapDispatchToProps(dispatch){
  return{
    getPost:  (data) => dispatch(dispatchers.getPost(data)),
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
