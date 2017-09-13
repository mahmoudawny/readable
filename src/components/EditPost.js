import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import serializeForm from 'form-serialize'
import FaArrowCircleORight from 'react-icons/lib/fa/arrow-circle-right'
import { connect } from 'react-redux'
import * as dispatchers from '../actions'
import { capitalize } from '../utils/Helpers'

class EditPost extends Component {

    componentDidMount() {
        this.props.getPostAndComments(this.props.postId)
    }

    newSubmit = (e) => {
        const { post } = this.props
        e.preventDefault()
        this.props.setSubmitting()
        const body = serializeForm(e.currentTarget, { hash: true })
        this.props.editPost({ post, body }).then(() => {
            this.props.setNotSubmitting()
            if (this.props.alert.type === "success") {
                this.props.history.goBack()
            }
        })
    }


    render() {
        const { submitting, post, categories } = this.props
        if (post && categories) {
            return (
                <div>
                    <div className="header">Edit post: {post.title}</div>
                    <div className="container">
                        <span><p>Enter new values and click the right arrow, or click Back to cancel.</p></span>
                        <form key={post.id} name="postform" onSubmit={this.newSubmit}>
                            <div className='create-post-details'>
                                <select defaultValue={post.category} required name='category'>
                                    <option readOnly value="" >Please select a category</option>
                                    {this.props.categories && this.props.categories.map((category) =>
                                        <option value={category.name} key={category.name}>{capitalize(category.name)}</option>
                                    )}
                                </select>
                                <input type='hidden' name='id' value={post.id} />
                                <input type='hidden' name='timestamp' value={post.timestamp} />
                                <input ref={(input) => this.input = input} required name='title' defaultValue={post.title || ''} placeholder='Title' type='text' />
                                <textarea ref={(input) => this.input = input} required name='body' defaultValue={post.body} placeholder='Body' type='text' />
                                <input ref={(input) => this.input = input} required name='author' defaultValue={post.author} placeholder='Author' type='text' />
                                <button disabled={submitting} id="submit" className='submit clickable icon-btn' title='Add Post'>
                                    <FaArrowCircleORight size='60' />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )
        }
        else return (
            <div className="title"><p>Your page is being loaded, hit refresh if it takes too long.</p></div>
        )
    }
}

function mapStateToProps({ post, category, categories, alert, submitting }) {
    return { post, category, categories, alert, submitting }
}

function mapDispatchToProps(dispatch) {
    return {
        editPost: (data) => dispatch(dispatchers.editPost(data)),
        setSubmitting: (data) => dispatch(dispatchers.setSubmitting(data)),
        invalidatePosts: (data) => dispatch(dispatchers.invalidatePosts(data)),
        setNotSubmitting: (data) => dispatch(dispatchers.setNotSubmitting(data))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditPost))