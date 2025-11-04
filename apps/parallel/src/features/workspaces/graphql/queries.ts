import { gql } from "urql";

export const GET_WORKSPACES_QUERY = gql`
  query getWorkspaces {
    getWorkspaces {
      id
      name
      image
      __typename
    }
  }
`;

export const GET_WORKSPACE_QUERY = gql`
  query getWorkspace($id: ID!) {
    getWorkspace(id: $id) {
      id
      name
      image
      userId
      inviteCode
      members {
        id
        name
        role
        email
      }
      __typename
    }
  }
`;

export const GET_WORKSPACE_INFO = gql`
  query getWorkspaceInfo($id: ID!) {
    getWorkspaceInfo(id: $id) {
      name
      __typename
    }
  }
`;

export const GET_ANALYTICS_WORKSPACE_QUERY = gql`
  query GetAnalyticsWorkspace($workspaceId: ID!) {
    getAnalyticsWorkspace(workspaceId: $workspaceId) {
      taskCount
      taskDifference
      assignedTaskCount
      assignedTaskDifference
      completedTaskCount
      completedTaskDifference
      incompleteTaskCount
      incompleteTaskDifference
      overdueTaskCount
      overdueTaskDifference
    }
  }
`;
