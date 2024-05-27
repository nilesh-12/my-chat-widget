import React, { useCallback } from 'react'
import { useCommentPageContext } from '../CommentsPage/CommentPageContext'
import { voteComment, deleteComment } from '../../utils/commentoApi'
import { CommentPageActions } from '../CommentsPage/CommentPageReducer'

interface CommentActionsProps {
  commentHex: string
  onCollapseClick: () => void
  onEditClick: () => void
  isOwnComment: boolean
  onReplyClick: () => void
  repliesCollapsed: boolean
}

export const CommentActions: React.FC<CommentActionsProps> = ({
  commentHex,
  onCollapseClick,
  onEditClick,
  isOwnComment,
  onReplyClick,
  repliesCollapsed
}) => {
  const { commentDispatch } = useCommentPageContext()

  const upvoteComment = useCallback(async () => {
    await voteComment(1, commentHex)
    commentDispatch({
      type: CommentPageActions.UPVOTE_COMMENT,
      payload: {
        commentHex: commentHex
      }
    })
  }, [commentHex])

  const downvoteComment = useCallback(async () => {
    await voteComment(-1, commentHex)
    commentDispatch({
      type: CommentPageActions.DOWNVOTE_COMMENT,
      payload: {
        commentHex: commentHex
      }
    })
  }, [commentHex])

  const handleDeleteComment = useCallback(async () => {
    await deleteComment(commentHex)
    commentDispatch({
      type: CommentPageActions.DELETE_COMMENT,
      payload: {
        commentHex: commentHex
      }
    })
  }, [commentHex])

  return (
    <div className='commentActions'>
      {!isOwnComment && (
        <React.Fragment>
          <button onClick={onReplyClick} className='commento-button'>
            Reply
          </button>
          <button onClick={upvoteComment} className='commento-button'>
            Upvote
          </button>
          <button onClick={downvoteComment} className='commento-button'>
            Downvote
          </button>
        </React.Fragment>
      )}
      {isOwnComment && (
        <React.Fragment>
          <button onClick={onEditClick} className='commento-button'>
            Edit
          </button>
          <button onClick={handleDeleteComment} className='commento-button'>
            Delete
          </button>
        </React.Fragment>
      )}
      <button onClick={onCollapseClick} className='commento-button'>
        {repliesCollapsed ? 'Expand Replies' : 'Collapse Replies'}
      </button>
    </div>
  )
}
