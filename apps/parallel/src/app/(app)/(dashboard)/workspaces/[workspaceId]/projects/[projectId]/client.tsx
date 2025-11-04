"use client";

import Link from "next/link";
import { useQuery } from "@urql/next";
import { PencilIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";

import type { Project, AnalyticsResponse } from "@/features/projects/schemas";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import {
  GET_ANALYTICS_PROJECT_QUERY,
  GET_PROJECT_QUERY
} from "@/features/projects/graphql/queries";
import { Analytics } from "@/components/analytics";

interface QueryResponse {
  getProject: Project;
}

interface QueryAnalyticsResponse {
  getAnalyticsProject: AnalyticsResponse;
}

export const ProjectIdClient = () => {
  const projectId = useProjectId();
  const [{ data: projectData, fetching: isLoadingProject }] =
    useQuery<QueryResponse>({
      query: GET_PROJECT_QUERY,
      variables: { projectId },
      pause: !projectId,
      requestPolicy: "cache-and-network"
    });

  const [{ data: analyticsProject, fetching: isLoadingAnalytics }] =
    useQuery<QueryAnalyticsResponse>({
      query: GET_ANALYTICS_PROJECT_QUERY,
      variables: { projectId },
      pause: !projectId,
      requestPolicy: "cache-and-network"
    });

  const isLoading = isLoadingProject || isLoadingAnalytics;
  const project = projectData?.getProject;
  const analytics = analyticsProject?.getAnalyticsProject;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!project) {
    return <PageError message="Project not found" />;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.image}
            className="size-8"
          />
          <p className="text-lg font-semibold">{project.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${project.workspaceId}/projects/${project.id}/settings`}
            >
              <PencilIcon className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      {analytics ? <Analytics data={analytics} /> : null}
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};
