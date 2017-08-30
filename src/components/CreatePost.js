import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import serializeForm from 'form-serialize'
import FaArrowCircleORight from 'react-icons/lib/fa/arrow-circle-right'
import {connect} from 'react-redux'
import * as dispatchers from '../actions'
import {capitalize} from '../utils/Helpers'


//TODO: alert slides up with green color
//TODO: if categories are null disable buttons and refresh
//TODO: check when to reenable submit and show/hide loading

class CreatePost extends Component{
    newSubmit = (e) => {
        e.preventDefault()
        this.props.setSubmitting()
        const values = serializeForm(e.target,{hash:true})
        this.props.doPost(values).then(() => {
            if(this.props.alert.type === "success"){
                this.props.setNotSubmitting()
                this.props.category? this.props.history.push(`/${this.props.category}`) 
                : this.props.history.push("/")
            } 
        }) 
    }

    render(){
        const {submitting} = this.props
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
                    <button disabled={submitting} id="submit"  className='icon-btn' title='Add Post'>
                        <FaArrowCircleORight  size='40'/>
                    </button>
                </div>
            </form>
        </div>
        )
    }
}

function mapStateToProps({category, categories, alert, submitting}){
  return {category, categories, alert, submitting}
}

function mapDispatchToProps(dispatch){
  return{
    //addPost: (data) => dispatch(dispatchers.post(data)),
    doPost: (data) => dispatch(dispatchers.doPost(data)),
    getAllPosts: (data) => dispatch(dispatchers.getPosts(data)),
    clearMessage: (data) => dispatch(dispatchers.clearMessage(data)),
    setSubmitting: (data) => dispatch(dispatchers.setSubmitting(data)),
    invalidatePosts: (data) => dispatch(dispatchers.invalidatePosts(data)),
    setNotSubmitting: (data) => dispatch(dispatchers.setNotSubmitting(data))
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(CreatePost))