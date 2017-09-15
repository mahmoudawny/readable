/*PostDetails component displays a single post's details and comments, and allows commenting and rating*/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as dispatchers from '../actions'
import Comment from './Comment'
import serializeForm from 'form-serialize'
import FaArrowCircleORight from 'react-icons/lib/fa/arrow-circle-right'
import { Link } from 'react-router-dom'
import FaEdit from 'react-icons/lib/fa/edit'
import FaBan from 'react-icons/lib/fa/ban'
import FaMinusSquare from 'react-icons/lib/fa/minus-square'
import { withRouter } from "react-router-dom"
import FaThumbsODown from 'react-icons/lib/fa/thumbs-o-down'
import FaThumbsOUp from 'react-icons/lib/fa/thumbs-o-up'
import { capitalize } from '../utils/Helpers'
import FaSortAsc from 'react-icons/lib/fa/sort-asc'
import FaSortDesc from 'react-icons/lib/fa/sort-desc'


class PostDetails extends Component {
    componentDidMount() {
        this.props.getPostAndComments(this.props.postId)
            .then((post) => {
                if (post.id)
                    this.props.getPostComments(post)
                        .then(() => {
                            this.props.sortComments(dispatchers.COMMENT_VOTE_SORT)
                        })
            })
    }


    //confirm delete and redirect to previous page
    fireConfirmation(post) {
        if (window.confirm("Are you sure you want to delete this post?")) {
            this.props.deletePost(post)
            this.props.history.goBack()
        }
    }

    //submit comment
    newSubmit = (e) => {
        const { comment } = this.props
        e.preventDefault()
        this.props.setSubmitting()
        const body = serializeForm(e.currentTarget, { hash: true })
        if (comment) this.props.editComment({ comment, body })
            .then(() => {
                this.props.cancelEditComment()
                this.props.setNotSubmitting()
                if (this.props.alert.type === "success")
                    this.props.getPostAndComments(this.props.postId)
                        .then(() => this.props.sortComments(dispatchers.COMMENT_CURRENT_SORT))
            })
        else this.props.doComment(body)
            .then(() => {
                this.props.cancelEditComment()
                this.props.setNotSubmitting()
                if (this.props.alert.type === "success")
                    this.props.getPostAndComments(this.props.postId)
                        .then(() => this.props.sortComments(dispatchers.COMMENT_CURRENT_SORT))
            })

    }


