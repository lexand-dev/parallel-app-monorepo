import { gql } from "urql";

export const CREATE_TASK_MUTATION = gql`
  mutation CreateTask(
    $name: String!
    $status: TaskStatus!
    $workspaceId: ID!
    $projectId: ID!
    $dueDate: String!
    $assigneeId: ID!
  ) {
    createTask(
      name: $name
      status: $status
      workspaceId: $workspaceId
      projectId: $projectId
      dueDate: $dueDate
      assigneeId: $assigneeId
    ) {
      id
      name
      status
    }
  }
`;

export const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask(
    $id: ID!
    $name: String
    $status: TaskStatus
    $dueDate: String
    $projectId: ID
    $assigneeId: ID
    $description: String
  ) {
    updateTask(
      id: $id
      name: $name
      status: $status
      dueDate: $dueDate
      projectId: $projectId
      assigneeId: $assigneeId
      description: $description
    ) {
      id
      name
      description
    }
  }
`;

export const DELETE_TASK_MUTATION = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
      name
    }
  }
`;

export const BULK_UPDATE_TASKS_MUTATION = gql`
  mutation BulkUpdateTasks($tasks: [BulkTask!]!) {
    bulkUpdateTasks(tasks: $tasks) {
      id
      name
      status
      position
    }
  }
`;
