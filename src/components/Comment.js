/*Comment component displays a comment's fields to be displayed in a list*/
import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as dispatchers from '../actions/types'
import * as commentActions from '../actions/CommentActions'
import FaEdit from 'react-icons/lib/fa/edit'
import FaMinusSquare from 'react-icons/lib/fa/minus-square'
import FaThumbsODown from 'react-icons/lib/fa/thumbs-o-down'
import FaThumbsOUp from 'react-icons/lib/fa/thumbs-o-up'


class Comment extends Component {
  fireConfirmation(comment) {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      this.props.deleteComment(comment)
    }
  }

  render() {
    const { comment } = this.props
    let timestamp = new Date(Number(comment.timestamp));
    return (
      <div className="comment">
        <div className='comment-details'>
          <textarea disabled className="post-body" value={comment.body}></textarea>
          <p>Comment by: {comment.author}</p>
          <p>{timestamp.toLocaleDateString()} {timestamp.toLocaleTimeString()}</p>
          <div className="comment-score"><p>Score:&nbsp; </p><p className={comment.voteScore > 0 ? "green" : "red"}>{comment.voteScore}</p>
          </div>
        </div>
        <div className="button-group">
          <button
            onClick={() => {
              this.props.getComment({ comment })
              window.scrollTo(0,document.body.scrollHeight);
              }}
            className=' icon-btn'
          ><FaEdit size='30' /></button>
          <button
            onClick={() => this.fireConfirmation(comment)}
            className='delete icon-btn'
          ><FaMinusSquare size='30' /></button>
          <button
            onClick={() => this.props.rateComment({ comment, option: dispatchers.VOTEUP })}
            className=' icon-btn'
          ><FaThumbsOUp size='30' /></button>
          <button
            onClick={() => this.props.rateComment({ comment, option: "downVote" })}
            className=' icon-btn'
          ><FaThumbsODown size='30' /></button>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ post, comments }) {
  return {
    post,
    comments
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getComment: (data) => dispatch(commentActions.getComment(data)),
    deleteComment: (data) => dispatch(commentActions.deleteComment(data)),
    editComment: (data) => dispatch(commentActions.editComment(data)),
    rateComment: (data) => dispatch(commentActions.rateComment(data)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
