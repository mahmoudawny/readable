/*App component handles main application routes*/
import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom'
import { capitalize } from '../utils/Helpers'
import Category from './Category'
import CreatePost from './CreatePost'
import { connect } from 'react-redux'
import * as dispatchers from '../actions/types'
import * as postActions from '../actions/PostActions'
import * as globalActions from '../actions'
import FaPlusSquare from 'react-icons/lib/fa/plus-square'
import { Alert, Collapse } from 'react-bootstrap'
import PostDetails from './PostDetails'
import Loading from 'react-loading'
import EditPost from './EditPost'
import FaArrowCircleOLeft from 'react-icons/lib/fa/arrow-circle-left'
import HomePage from './HomePage'


//TODO: while submitting any action disable all buttons until alert, make fetchpost thunk

class App extends Component {

  componentDidMount() {
    const { location } = this.props
    //Get all categories on loading App
    this.props.fetchCategories().then(() => {
      if (this.props.categories) {
        //If homepage load all posts
        if (location.pathname === '/')
          this.props.fetchPosts(null)
            .then(() => {
              this.props.sortPosts(dispatchers.VOTE_SORT)
            })
        //If on a category page load only category's posts 
        else if (this.isCategory(this.splitPath(location.pathname).pop())) {
          this.props.fetchPosts(this.splitPath(location.pathname).pop())
            .then(() => {
              this.props.sortPosts(dispatchers.VOTE_SORT)
            })
        }
      }
    })
//If on any other page handle loading in page's DidMount
  }

  componentWillReceiveProps(nextProps) {
    //If url changes check props to reload all posts when returning 
    //to homepage
    const { location, posts } = this.props
    if (nextProps.location.pathname !== location.pathname) {
      //check when returning from category pages if we need to fetch all posts
      if (nextProps.location.pathname === '/') {
        this.props.setCategory(null)
        if (!posts.allPosts) {
          this.props.invalidatePosts()
          this.props.fetchPosts(null)
            .then(() => this.props.sortPosts(dispatchers.CURRENT_SORT))
        }
      }
      //if on a category page/subpage load only category's posts
      else if (this.isCategory(this.splitPath(nextProps.location.pathname)[0])) {
        this.props.invalidatePosts()
        this.props.setCategory(this.splitPath(nextProps.location.pathname)[0])
        this.props.fetchPosts(this.splitPath(nextProps.location.pathname)[0])
          .then(() => {
            if (Math.abs(posts.sortBy) === 3)
              {
                this.props.sortPosts(dispatchers.VOTE_SORT)
                this.props.warningMessage({message: "Category sorting is unavailable in this page. Sorting was reset."})
                setTimeout(() => { this.props.clearMessage() }, 3000)
              }
            else
              this.props.sortPosts(dispatchers.CURRENT_SORT)
          })
      }
    }
  }



  //isCategory method to check if a string value exists in currently
  // loaded categories
  isCategory(category) {
    if (this.props.categories) {
      for (let i = 0; i < this.props.categories.length; i++) {
        if (category === this.props.categories[i].name) return true
      }
    }
    return false
  }

  //splitPath function to parse destination url and return array of its elements
  splitPath(path) {
    return path.substr(1).split('/')
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
    const { posts, comments, categories, location, alert, history } = this.props
    return (
      <div className="App">
        <Collapse
          in={alert.message ? true : false}>
          <div><Alert bsStyle={alert.type} onDismiss={this.handleAlertDismiss}>
            <h3>{alert && alert.message}</h3></Alert></div>
        </Collapse>
        <div className="col-xs-12">
          <div className="back-btn">
            {location.pathname !== "/" &&
              <button onClick={() => history.goBack()} className='clickable icon-btn'>
                <FaArrowCircleOLeft size='60' />
              </button>}
          </div>
          <div className="main-header">
            <div className="title">
              <h2><pre />Welcome to the Readable posts project! <br />Have fun posting <pre /></h2>
            </div>
            <div className="main-menu">
              <Link className="panel menu-item" to='/'>Home</Link>
              {categories && categories.map((category) =>
                <div key={category.name} className="panel menu-item">
                  <Link className=''
                    to={`/${category.path}`}
                    key={category.name}>{capitalize(category.name)}</Link>
                </div>)
               }
            </div>
          </div>
          {(posts.isLoading || comments.isLoading) && <Loading delay={200} type='spin' color='#222' className='loading' />}
          {categories &&
            <div className="left-menu-container">
              <div className="left-menu">
                {this.splitPath(location.pathname).pop() !== "add_post" &&
                  this.splitPath(location.pathname).pop() !== "edit_post" &&
                  <Link
                    to={this.isCategory(this.splitPath(location.pathname)[0]) ?
                      `/${this.splitPath(location.pathname)[0]}/add_post` :
                      "/add_post"}
                    className='clickable icon-btn'
                  ><FaPlusSquare size='60' /></Link>}
              </div>
              <Switch>
                <Route exact path='/' className="main"
                  component={HomePage} />
                {this.isCategory(location.pathname.substr(1)) &&
                  <Route path="/:category" className="container"
                    render={(props) =>
                      <Category
                        currentCategory={this.isCategory(props.match.params.category) ?
                          { name: props.match.params.category, path: props.match.params.category }
                          : null}></Category>
                    }
                  />}
                {this.isCategory(this.splitPath(location.pathname)[0]) &&
                  this.splitPath(location.pathname).pop() !== "edit_post" &&
                  this.splitPath(location.pathname).pop() !== "add_post" &&
                  <Route path="/:category/:post" className="container"
                    render={(props) =>
                      <PostDetails
                        postId={props.match.params.post}
                      ></PostDetails>
                    }
                  />}
                {this.splitPath(location.pathname).pop() === "edit_post" &&
                  <Route path="/:category/:post/edit_post" className="container"
                    render={(props) =>
                      <EditPost
                        postId={props.match.params.post}
                      ></EditPost>
                    }
                  />}
                {this.splitPath(location.pathname).pop() === "add_post" &&
                  <Route path={this.isCategory(this.splitPath(location.pathname)[0]) ?
                    `/:category/add_post` :
                    "/add_post"} className="container"
                    component ={CreatePost}/>
                    }
                  />}
                <Route path="*" render={() =>
                  <div className="title"><h3>Sorry, Page Not Found! Please click <Link to='/'>here to go to homepage</Link></h3>
                    <br />{this.props.error}</div>} />
              </Switch>
            </div>}
          <pre />
          <footer >All rights reserved</footer>
        </div>

      </div>
    )
  }
}



function mapStateToProps({ posts, comments, category, categories, alert }) {
  return {
    posts,
    comments,
    category,
    categories,
    alert
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchCategories: (data) => dispatch(globalActions.fetchCategories(data)),
    fetchPosts: (data) => dispatch(postActions.fetchPostsIfNeeded(data)),
    setCategory: (data) => dispatch(globalActions.setCategory(data)),
    invalidatePosts: (data) => dispatch(postActions.invalidatePosts(data)),
    sortPosts: (data) => dispatch(postActions.sortPosts(data)),
    warningMessage: (data) => dispatch(globalActions.warningMessage(data)),
    clearMessage: (data) => dispatch(globalActions.clearMessage(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
