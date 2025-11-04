import { gql } from "urql";

export const CREATE_WORKSPACE = gql`
  mutation CreateWorkspace($name: String!, $image: ImageInput) {
    createWorkspace(name: $name, image: $image) {
      id
      name
      image
      userId
      inviteCode
    }
  }
`;

export const UPDATE_WORKSPACE = gql`
  mutation UpdateWorkspace($id: ID!, $name: String!, $image: ImageInput) {
    updateWorkspace(id: $id, name: $name, image: $image) {
      id
      name
      image
      userId
      inviteCode
    }
  }
`;

export const DELETE_WORKSPACE = gql`
  mutation DeleteWorkspace($id: ID!) {
    deleteWorkspace(id: $id) {
      message
      success
    }
  }
`;

export const RESET_INVITE_CODE = gql`
  mutation ResetInviteCode($id: ID!) {
    resetInviteCode(id: $id) {
      id
      name
      image
      userId
      inviteCode
    }
  }
`;

export const JOIN_WORKSPACE = gql`
  mutation JoinWorkspace($inviteCode: String!, $workspaceId: ID!) {
    joinWorkspace(inviteCode: $inviteCode, workspaceId: $workspaceId) {
      id
      name
      image
      userId
      inviteCode
    }
  }
`;
