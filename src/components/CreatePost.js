import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import serializeForm from 'form-serialize'
import FaArrowCircleORight from 'react-icons/lib/fa/arrow-circle-right'
import {connect} from 'react-redux'
import * as dispatchers from '../actions'
import * as api from '../utils/ReadableAPI.js'
import {capitalize} from '../utils/Helpers'
import * as messages from '../utils/Messages'

//TODO: add post to store

class CreatePost extends Component{
    newSubmit = (e) => {
        e.preventDefault()
        const values = serializeForm(e.target,{hash:true})
        this.props.doPost(values)
        this.props.category? this.props.history.push(`/${this.props.category}`) 
        : this.props.history.push("/") 
        // api.post(values).then((post) => {
        //     if(post.id){
        //         document.postform.reset()
        //         this.props.successMessage({type:"SUCCESS", message: messages.postCreated})    
        //         this.props.invalidatePosts()
        //         //return to home or previous page after posting
       
                
        //         //clear message after 3 seconds
        //         setTimeout(() => {this.props.clearMessage()
        //         }, 3000)                   
        //     }
        //     //else this.props.dangerMessage({message: messages.postFailed})
        // })
    }

    render(){
        return(
        <div>
            <div className="header">Create a post</div>
            <span><p>Just fill all fields and click the right arrow!</p></span>
            <form name="postform" onSubmit={this.newSubmit} className='create-contact-form'>
                <div className='create-post-details'>
                    {this.props.category? <input type='hidden' name='category' value={this.props.category}/>
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
                    <button id="submit" className='icon-btn' title='Add Post'>
                        <FaArrowCircleORight size='40'/>
                    </button>
                </div>
            </form>
        </div>
        )
    }
}

function mapStateToProps({category, categories, alert}){
  return {category, categories, alert}
}

function mapDispatchToProps(dispatch){
  return{
    //addPost: (data) => dispatch(dispatchers.post(data)),
    doPost: (data) => dispatch(dispatchers.doPost(data)),
    getAllPosts: (data) => dispatch(dispatchers.getPosts(data)),
    clearMessage: (data) => dispatch(dispatchers.clearMessage(data)),
    successMessage: (data) => dispatch(dispatchers.successMessage(data)),
    invalidatePosts: (data) => dispatch(dispatchers.invalidatePosts(data)),
    dangerMessage: (data) => dispatch(dispatchers.dangerMessage(data))
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(CreatePost))