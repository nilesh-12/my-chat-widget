import { CommentDetails } from '../../../interfaces'
import produce from 'immer'
import { CommentPageActions } from './actions'

export const commentsReducer = (
  comments: { [key: string]: CommentDetails },
  action: { type: CommentPageActions; payload: any }
): { [key: string]: CommentDetails } => {
  console.log('reducer', comments, action)
  switch (action.type) {
    case CommentPageActions.COMMENTS_LOADED:
      return { ...action.payload }
    case CommentPageActions.UPVOTE_COMMENT:
      return produce(comments, draftComments => {
        draftComments[action.payload.commentHex].score += 1
      })
    case CommentPageActions.DOWNVOTE_COMMENT:
      return produce(comments, draftComments => {
        draftComments[action.payload.commentHex].score -= 1
      })
    case CommentPageActions.ADD_NEW_COMMENT:
      return produce(comments, draftComments => {
        draftComments[action.payload.commentHex] = action.payload
      })
    case CommentPageActions.UPDATE_COMMENT: {
      return produce(comments, draftComments => {
        draftComments[action.payload.commentHex] = action.payload
      })
    }
    case CommentPageActions.DELETE_COMMENT: {
      return produce(comments, draftComments => {
        delete draftComments[action.payload.commentHex]
      })
    }
    default:
      return comments
  }
}
