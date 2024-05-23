import React, { useContext } from 'react'
import { UserDetails } from '../../interfaces'

interface CommentPageContextValues {
  pageId: string
  currentCommenterDetails: UserDetails
  commenters: UserDetails[]
  commentDispatch: React.Dispatch<{
    type: string
    payload: any
  }>
}

export const CommentPageContext = React.createContext<CommentPageContextValues>(
  {
    pageId: '',
    currentCommenterDetails: {} as UserDetails,
    commenters: [] as UserDetails[],
    commentDispatch: () => {}
  }
)
export const useCommentPageContext = () => useContext(CommentPageContext)
