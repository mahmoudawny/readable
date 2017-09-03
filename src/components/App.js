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
import Loading from 'react-loading'
import EditPost from './EditPost'
import FaArrowCircleOLeft from 'react-icons/lib/fa/arrow-circle-left'

//TODO: Design CSS
//TODO: Sorting 
//TODO: route error page when invalid id's and categories in url 
//TODO: make a function for location pathname checking and routing
//TODO: alert slides up with green color
//TODO: if categories are null disable buttons 
//TODO: while submitting any action disable all buttons 
//TODO: check when to reenable submit and show/hide loading
//TODO: Add Handling failed fetches in all fetches in actions
//TODO: \n not working with alert messages

class App extends Component {

  componentDidMount(){
    const {location} = this.props
    //Get all categories on loading App
    api.getCategories().then((categories) => {
      this.props.getCategories({categories})
      //If homepage load all posts
      if(location.pathname === '/')
        this.props.fetchPosts(null)
      //if on a category page/subpage load only category's posts 
      else if(this.isCategory(location.pathname.substr(1).split('/')[0])){
        this.props.fetchPosts(location.pathname.substr(1).split('/')[0])        
      }
    })

  }

  componentWillReceiveProps(nextProps){ 
    //If url changes check props to reload all posts when returning 
    //to homepage
    const {location, posts} = this.props
    if(nextProps.location.pathname !== location.pathname){
      //check when returning from category pages if we need to fetch all posts
      if(nextProps.location.pathname === '/') 
        {
          this.props.setCategory(null)
          if(!posts.allPosts)
            {
              this.props.invalidatePosts()
              this.props.fetchPosts(null)
            } 
        }
      //if on a category page/subpage load only category's posts
      else if(this.isCategory(nextProps.location.pathname.substr(1).split('/')[0])){
        this.props.setCategory(nextProps.location.pathname.substr(1).split('/')[0])        
        this.props.fetchPosts(nextProps.location.pathname.substr(1).split('/')[0]) 
      }
    }
  }

   //getPostAndComments retrieves post and inserts comments in a post object 
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
- /Category route displays selected category page
- /AddPost route displays add post page
- /EditPost/id route displays edit post page
- /Category/post displays post details and its comments page
*/
  render() {
    const {posts, comments, categories, location, alert, history} = this.props
    const {items} = posts
    return (
      <div className="App">         
        <Collapse className="alert"
            in={alert? true: false}>
            <div><Alert bsStyle={alert? alert.type : "success"} onDismiss={this.handleAlertDismiss}>
              <button type="button" className="close" aria-label="Close" data-dismiss="alert">
                  <span aria-hidden="true">&times;</span>
              </button>
              <h4>{alert && alert.message}</h4></Alert></div>
        </Collapse> 
        <div className="col-xs-12">
          <div>
              {location.pathname !== "/" &&
                <button onClick={() => history.goBack()} className='icon-btn'> 
                        <FaArrowCircleOLeft size='40'/>
                </button>}
          </div>
          <div className="main-header">
            <div className="title">
            <h2><pre/>Welcome to the Readable posts project! <br/>Have fun posting :)<pre/></h2>
            </div>
              {location.pathname.substr(1).split('/').pop() !== "add_post" && <Link 
                to = {this.isCategory(location.pathname.substr(1).split('/')[0])?
                 `/${location.pathname.substr(1).split('/')[0]}/add_post` :
                 "/add_post"}
                className = 'icon-btn' 
                ><FaPlusSquare size='40'/></Link>}
                <div className="main-menu">
                 {categories? categories.map((category) => 
                <div key={category.name} className="menu-item">                
                  <Link to={`/${category.path}`}
                  key={category.name}>{capitalize(category.name)}</Link>
                </div>)
                : <h2>No categories to display</h2>}
                </div>
          </div>
          {(posts.isLoading || comments.isLoading) && <Loading delay={200} type='spin' color='#222' className='loading' />}
           <div>
            <Route exact path='/' className="main"
              render={() => 
              <div>
                <ul className='list'>
                  <span className='header'> All Posts</span>
                  <div className='container'>
                    {items && items.map((post) => 
                      <li key={post.id}>
                          <Post post={post}>
                          </Post>
                      </li>)
                    }</div>
                </ul>  
              </div>              
              }
            />{this.isCategory(location.pathname.substr(1)) &&
            <Route path="/:category" className="container"
                render={(props) => 
                  <Category 
                    currentCategory={this.isCategory(props.match.params.category)?
                  {name: props.match.params.category, path: props.match.params.category}
                  :null}></Category>
                }
            />}
            {this.isCategory(location.pathname.substr(1).split('/')[0]) &&
            location.pathname.substr(1).split('/').pop() !== "edit_post" &&
            location.pathname.substr(1).split('/').pop() !== "add_post" &&
            <Route path="/:category/:post" className="container"
                render={(props) => 
                  <PostDetails getPostAndComments={(id) => this.getPostAndComments(id)} 
                  postId = {props.match.params.post}
                  ></PostDetails>
                }
            />}
            {location.pathname.substr(1).split('/').pop() === "edit_post" &&
            <Route path="/:category/:post/edit_post" className="container"
                render={(props) => 
                  <EditPost getPostAndComments={(id) => this.getPostAndComments(id)} 
                  postId = {props.match.params.post}
                  ></EditPost>
                }
            />}
            {location.pathname.substr(1).split('/').pop() === "add_post" &&
            <Route path={this.isCategory(location.pathname.substr(1).split('/')[0])? 
            `/:category/add_post` :
            "/add_post"} className="container"
              render={() => 
                <CreatePost ></CreatePost>
              }
            />}
          </div>
        </div>
      </div>
    );
  }
}



function mapStateToProps({posts, comments, category, categories, alert}){
  return {
    posts,
    comments, 
    category,
    categories,
    alert
  }
}

function mapDispatchToProps(dispatch){
  return{
    getPost: (data) => dispatch(dispatchers.getPost(data)),
    getCategories: (data) => dispatch(dispatchers.getCategories(data)),
    fetchPosts: (data) => dispatch(dispatchers.fetchPostsIfNeeded(data)),
    setCategory: (data) => dispatch(dispatchers.setCategory(data)),
    invalidatePosts: (data) => dispatch(dispatchers.invalidatePosts(data)),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(App);
