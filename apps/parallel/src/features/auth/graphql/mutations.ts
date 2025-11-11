import { gql } from "urql";

export const SING_UP_MUTATION = gql`
  mutation SignUp($input: SignUpInput!) {
    signup(input: $input) {
      message
      success
    }
  }
`;

export const SING_IN_MUTATION = gql`
  mutation SignIn($input: SignInInput!) {
    signin(input: $input) {
      success
      message
    }
  }
`;

export const ANONYMOUS_SIGNIN_MUTATION = gql`
  mutation AnonymousSignin {
    anonymousSignin {
      success
      message
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      message
      success
    }
  }
`;

export const CURRENT_USER = gql`
  query Query {
    current {
      name
      email
    }
  }
`;
