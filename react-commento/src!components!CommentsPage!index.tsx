import React, { useState, useEffect, useReducer } from 'react'
import { CommentDetails, UserDetails } from '../../interfaces'
import Comment from '../Comment'
import { useCommentoAuthContext } from '../CommentoAuthContext'
import { CommentPageContext } from './CommentPageContext'
import {
  fetchComments,
  sortCommentByCreationDate,
  CommentSortTypes
} from '../../utils/commentoApi'
import { AddNewCommnet } from './AddNewComment'
import { commentsReducer, CommentPageActions } from './CommentPageReducer'
import turndownService from '../../utils/turndown'
import cloneDeep from 'lodash.clonedeep'
import LoadingGif from '../../assets/loading.gif'
interface CommentPageProps {
  pageId: string
  allowOnlyOneRootComment?: boolean
}

const convertArrayToKeyValuePairs = (comments: CommentDetails[]) => {
  return comments.reduce((acc, comment) => {
    if (comment.deleted && !(comment.parentHex === 'root')) return acc
    acc[comment.commentHex] = comment
    return acc
  }, {})
}

const mergeRepliesToRootComments = (comments: {
  [key: string]: CommentDetails
}): { [key: string]: CommentDetails } => {
  console.log(comments)
  const reducedComments: {
    [key: string]: CommentDetails
  } = cloneDeep(comments)
  const KeyPaths = Object.keys(reducedComments).reduce((acc, key) => {
    acc[key] = []
    return acc
  }, {})
  Object.values(reducedComments).forEach(comment => {
    const isChild = comment.parentHex !== 'root'
    const isDeleted = comment.deleted
    if (isChild && !isDeleted) {
      const newKeyPath = [...KeyPaths[comment.parentHex], comment.parentHex]
      KeyPaths[comment.commentHex] = newKeyPath
      const entryPoint: CommentDetails = newKeyPath.reduce(
        (entryPoint, key) => {
          if (entryPoint[key]) return entryPoint[key]
          return entryPoint.replies[key]
        },
        reducedComments
      )
      if (!entryPoint.replies) entryPoint.replies = {}
      entryPoint.replies[comment.commentHex] = comment
      delete reducedComments[comment.commentHex]
    }
  })
  return reducedComments
}

const addMarkdownToComments = (comments: CommentDetails[]) =>
  comments.map(comment => {
    comment.markdown = turndownService.turndown(comment.html)
    return comment
  })

const removeDeletedCommentsWithNoReplies = (comments: CommentDetails[]) =>
  comments.filter(comment => !(comment.deleted && !comment.replies))

export const CommentsPage: React.FC<CommentPageProps> = ({
  pageId,
  allowOnlyOneRootComment
}) => {
  const [commentsLoaded, setCommentsLoaded] = useState<boolean>(false)
  const [comments, commentDispatch] = useReducer(commentsReducer, {})
  const [commenters, setCommentors] = useState<UserDetails[]>([])
  const {
    isAuthenticated,
    userDetails,
    isAuthenticating
  } = useCommentoAuthContext()
  const commentValues = sortCommentByCreationDate(
    CommentSortTypes.desc,
    removeDeletedCommentsWithNoReplies(
      Object.values(mergeRepliesToRootComments(comments))
    )
  )

  useEffect(() => {
    if (isAuthenticated) {
      const getComments = async () => {
        // get comments usins the commentoProvider
        const { comments, commenters } = await fetchComments(pageId)
        commentDispatch({
          type: CommentPageActions.COMMENTS_LOADED,
          payload: convertArrayToKeyValuePairs(addMarkdownToComments(comments))
        })
        setCommentors(commenters)
        setCommentsLoaded(true)
      }
      getComments()
    }
  }, [pageId, isAuthenticated])

  if (isAuthenticating) {
    return (
      <div className='comments-page'>
        <div className='commento-alert'>
          Authenticating the user{' '}
          <img src={LoadingGif} className='loading-gif' />
        </div>
      </div>
    )
  } else if (!isAuthenticated && !isAuthenticating) {
    return (
      <div className='comments-page'>
        <div className='commento-alert'>
          You are not authorized to access this comment stream
        </div>
      </div>
    )
  }

  return (
    // Pass dispatch for useReducer in the provider value so that CommentActions can dispatch action to modify a particular comment
    <CommentPageContext.Provider
      value={{
        pageId,
        currentCommenterDetails: userDetails,
        commenters,
        commentDispatch
      }}
    >
      <div className='comments-page'>
        <div className='commentHeader userdetails'>
          <img src={userDetails.photo} alt='User Image' className='avatar' />
          <div className='commentHeader_content'>
            <p className='username'>{userDetails.name}</p>
          </div>
        </div>
        {commentValues.length > 0 && allowOnlyOneRootComment ? null : (
          <AddNewCommnet pageId={pageId} />
        )}

        {commentsLoaded ? (
          <div className='commentslist-wrapper'>
            {commentValues.map(comment => (
              <Comment key={comment.commentHex} commentDetails={comment} />
            ))}
          </div>
        ) : (
          <div style={{ paddingTop: '1rem' }}>
            <div className='commento-alert'>
              Loading the comment stream{' '}
              <img src={LoadingGif} className='loading-gif' />
            </div>
          </div>
        )}
      </div>
    </CommentPageContext.Provider>
  )
}
