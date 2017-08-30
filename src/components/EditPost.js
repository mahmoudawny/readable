import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import serializeForm from 'form-serialize'
import FaArrowCircleORight from 'react-icons/lib/fa/arrow-circle-right'
import {connect} from 'react-redux'
import * as dispatchers from '../actions'
import {capitalize} from '../utils/Helpers'


class EditPost extends Component{

    componentDidMount(){
        this.props.getPostAndComments(this.props.postId)
    }

    newSubmit = (e) => {
        const {post} = this.props
        e.preventDefault()
        this.props.setSubmitting()
        const body = serializeForm(e.currentTarget,{hash:true})
        this.props.editPost({post, body}).then(() => {
            if(this.props.alert.type === "success"){
                this.props.setNotSubmitting()
                this.props.category? this.props.history.push(`/${this.props.category}`) 
                : this.props.history.push("/")
            } 
        }) 
    }


    render(){
        const {submitting, post} = this.props
        if(post) {
            return(
            <div>
                <div className="header">Edit post: {post.title}</div>
                <span><p>Edit and click the right arrow, or click Back to cancel!</p></span>
                <form name="postform" onSubmit={this.newSubmit} className='create-contact-form'>
                    <div className='create-post-details'>
                        <select defaultValue={post.category} required name='category'>
                            <option readOnly value="" >Please select a category</option>
                        {this.props.categories && this.props.categories.map((category) => 
                            <option value={category.name} key={category.name}>{capitalize(category.name)}</option>
                            )}
                        </select>
                        <input type='hidden' name='id' value={post.id}/>
                        <input type='hidden' name='timestamp' value={post.timestamp}/>                    
                        <input ref={(input) => this.input = input} required name='title' defaultValue={post.title} placeholder='Title' type='text'/>
                        <input ref={(input) => this.input = input} required name='body' defaultValue={post.body} placeholder='Body' type='text'/>
                        <input ref={(input) => this.input = input} required name='author' defaultValue={post.author} placeholder='Author' type='text'/>
                        <button disabled={submitting} id="submit"  className='icon-btn' title='Add Post'>
                            <FaArrowCircleORight  size='40'/>
                        </button>
                    </div>
                </form>
            </div>
            )
            }
        else return(
                <div><p>Your page is being loaded, hit refresh if it takes too long.</p></div>
        )
    }
}

function mapStateToProps({post, category, categories, alert, submitting}){
  return {post, category, categories, alert, submitting}
}

function mapDispatchToProps(dispatch){
  return{
    //addPost: (data) => dispatch(dispatchers.post(data)),
    editPost: (data) => dispatch(dispatchers.editPost(data)),
    getAllPosts: (data) => dispatch(dispatchers.getPosts(data)),
    clearMessage: (data) => dispatch(dispatchers.clearMessage(data)),
    setSubmitting: (data) => dispatch(dispatchers.setSubmitting(data)),
    invalidatePosts: (data) => dispatch(dispatchers.invalidatePosts(data)),
    setNotSubmitting: (data) => dispatch(dispatchers.setNotSubmitting(data))
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(EditPost))