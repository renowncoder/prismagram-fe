import React from 'react';
import ProfilePresenter from './ProfilePresenter';
import { useQuery, useMutation } from 'react-apollo-hooks';
import { withRouter } from 'react-router-dom';
import { GET_USER, LOG_OUT } from './ProfileQueries';

export default withRouter(({ match: { params: { username } } }) => {
  const { loading, data } = useQuery(GET_USER, { variables: { username } });
  const [logUserOutMutation] = useMutation(LOG_OUT);

  // if (data) console.log(data);
  return (
    <ProfilePresenter
      loading={loading}
      data={data}
      logOut={logUserOutMutation}
    />
  );
});
