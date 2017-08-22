import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import serializeForm from 'form-serialize'
import FaArrowCircleORight from 'react-icons/lib/fa/arrow-circle-right'
import {connect} from 'react-redux'
import * as dispatchers from '../actions'
import * as api from '../utils/ReadableAPI.js'
import FaArrowCircleOLeft from 'react-icons/lib/fa/arrow-circle-left'
import {capitalize} from '../utils/Helpers'
import * as messages from '../utils/Messages'

//TODO: page does not redirect to home(previous page) after submitting
//TODO: check if thunk helps in waiting for posts and categories to load in props
class CreatePost extends Component{
    newSubmit=(e)=>{
        e.preventDefault()
        // const {posts} = this.props
        const values = serializeForm(e.target,{hash:true})
        api.post(values).then((post) => {
            if(post.id){
                document.postform.reset()
                this.props.successMessage({message: messages.postCreated}) 
                api.getAllPosts().then((posts) => {
                    this.props.getAllPosts({posts, category: this.props.category? this.props.category: null})
                })               
                setTimeout(() => {this.props.clearMessage()
                }, 3000)                   
            }
            else this.props.dangerMessage({message: messages.postFailed})
        })
    }

    render(){
        return(
        <div>
            <Link className="close-create-post"
            to='/'>
            <button className='icon-btn'> <FaArrowCircleOLeft size='40'/></button></Link>
            <form name="postform" onSubmit={this.newSubmit} className='create-contact-form'>
                <div className='create-post-details'>
                    {this.props.category? <input type='hidden' name='category' value={this.props.category.name}/>
                    :<select required name='category'>
                        <option readOnly value="" >Please select a category</option>
                    {this.props.categories && this.props.categories.map((category) => 
                        <option value={category.name} key={category.name}>{capitalize(category.name)}</option>
                        )}
                    </select>}
                    <input type='hidden' name='id' value={Math.random().toString(36).substr(-8)}/>
                    <input type='hidden' name='timestamp' value={Number(Date.now())}/>
                    <input required name='title' placeholder='Title' type='text'/>
                    <input required name='body' placeholder='Body' type='text'/>
                    <input required name='author' placeholder='Author' type='text'/>
                    <button className='icon-btn' title='Add Post'>
                        <FaArrowCircleORight size='40'/>
                    </button>
                </div>
            </form>
        </div>
        )
    }
}

function mapStateToProps({posts, category, categories, message}){
  return {posts, category, categories, message}
}

function mapDispatchToProps(dispatch){
  return{
    addPost: (data) => dispatch(dispatchers.post(data)),
    getAllPosts: (data) => dispatch(dispatchers.getPosts(data)),
    clearMessage: (data) => dispatch(dispatchers.clearMessage(data)),
    successMessage: (data) => dispatch(dispatchers.successMessage(data)),
    dangerMessage: (data) => dispatch(dispatchers.dangerMessage(data))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(CreatePost)