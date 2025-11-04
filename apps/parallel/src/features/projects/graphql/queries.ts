import { gql } from "urql";

export const GET_PROJECT_QUERY = gql`
  query GetProject($projectId: ID!) {
    getProject(projectId: $projectId) {
      id
      name
      image
      workspaceId
      __typename
    }
  }
`;

export const GET_PROJECTS_QUERY = gql`
  query GetProjects($workspaceId: ID!) {
    getProjects(workspaceId: $workspaceId) {
      id
      name
      image
      __typename
    }
  }
`;

export const GET_ANALYTICS_PROJECT_QUERY = gql`
  query GetAnalyticsProject($projectId: ID!) {
    getAnalyticsProject(projectId: $projectId) {
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