    render() {
        const { post, comment } = this.props
        if (post) {
            let timestamp = new Date(Number(post.timestamp))
            if (post.id) {
                return (
                    <div>
                        <div className='container'>
                            <div className="post-details">
                                <div className="post">
                                    <div className="post-left col-xs-2">
                                        <h1>{post.category && capitalize(post.category)}</h1>
                                        <p>{post.author}</p>
                                        <p>{timestamp.toLocaleDateString()}</p>
                                        <p>{timestamp.toLocaleTimeString()}</p>
                                    </div>
                                    <div className="panel panel-default post-right col-xs-9">
                                        <p className="panel-heading post-title">{post.title}</p>
                                        <textarea disabled className="post-body" value={post.body}></textarea>
                                    </div>
                                </div>
                                <div className="post-score"><p>Score:&nbsp; </p><p className={post.voteScore > 0 ? "green" : "red"}>{post.voteScore}</p>
                                </div>

                            </div>
                            <div className="button-group">
                                <Link
                                    to={`/${post.category}/${post.id}/edit_post`}
                                    className='edit-link icon-btn'
                                ><FaEdit size='40' /></Link>
                                <button
                                    onClick={() => this.fireConfirmation(post)}
                                    className='delete icon-btn'
                                ><FaMinusSquare size='40' /></button>
                                <button
                                    onClick={() => this.props.ratePost({ post, option: dispatchers.VOTEUP })}
                                    className=' icon-btn'
                                ><FaThumbsOUp size='40' /></button>
                                <button
                                    onClick={() => this.props.ratePost({ post, option: dispatchers.VOTEDOWN })}
                                    className=' icon-btn'
                                ><FaThumbsODown size='40' /></button>
                            </div>
                            {post.comments &&
                                <div className='comment-list'>
                                    <div className="sorting-container ">
                                        <p className="sorted-by">Sorted by: {post.sortBy === 1 ? "Date (oldest first)"
                                            : post.sortBy === -1 ? "Date (newest first)"
                                                : post.sortBy === 2 ? "Votes (lowest first)"
                                                    : "Votes (highest first)"
                                        }</p>
                                        <div className="sorting">
                                            <button className='clickable icon-btn' onClick={() => this.props.sortComments(dispatchers.COMMENT_DATE_SORT)}
                                            >Date
                                        {post.sortBy === -1 ? <FaSortAsc size='20' />
                                                    : <FaSortDesc size='20' />}
                                            </button>
                                            <button className='clickable icon-btn' onClick={() => this.props.sortComments(dispatchers.COMMENT_VOTE_SORT)}
                                            >Votes{post.sortBy === -2 ? <FaSortAsc size='20' />
                                                : <FaSortDesc size='20' />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="container">
                                        <h3><strong>Comments: {post.comments.length}</strong></h3>
                                        {post.comments.map((comment) =>
                                            <Comment key={comment.id} comment={comment} />
                                        )}
                                    </div>
                                </div>
                            }
                        </div>
                        <form name="commentform" onSubmit={this.newSubmit} >
                            <div className="title">{comment ? "Edit Comment" : "Add Comment"}</div>
                            <div className='create-post-details'>
                                {comment ?
                                    <div key={comment.id}>
                                        <input type='hidden' name='parentId' value={comment.parentId} />
                                        <input type='hidden' name='id' value={comment.id} />
                                        <input type='hidden' name='timestamp' value={comment.timestamp} />
                                        <textarea defaultValue={comment.body} ref={(input) => this.input = input} required name='body' placeholder='Body' type='text' />
                                        <input defaultValue={comment.author} ref={(input) => this.input = input} required name='author' placeholder='Author' type='text' />
                                    </div>
                                    : <div>
                                        <input type='hidden' name='parentId' value={post.id} />
                                        <input type='hidden' name='id' value={Math.random().toString(36).substr(-8)} />
                                        <input type='hidden' name='timestamp' value={Number(Date.now())} />
                                        <textarea className="body-field" required name='body' placeholder='Body' type='text' />
                                        <input className="input-field" required name='author' placeholder='Author' type='text' />
                                    </div>
                                }
                            </div>
                            <div className="edit-comment-buttons">
                                <button className=' submit icon-btn' title='Add/Edit Comment'>
                                    <FaArrowCircleORight size='50' />
                                </button>
                                {comment && <button id="cancel" onClick={() => this.props.cancelEditComment()} className=' icon-btn' title='Cancel Edit'>
                                    <FaBan size='50' />
                                </button>}
                            </div>
                        </form>

                    </div>
                )
            }
            else return (
                <div className="title"><h3>The page you requested does not exist or is no longer available.</h3></div>
            )
        }
        else return (
            <div className="title"><h3>Your page is being loaded, hit refresh if it takes too long.</h3></div>
        )
    }
}

function mapStateToProps({ post, comments, comment, alert }) {
    return {
        post,
        comments,
        comment,
        alert
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getPostAndComments: (data) => dispatch(dispatchers.getPostAndComments(data)),
        getPost: (data) => dispatch(dispatchers.getPost(data)),
        getPostComments: (data) => dispatch(dispatchers.getPostComments(data)),
        sortComments: (data) => dispatch(dispatchers.sortComments(data)),
        deletePost: (data) => dispatch(dispatchers.deletePost(data)),
        editPost: (data) => dispatch(dispatchers.editPost(data)),
        ratePost: (data) => dispatch(dispatchers.ratePost(data)),
        doComment: (data) => dispatch(dispatchers.doComment(data)),
        editComment: (data) => dispatch(dispatchers.editComment(data)),
        cancelEditComment: (data) => dispatch(dispatchers.cancelEditComment(data)),
        setSubmitting: (data) => dispatch(dispatchers.setSubmitting(data)),
        invalidateComments: (data) => dispatch(dispatchers.invalidateComments(data)),
        setNotSubmitting: (data) => dispatch(dispatchers.setNotSubmitting(data))
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PostDetails))