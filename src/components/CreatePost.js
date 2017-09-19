import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import serializeForm from 'form-serialize'
import FaArrowCircleORight from 'react-icons/lib/fa/arrow-circle-right'
import { connect } from 'react-redux'
import * as dispatchers from '../actions'
import * as postActions from '../actions/PostActions'
import { capitalize } from '../utils/Helpers'


class CreatePost extends Component {
    newSubmit = (e) => {
        e.preventDefault()
        this.props.setSubmitting()
        const values = serializeForm(e.target, { hash: true })
        this.props.doPost(values).then(() => {
            if (this.props.alert.type === "success") {
                this.props.setNotSubmitting()
                this.props.history.goBack()
            }
        })
    }

    render() {
        const { submitting, categories } = this.props
        if (categories) return (
            <div className="container">
                <div className="header">Create a post</div>
                <span className="help"><p>Just fill all fields and click the right arrow!</p></span>
                <form name="postform" onSubmit={this.newSubmit} >
                    <div className='create-post-details'>
                        {this.props.category ? <input type='hidden' name='category' value={this.props.category} />
                            : <div className="select"><select required name='category'>
                                <option readOnly value="" >Please select a category</option>
                                {this.props.categories && this.props.categories.map((category) =>
                                    <option value={category.name} key={category.name}>{capitalize(category.name)}</option>
                                )}
                            </select></div>}
                        <input type='hidden' name='id' value={Math.random().toString(36).substr(-8)} />
                        <input type='hidden' name='timestamp' value={Number(Date.now())} />
                        <input className="input-field" required name='title' placeholder='Title' type='text' />
                        <textarea required name='body' placeholder='Body' type='text' />
                        <input className="input-field" required name='author' placeholder='Author' type='text' />
                        <button disabled={submitting} id="submit" className='submit clickable icon-btn' title='Add Post'>
                            <FaArrowCircleORight size='60' />
                        </button>
                    </div>
                </form>
            </div>
        )
        else return (
            <div className="title"><p>There has been a problem retrieving categories, please try again later.</p></div>
        )
    }
}

function mapStateToProps({ category, categories, alert, submitting }) {
    return { category, categories, alert, submitting }
}

function mapDispatchToProps(dispatch) {
    return {
        doPost: (data) => dispatch(postActions.doPost(data)),
        setSubmitting: (data) => dispatch(dispatchers.setSubmitting(data)),
        setNotSubmitting: (data) => dispatch(dispatchers.setNotSubmitting(data))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreatePost))