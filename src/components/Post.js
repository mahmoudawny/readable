/*Post component displays a post's fields to be displayed in a list of posts*/
import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as dispatchers from '../actions/types'
import * as postActions from '../actions/PostActions'
import { Link } from 'react-router-dom'
import FaEdit from 'react-icons/lib/fa/edit'
import FaMinusSquare from 'react-icons/lib/fa/minus-square'
import FaThumbsODown from 'react-icons/lib/fa/thumbs-o-down'
import FaThumbsOUp from 'react-icons/lib/fa/thumbs-o-up'

class Post extends Component {

    //confirm delete
    fireConfirmation(post) {
        if (window.confirm("Are you sure you want to delete this post?")) {
            this.props.deletePost(post)
        }
    }

    render() {
        const { post, category, comments } = this.props
        //get current post's comments to show its count
        let postComments = comments.items.filter((comment) => comment.parentId === post.id)
        let timestamp = new Date(Number(post.timestamp));
        return (
            <div>
                <div className='post-details'>
                    <Link style={{textDecoration: 'none' }}
                        to={`/${post.category}/${post.id}`}
                        className='icon-btn'>
                        <div className="post">
                            <div className="post-left col-xs-2">
                                <p>By: {post.author}</p>
                                {!category &&
                                    <div className="field">
                                        <p className="right">{post.category}</p></div>}
                                <p>{timestamp.toLocaleDateString()}</p>
                                <p>{timestamp.toLocaleTimeString()}</p>
                            </div>
                            <div className="panel panel-default post-right col-xs-9">
                                <p className="panel-heading post-title">{post.title}</p>
                                <textarea disabled className="post-body" value={post.body}></textarea>
                            </div>
                        </div>

                        <div className="counts">
                            <p className="post-counter">Score: {post.voteScore}</p>
                            {postComments && <p className="post-counter">Comments: {postComments.length}</p>}
                        </div>
                    </Link>
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
                <div className="separator"> <pre /></div>
            </div>
        )
    }
}

function mapStateToProps({ comments, category }) {
    return {
        comments,
        category
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deletePost: (data) => dispatch(postActions.deletePost(data)),
        editPost: (data) => dispatch(postActions.editPost(data)),
        ratePost: (data) => dispatch(postActions.ratePost(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Post);