import React, { useState, useEffect, ReactNode } from 'react'
import { useCommentoAuthContext } from '../CommentoAuthContext'
import { fetchComments } from '../../utils/commentoApi'

interface CommentsCountProps {
  pageId: string
  children: (
    commentsLength: number,
    commentsLoaded: Boolean,
    isAuthenticated: Boolean,
    isAuthenticating: Boolean
  ) => ReactNode
}

export const CommentsCount: React.FC<CommentsCountProps> = ({
  pageId,
  children
}) => {
  const [commentsLoaded, setCommentsLoaded] = useState<boolean>(false)
  const [commentsLength, setcommentsLength] = useState(0)
  const { isAuthenticated, isAuthenticating } = useCommentoAuthContext()
  useEffect(() => {
    if (isAuthenticated) {
      const getComments = async () => {
        // get comments usins the commentoProvider
        const { comments } = await fetchComments(pageId)
        setcommentsLength(comments.length)
        setCommentsLoaded(true)
      }
      getComments()
    }
  }, [pageId, isAuthenticated])

  return (
    <div>
      {children(
        commentsLength,
        commentsLoaded,
        isAuthenticated,
        isAuthenticating
      )}
    </div>
  )
}
