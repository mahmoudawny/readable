import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import serializeForm from 'form-serialize'
import FaArrowCircleORight from 'react-icons/lib/fa/arrow-circle-right'
import {connect} from 'react-redux'
import * as dispatchers from '../actions'
import {capitalize} from '../utils/Helpers'


class CreatePost extends Component{
    newSubmit = (e) => {
        e.preventDefault()
        this.props.setSubmitting()
        const values = serializeForm(e.target,{hash:true})
        this.props.doPost(values).then(() => {
            if(this.props.alert.type === "success"){
                this.props.setNotSubmitting()
                this.props.history.goBack()
            } 
        }) 
    }

    render(){
        const {submitting} = this.props
        return(
        <div>
            <div className="header">Create a post</div>
            <span><p>Just fill all fields and click the right arrow!</p></span>
            <form name="postform" onSubmit={this.newSubmit} >
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
    doPost: (data) => dispatch(dispatchers.doPost(data)),
    setSubmitting: (data) => dispatch(dispatchers.setSubmitting(data)),
    setNotSubmitting: (data) => dispatch(dispatchers.setNotSubmitting(data))
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(CreatePost))