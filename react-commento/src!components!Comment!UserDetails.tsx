import React from 'react'
import { UserDetails, CommentDetails } from '../../interfaces'

interface CommentHeaderProps {
  userData: UserDetails
  commentData: CommentDetails
}

export const CommentHeader: React.FC<CommentHeaderProps> = ({
  userData,
  commentData
}) => {
  return (
    <div className='commentHeader'>
      {commentData.deleted && userData.photo ? (
        <div className='anonymous-image'>?</div>
      ) : (
        <img src={userData.photo} alt='User Image' className='avatar' />
      )}
      <div className='commentHeader_content'>
        <p className='username'>{userData.name}</p>
        <div className='commentStats'>
          <span className='votes'>{commentData.score} Likes</span> |{' '}
          <span className='date'>{commentData.creationDate}</span>
        </div>
      </div>
    </div>
  )
}
