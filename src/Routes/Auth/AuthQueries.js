import { gql } from 'apollo-boost';

export const LOG_IN = gql`
  mutation requestSecret($email: String!) {
    requestSecret(email: $email)
  }
`;

export const CREATE_USER = gql`
  mutation createUser(
    $username: String!
    $email: String!
    $firstName: String
    $lastName: String
    $bio: String
  ) {
    createUser(
      username: $username
      email: $email
      firstName: $firstName
      lastName: $lastName
      bio: $bio
    )
  }
`;

export const CONFIRM_SECRET = gql`
  mutation confirmSecret($email: String!, $secret: String!) {
    confirmSecret(email: $email, loginSecret: $secret)
  }
`;

export const _LOG_IN = gql`
  mutation logUserIn($token: String!) {
    logUserIn(token: $token) @client
  }
`;
