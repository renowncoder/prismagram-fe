import React, { useState } from 'react';
import AuthPresenter from './AuthPresenter';
import useInput from '../../Hooks/useInput';
import { useMutation } from 'react-apollo-hooks';
import { LOG_IN, CREATE_USER, CONFIRM_SECRET, _LOG_IN } from './AuthQueries';
import { toast } from 'react-toastify';

export default () => {
  const [action, setAction] = useState('logIn');
  const username = useInput('');
  const password = useInput('');
  const firstName = useInput('');
  const lastName = useInput('');
  const email = useInput('');
  const secret = useInput('');
  const [requestSecretMutation] = useMutation(LOG_IN, {
    variables: { email: email.value }
  });
  const [createUserMutation] = useMutation(CREATE_USER, {
    variables: {
      username: username.value,
      email: email.value,
      firstName: firstName.value,
      lastName: lastName.value
    }
  });
  const [confirmSecretMutation] = useMutation(CONFIRM_SECRET, {
    variables: {
      email: email.value,
      secret: secret.value
    }
  });
  const [localLogInMutation] = useMutation(_LOG_IN);

  const onSubmit = async e => {
    e.preventDefault();
    if (action === 'logIn') {
      if (email.value !== '') {
        try {
          const {
            data: { requestSecret }
          } = await requestSecretMutation();
          if (!requestSecret) {
            setTimeout(() => setAction('signUp'), 3000);
            toast.error("You didn't sign up yet. Create one.");
          } else {
            toast.success('We sent the login secret. Check your email.');
            setAction('confirm');
          }
        } catch (e) {
          toast.error(e.message);
        }
      } else {
        toast.error('email is required.');
      }
    } else if (action === 'signUp') {
      if (
        email.value !== '' &&
        username.value !== '' &&
        firstName.value !== '' &&
        lastName.value !== ''
      ) {
        try {
          const {
            data: { createUser }
          } = await createUserMutation();
          if (createUser) {
            toast.success('Created. Log In now!');
            setTimeout(() => setAction('logIn'), 3000);
          }
        } catch (e) {
          toast.error(e.message);
        }
      } else {
        toast.error('all fields are required.');
      }
    } else if (action === 'confirm') {
      try {
        const {
          data: { confirmSecret: token }
        } = await confirmSecretMutation();
        if (token) {
          try {
            console.log('1');
            await localLogInMutation({ variables: { token } });
            /** localLogInMutation을 통해서 isLoggedIn 로컬 변수 값을 변경 시 워닝 발생
             *
             * Can't perform a React state update on an unmounted component.
             * This is a no-op, but it indicates a memory leak in your application.
             * To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
             *
             */
            console.log('2');
            toast.success('log in successed');
          } catch (e) {
            toast.error(e.message);
          }
        } else {
          toast.error("Token doesn't exists.");
        }
      } catch (e) {
        toast.error(e.message);
      }
    }
  };

  return (
    <AuthPresenter
      onSubmit={onSubmit}
      action={action}
      setAction={setAction}
      username={username}
      password={password}
      firstName={firstName}
      lastName={lastName}
      email={email}
      secret={secret}
    />
  );
};
