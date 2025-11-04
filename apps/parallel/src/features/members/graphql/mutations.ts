import { gql } from "urql";

export const UPDATE_MEMBER_ROLE = gql`
  mutation updateRole($memberId: ID!, $role: MemberRole!, $workspaceId: ID!) {
    updateRole(memberId: $memberId, role: $role, workspaceId: $workspaceId) {
      message
      success
    }
  }
`;

export const DELETE_MEMBER = gql`
  mutation removeMember($memberId: ID!, $workspaceId: ID!) {
    removeMember(memberId: $memberId, workspaceId: $workspaceId) {
      message
      success
    }
  }
`;
