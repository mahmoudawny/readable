import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import serializeForm from 'form-serialize'
import FaArrowCircleORight from 'react-icons/lib/fa/arrow-circle-right'
import {connect} from 'react-redux'
import * as dispatchers from '../actions'
import * as api from '../utils/ReadableAPI.js'
import FaArrowCircleOLeft from 'react-icons/lib/fa/arrow-circle-left'
import {capitalize} from '../utils/Helpers'

//TODO: load posts to prevent reducer concat error, check loading from App 
//TODO: check if thunk helps in waiting for posts and categories to load in props
class CreatePost extends Component{
    newSubmit=(e)=>{
        e.preventDefault()
        const {posts} = this.props
        const values = serializeForm(e.target,{hash:true})
        api.post(values).then((post) => {
            this.props.addPost({posts, post})
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
                    {this.props.category? <input type='hidden' name='category' value={this.props.category.name}/>
                    :<select required name='category'>
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

function mapStateToProps({posts, category, categories}){
  return {posts, category, categories}
}

function mapDispatchToProps(dispatch){
  return{
    addPost: (data) => dispatch(dispatchers.post(data)),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(CreatePost)