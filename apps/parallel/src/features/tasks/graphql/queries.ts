import { gql } from "urql";

export const GET_TASKS_QUERY = gql`
  query GetTasks(
    $workspaceId: ID!
    $projectId: ID
    $assigneeId: ID
    $status: TaskStatus
    $search: String
    $dueDate: String
  ) {
    getTasks(
      workspaceId: $workspaceId
      projectId: $projectId
      assigneeId: $assigneeId
      status: $status
      search: $search
      dueDate: $dueDate
    ) {
      id
      name
      status
      dueDate
      workspaceId
      projectId
      assigneeId
      position
      description
      assignee {
        name
      }
      project {
        name
        image
      }
    }
  }
`;

export const GET_TASK_QUERY = gql`
  query GetTask($id: ID!) {
    getTask(id: $id) {
      id
      name
      dueDate
      status
      assigneeId
      projectId
      description
      assignee {
        name
      }
      project {
        id
        name
        image
      }
    }
  }
`;
