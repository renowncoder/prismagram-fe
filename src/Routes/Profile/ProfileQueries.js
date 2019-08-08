import { gql } from 'apollo-boost';

export const GET_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      avatar
      username
      fullName
      isSelf
      bio
      followingCount
      followersCount
      postsCount
      posts {
        id
        files {
          url
        }
        likeCount
        commentCount
      }
    }
  }
`;

export const LOG_OUT = gql`
  mutation logUserOut {
    logUserOut @client
  }
`;
