"use client";

import { useTaskId } from "@/features/tasks/hooks/use-task-id";
import { TaskOverview } from "@/features/tasks/components/task-overview";
import { TaskBreadcrumbs } from "@/features/tasks/components/task-breadcrumbs";
import { TaskDescription } from "@/features/tasks/components/task-description";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { DottedSeparator } from "@/components/dotted-separator";
import { useQuery } from "@urql/next";
import { GET_TASK_QUERY } from "@/features/tasks/graphql/queries";
import { TaskFull } from "@/features/tasks/schemas";

interface TaskQueryResponse {
  getTask: TaskFull;
}

export const TaskIdClient = () => {
  const taskId = useTaskId();
  const [{ data, fetching: isLoading }] = useQuery<TaskQueryResponse>({
    query: GET_TASK_QUERY,
    variables: { id: taskId },
    requestPolicy: "cache-and-network"
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data?.getTask) {
    return <PageError message="Task not found" />;
  }

  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs project={data.getTask.project} task={data.getTask} />
      <DottedSeparator className="my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={data.getTask} />
        <TaskDescription task={data.getTask} />
      </div>
    </div>
  );
};
