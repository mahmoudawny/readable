import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import serializeForm from 'form-serialize'
import FaArrowCircleORight from 'react-icons/lib/fa/arrow-circle-right'
import {connect} from 'react-redux'
import * as dispatchers from '../actions'
import * as api from '../utils/ReadableAPI.js'
import FaArrowCircleOLeft from 'react-icons/lib/fa/arrow-circle-left'
//TODO hidden fields not serialized
class CreatePost extends Component{
    newSubmit=(e)=>{
        e.preventDefault()
        const values = serializeForm(e.target,{hash:true})
        api.post(values).then((res) => {
            console.log(res)
            this.props.addPost(values)
        })
    }

    render(){
        return(
        <div>
            <Link className="close-create-post"
            to='/'>
            <button className='icon-btn'> <FaArrowCircleOLeft size='40'/></button></Link>
            <form onSubmit={this.newSubmit} className='create-contact-form'>
                <div className='create-post-details'>
                    <hidden name='id' value={Math.random().toString(36).substr(-8)}/>
                    <hidden name='timestamp' value={Date.now()}/>
                    <input name='title' placeholder='Title' type='text'/>
                    <input name='body' placeholder='Body' type='text'/>
                    <input name='author' placeholder='Author' type='text'/>
                    <button className='icon-btn' title='Add Post'>
                        <FaArrowCircleORight size='40'/>
                    </button>
                </div>
            </form>
        </div>
        )
    }
}

function mapStateToProps({posts}){
  return {posts}
}

function mapDispatchToProps(dispatch){
  return{
    addPost: (data) => dispatch(dispatchers.post(data)),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(CreatePost)