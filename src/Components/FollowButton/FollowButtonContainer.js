import React, { useState } from 'react';
import FollowButtonPresenter from './FollowButtonPresenter';
import { useMutation } from 'react-apollo-hooks';
import { FOLLOW, UNFOLLOW } from './FollowButtonQueries';

export default ({ isFollowing, id }) => {
  const [isFollowingS, setIsFollowing] = useState(isFollowing);
  const [followMutation] = useMutation(FOLLOW, { variables: { id } });
  const [unfollowMutation] = useMutation(UNFOLLOW, { variables: { id } });

  const onClick = e => {
    if (isFollowingS === true) {
      setIsFollowing(false);
      unfollowMutation();
    } else {
      setIsFollowing(true);
      followMutation();
    }
  };
  return <FollowButtonPresenter onClick={onClick} isFollowing={isFollowingS} />;
};
