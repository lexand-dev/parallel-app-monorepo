import { gql } from "urql";

export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $name: String!
    $workspaceId: ID!
    $image: ImageInput
  ) {
    createProject(name: $name, workspaceId: $workspaceId, image: $image) {
      id
      name
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $name: String!, $image: ImageInput) {
    updateProject(id: $id, name: $name, image: $image) {
      id
      name
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
    }
  }
`;
