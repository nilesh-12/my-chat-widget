import { getAxiosInstance } from './axios'
import { CommentDetails, UserDetails } from '../interfaces'
import _axios from 'axios'
import turndownService from './turndown'

export const ssoAuth = async (
  commentoOrigin: string,
  ssoToken: string
): Promise<{
  commenterToken?: string
  success: boolean
  userDetails?: UserDetails
}> => {
  const { commenterToken, success: authenticationSucess } = await _axios
    .get(`${commentoOrigin}/api/oauth/sso`, {
      headers: {
        Authorization: `Bearer ${ssoToken}`
      }
    })
    .then(res => res.data)
  const {
    commenter,
    success: selfGetSuccess
  } = await _axios
    .post(`${commentoOrigin}/api/commenter/self`, { commenterToken })
    .then(res => res.data)
  if (authenticationSucess && selfGetSuccess)
    return { commenterToken, success: true, userDetails: commenter }
  return { success: false }
}

export const getSelfDetails = async (commenterToken: string) => {
  const { commenter, success } = await getAxiosInstance()
    .post('/api/commenter/self', {
      commenterToken
    })
    .then(res => res.data)
  if (success) return { commenter, success }
  return { success }
}

export const fetchComments = async (
  pageId: string
): Promise<{ comments: CommentDetails[]; commenters: UserDetails[] }> => {
  const axios = getAxiosInstance()
  const { comments, commenters } = await axios
    .post('/api/comment/list', {
      path: pageId,
      ...axios.defaults.data
    })
    .then(res => res.data)
  return { commenters, comments }
}

export const voteComment = async (direction: number, commentHex: string) => {
  const axios = getAxiosInstance()
  const { success } = await axios
    .post('/api/comment/vote', {
      commentHex,
      direction,
      ...axios.defaults.data
    })
    .then(res => res.data)
  return success
}

export const deleteComment = async (commentHex: string) => {
  const axios = getAxiosInstance()
  const { success } = await axios
    .post('/api/comment/delete', {
      commentHex,
      ...axios.defaults.data
    })
    .then(res => res.data)
  return success
}

export const updateComment = async (
  commentDetails: CommentDetails,
  newCommentBody: string
): Promise<{ comment?: CommentDetails; success: boolean }> => {
  const axios = getAxiosInstance()
  const { html, success } = await axios
    .post('/api/comment/edit', {
      markdown: newCommentBody,
      commentHex: commentDetails.commentHex,
      ...axios.defaults.data
    })
    .then(res => res.data)
  if (success)
    return {
      comment: {
        ...commentDetails,
        html,
        markdown: turndownService.turndown(html)
      },
      success
    }
  return { success }
}

export const addNewComment: (params: {
  commentMarkdown: string
  path: string
  commenterHex: string
}) => Promise<{ comment: CommentDetails; success: boolean }> = async ({
  commentMarkdown,
  path,
  commenterHex
}) => {
  const axios = getAxiosInstance()
  const { commentHex, success, html } = await axios
    .post('/api/comment/new', {
      markdown: commentMarkdown,
      path,
      parentHex: 'root',
      ...axios.defaults.data
    })
    .then(res => res.data)
  const comment: CommentDetails = createComment({
    commentHex,
    html,
    markdown: commentMarkdown,
    parentHex: 'root',
    commenterHex
  })
  return { comment, success }
}

export const addReplyToComment: (params: {
  commentMarkdown: string
  path: string
  parentHex: string
  commenterHex: string
}) => Promise<{ comment: CommentDetails; success: boolean }> = async ({
  commentMarkdown,
  parentHex,
  path,
  commenterHex
}) => {
  const axios = getAxiosInstance()
  const { commentHex, success, html } = await axios
    .post('/api/comment/new', {
      markdown: commentMarkdown,
      path,
      parentHex,
      ...axios.defaults.data
    })
    .then(res => res.data)

  const comment: CommentDetails = createComment({
    commentHex,
    html,
    markdown: commentMarkdown,
    parentHex,
    commenterHex
  })
  return { comment, success }
}

const createComment: (params: {
  parentHex: string
  commentHex: string
  commenterHex: string
  markdown: string
  html: string
}) => CommentDetails = ({
  commentHex,
  commenterHex,
  html,
  markdown,
  parentHex
}) => ({
  markdown,
  parentHex,
  commentHex,
  commenterHex,
  html,
  deleted: false,
  score: 0,
  direction: 0,
  replies: {},
  creationDate: new Date().toISOString()
})

export enum CommentSortTypes {
  asc = 'old comments first',
  desc = 'new comments first'
}
export const sortCommentByCreationDate = (
  type: CommentSortTypes,
  comments: CommentDetails[]
): CommentDetails[] =>
  comments.sort((a, b) => {
    const timeA = new Date(a.creationDate).getTime()
    const timeB = new Date(b.creationDate).getTime()
    if (type === CommentSortTypes.asc) return timeA - timeB
    else if (type === CommentSortTypes.desc) return timeB - timeA
    // Default to new comments first
    return timeB - timeA
  })
