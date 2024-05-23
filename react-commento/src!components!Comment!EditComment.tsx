import React, { useState, useCallback } from 'react'
import { updateComment } from '../../utils/commentoApi'
import { useCommentPageContext } from '../CommentsPage/CommentPageContext'
import { CommentPageActions } from '../CommentsPage/CommentPageReducer'
import { CommentDetails } from '../../interfaces'

interface EditCommentProps {
  commentDetails: CommentDetails
  onEditSuccess: () => void
}

export const EditComment: React.FC<EditCommentProps> = ({
  commentDetails,
  onEditSuccess
}) => {
  const [commentBody, setCommentBody] = useState<string>(
    commentDetails.markdown
  )
  const { commentDispatch } = useCommentPageContext()
  const handleSubmit = useCallback(async () => {
    const { comment } = await updateComment(commentDetails, commentBody)
    console.log('handleSubmit -> comment', comment)
    commentDispatch({
      payload: comment,
      type: CommentPageActions.UPDATE_COMMENT
    })
    onEditSuccess()
  }, [commentDetails, commentBody])

  const handleCommentBodyChange = (e: any) => {
    const newCommentBody = e.target.value
    console.log('handleCommentBodyChange -> newCommentBody', newCommentBody)
    setCommentBody(newCommentBody)
  }

  return (
    <div className='edit-comment-box'>
      <textarea
        value={commentBody}
        onChange={handleCommentBodyChange}
        style={{ marginTop: '1rem' }}
      />
      <button onClick={handleSubmit} className='commento-button'>
        submit
      </button>
    </div>
  )
}
