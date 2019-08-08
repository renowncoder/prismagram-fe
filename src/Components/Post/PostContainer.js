import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PostPresenter from './PostPresenter';
import useInput from '../../Hooks/useInput';
import { TOGGLE_LIKE, CREATE_COMMENT } from './PostQueries';
import { useMutation } from 'react-apollo-hooks';
import { toast } from 'react-toastify';

const PostContainer = ({
  id,
  location,
  caption,
  user,
  likeCount,
  isLiked,
  files,
  comments,
  createdAt
}) => {
  const [isLikedS, setIsLiked] = useState(isLiked);
  const [likeCountS, setLikeCount] = useState(likeCount);
  const [currentItem, setCurrentItem] = useState(0);
  const [selfComments, setSelfComments] = useState([]);
  const comment = useInput('');
  const slide = () => {
    const totalLength = files.length;
    if (currentItem === totalLength - 1) {
      setTimeout(() => {
        setCurrentItem(0);
      }, 3000);
    } else {
      setTimeout(() => {
        setCurrentItem(currentItem + 1);
      }, 3000);
    }
  };

  useEffect(() => {
    slide();
  }, [currentItem]);

  const [toggleLikeMutation] = useMutation(TOGGLE_LIKE, {
    variables: { postId: id }
  });
  const toggleLike = () => {
    if (isLikedS === true) {
      setLikeCount(likeCountS - 1);
    } else {
      setLikeCount(likeCountS + 1);
    }
    setIsLiked(!isLikedS);
    toggleLikeMutation();
  };

  const [createCommentMutation] = useMutation(CREATE_COMMENT, {
    variables: { postId: id, text: comment.value }
  });
  const onKeyPress = async e => {
    const { which } = e;
    if (which === 13) {
      e.preventDefault();
      comment.setValue('');
      try {
        const {
          data: { createComment }
        } = await createCommentMutation();

        setSelfComments([...selfComments, createComment]);
      } catch (e) {
        toast.error(e.message);
      }
    }
  };

  return (
    <PostPresenter
      location={location}
      caption={caption}
      user={user}
      likeCount={likeCountS}
      isLiked={isLikedS}
      files={files}
      comments={comments}
      createdAt={createdAt}
      newComment={comment}
      setIsLiked={setIsLiked}
      setLikeCount={setLikeCount}
      currentItem={currentItem}
      toggleLike={toggleLike}
      onKeyPress={onKeyPress}
      selfComments={selfComments}
    />
  );
};

PostContainer.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired
  }).isRequired,
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ).isRequired,
  likeCount: PropTypes.number.isRequired,
  isLiked: PropTypes.bool.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  ),
  caption: PropTypes.string.isRequired,
  location: PropTypes.string,
  createdAt: PropTypes.string.isRequired
};

export default PostContainer;
