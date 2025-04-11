import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as solidThumbsUp, faThumbsDown as solidThumbsDown } from '@fortawesome/free-solid-svg-icons';

const LikeDislikeButtons = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [isAnimatingLike, setIsAnimatingLike] = useState(false);
  const [isAnimatingDislike, setIsAnimatingDislike] = useState(false);

  const handleLike = () => {
    setIsAnimatingLike(true);
    
    if (isLiked) {
      setIsLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
      if (isDisliked) {
        setIsDisliked(false);
        setDislikeCount(prev => prev - 1);
      }
    }
    
    setTimeout(() => setIsAnimatingLike(false), 300);
  };

  const handleDislike = () => {
    setIsAnimatingDislike(true);
    
    if (isDisliked) {
      setIsDisliked(false);
      setDislikeCount(prev => prev - 1);
    } else {
      setIsDisliked(true);
      setDislikeCount(prev => prev + 1);
      if (isLiked) {
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
      }
    }
    
    setTimeout(() => setIsAnimatingDislike(false), 300);
  };

  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      alignItems: 'center'
    }}>
      <button
        onClick={handleLike}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          padding: '8px 12px',
          borderRadius: '20px',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isAnimatingLike ? 'scale(1.2)' : 'scale(1)',
          color: isLiked ? '#3b82f6' : '#64748b',
          filter: isLiked ? 'drop-shadow(0 2px 8px rgba(59, 130, 246, 0.3))' : 'none'
        }}
      >
        <FontAwesomeIcon 
          icon={isLiked ? solidThumbsUp : faThumbsUp} 
          style={{
            fontSize: '1.5rem',
            transition: 'all 0.2s ease',
            transform: isAnimatingLike ? 'rotate(-10deg)' : 'rotate(0)'
          }} 
        />
        <span style={{
          marginLeft: '8px',
          fontSize: '0.9rem',
          fontWeight: '600',
          color: isLiked ? '#3b82f6' : '#64748b'
        }}>
          {likeCount}
        </span>
      </button>
      
      <div style={{ width: '1px', height: '24px', background: '#e2e8f0' }}></div>
      
      <button
        onClick={handleDislike}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          padding: '8px 12px',
          borderRadius: '20px',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: isAnimatingDislike ? 'scale(1.2)' : 'scale(1)',
          color: isDisliked ? '#ef4444' : '#64748b',
          filter: isDisliked ? 'drop-shadow(0 2px 8px rgba(239, 68, 68, 0.3))' : 'none'
        }}
      >
        <FontAwesomeIcon 
          icon={isDisliked ? solidThumbsDown : faThumbsDown} 
          style={{
            fontSize: '1.5rem',
            transition: 'all 0.2s ease',
            transform: isAnimatingDislike ? 'rotate(10deg)' : 'rotate(0)'
          }} 
        />
        <span style={{
          marginLeft: '8px',
          fontSize: '0.9rem',
          fontWeight: '600',
          color: isDisliked ? '#ef4444' : '#64748b'
        }}>
          {dislikeCount}
        </span>
      </button>
    </div>
  );
};

export default LikeDislikeButtons;