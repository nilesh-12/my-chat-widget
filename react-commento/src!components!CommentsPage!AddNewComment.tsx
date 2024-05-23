import React, { useCallback, useState } from 'react'
import { addNewComment, addReplyToComment } from '../../utils/commentoApi'
import { useCommentPageContext } from './CommentPageContext'
import { CommentPageActions } from './CommentPageReducer'

interface AddNewCommentProps {
  pageId: string
  parentHex?: string
  onSuccess?: () => void
}

export const AddNewCommnet: React.FC<AddNewCommentProps> = ({
  pageId,
  parentHex,
  onSuccess
}) => {
  const [commentBody, setCommentBody] = useState<string>('')
  const { commentDispatch, currentCommenterDetails } = useCommentPageContext()
  const handleSubmit = useCallback(async () => {
    if (parentHex) {
      const { comment: newComment } = await addReplyToComment({
        commentMarkdown: commentBody,
        path: pageId,
        parentHex,
        commenterHex: currentCommenterDetails.commenterHex
      })
      commentDispatch({
        type: CommentPageActions.ADD_NEW_COMMENT,
        payload: newComment
      })
    } else {
      const { comment: newComment } = await addNewComment({
        commentMarkdown: commentBody,
        path: pageId,
        commenterHex: currentCommenterDetails.commenterHex
      })
      commentDispatch({
        type: CommentPageActions.ADD_NEW_COMMENT,
        payload: newComment
      })
    }
    setCommentBody('')
    onSuccess && onSuccess()
  }, [pageId, commentBody])

  const handleCommentBodyChange = (e: any) => {
    const newCommentBody = e.target.value
    setCommentBody(newCommentBody)
  }
  return (
    <div className='edit-comment-box'>
      <textarea
        value={commentBody}
        onChange={handleCommentBodyChange}
        placeholder='Add a new comment'
      />
      <button onClick={handleSubmit} className='commento-button'>
        Submit
      </button>
    </div>
  )
}
