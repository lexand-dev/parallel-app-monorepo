import { Loader } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { EditTaskForm } from "./edit-task-form";

import { useQuery } from "@urql/next";
import { GET_MEMBERS } from "@/features/members/graphql/queries";
import { GET_PROJECTS_QUERY } from "@/features/projects/graphql/queries";
import { GET_TASK_QUERY } from "../graphql/queries";
import { TaskFull } from "../schemas";

interface EditTaskFormWrapperProps {
  onCancel: () => void;
  id: string;
}

interface QueryResponseMembers {
  getMembers: {
    id: string;
    name: string;
  }[];
}

interface QueryResponseProjects {
  getProjects: {
    id: string;
    name: string;
    image: string;
  }[];
}

interface QueryResponseTask {
  getTask: TaskFull;
}

export const EditTaskFormWrapper = ({
  onCancel,
  id
}: EditTaskFormWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const [{ data: taskData, fetching: isLoadingTask }] =
    useQuery<QueryResponseTask>({
      query: GET_TASK_QUERY,
      variables: { id }
    });
  const [{ data: membersData, fetching: isLoadingMembers }] =
    useQuery<QueryResponseMembers>({
      query: GET_MEMBERS,
      variables: { workspaceId }
    });

  const [{ data: projectsData, fetching: isLoadingProjects }] =
    useQuery<QueryResponseProjects>({
      query: GET_PROJECTS_QUERY,
      variables: { workspaceId }
    });

  const memberOptions = membersData?.getMembers;
  const projectOptions = projectsData?.getProjects;
  const initialValues = taskData?.getTask;

  const isLoading = isLoadingProjects || isLoadingMembers || isLoadingTask;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!initialValues) {
    return null;
  }

  return (
    <EditTaskForm
      onCancel={onCancel}
      initialValues={initialValues}
      projectOptions={projectOptions ?? []}
      memberOptions={memberOptions ?? []}
    />
  );
};
