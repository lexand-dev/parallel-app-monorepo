import { gql } from "urql";

export const GET_MEMBERS = gql`
  query GetMembers($workspaceId: ID!) {
    getMembers(workspaceId: $workspaceId) {
      id
      name
      role
      email
    }
  }
`;
