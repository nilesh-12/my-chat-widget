import React, { useMemo, useState, useCallback } from 'react'
import { CommentDetails } from '../../interfaces'
import { CommentActions } from './CommentActions'
import { CommentHeader } from './UserDetails'
import classnames from 'classnames'
import { EditComment } from './EditComment'
import { AddNewCommnet } from '../CommentsPage/AddNewComment'
import { useCommentPageContext } from '../CommentsPage/CommentPageContext'
import {
  sortCommentByCreationDate,
  CommentSortTypes
} from '../../utils/commentoApi'
interface CommentProps {
  commentDetails: CommentDetails
}

export const Comment: React.FC<CommentProps> = ({ commentDetails }) => {
  const {
    pageId,
    currentCommenterDetails,
    commenters
  } = useCommentPageContext()

  const [editModeOpen, setEditModeOpen] = useState<boolean>(false)
  const [replyMode, setReplyMode] = useState<boolean>(false)
  const [collapseChildren, setCollapseChildren] = useState<boolean>(false)
  const isOwnComment = useMemo<boolean>(() => {
    return commentDetails.commenterHex === currentCommenterDetails.commenterHex
  }, [currentCommenterDetails, commentDetails])

  const { replies, hasReplies } = useMemo<{
    replies: boolean | CommentDetails[]
    hasReplies: boolean
  }>(() => {
    const hasReplies =
      !!commentDetails.replies &&
      Object.values(commentDetails.replies).length > 0
    const replies =
      hasReplies &&
      sortCommentByCreationDate(
        CommentSortTypes.desc,
        Object.values(commentDetails.replies)
      )
    return { replies, hasReplies }
  }, [commentDetails.replies])

  const handleOnEditClick = useCallback(
    () => setEditModeOpen(prev => !prev),
    []
  )
  const handleOnCollapseClick = useCallback(
    () => setCollapseChildren(prev => !prev),
    []
  )
  const handleReplyClick = useCallback(() => setReplyMode(prev => !prev), [])
  return (
    <div className='comment-wrapper'>
      {/* Render the user details, comment and its actions */}
      <div className='commentBody'>
        <CommentHeader
          userData={
            isOwnComment
              ? currentCommenterDetails
              : commenters[commentDetails.commenterHex]
          }
          commentData={commentDetails}
        />
        {editModeOpen ? (
          <EditComment
            commentDetails={commentDetails}
            onEditSuccess={handleOnEditClick}
          />
        ) : (
          <div
            className='commentContainer'
            dangerouslySetInnerHTML={{ __html: commentDetails.html }}
          />
        )}
        <CommentActions
          commentHex={commentDetails.commentHex}
          onEditClick={handleOnEditClick}
          onCollapseClick={handleOnCollapseClick}
          isOwnComment={isOwnComment}
          onReplyClick={handleReplyClick}
          repliesCollapsed={collapseChildren}
        />
      </div>
      {replyMode && (
        <div className='repliesContianer'>
          <AddNewCommnet
            pageId={pageId}
            parentHex={commentDetails.commentHex}
            onSuccess={handleReplyClick}
          />
        </div>
      )}

      {hasReplies && (
        <div
          className={classnames('repliesContianer', {
            collapsed: collapseChildren
          })}
        >
          {(replies as CommentDetails[]).map((reply: CommentDetails) => (
            <Comment key={reply.commentHex} commentDetails={reply} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Comment
