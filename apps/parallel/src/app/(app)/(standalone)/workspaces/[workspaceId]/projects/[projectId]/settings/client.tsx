"use client";

import { useQuery } from "@urql/next";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";

import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";

import type { Project } from "@/features/projects/schemas";
import { GET_PROJECT_QUERY } from "@/features/projects/graphql/queries";

interface QueryResponse {
  getProject: Project;
}

export const ProjectIdSettingsClient = () => {
  const projectId = useProjectId();
  const [{ data, fetching }] = useQuery<QueryResponse>({
    query: GET_PROJECT_QUERY,
    variables: { projectId },
    pause: !projectId
  });

  const isLoading = fetching;
  const initialValues = data?.getProject;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!initialValues) {
    return <PageError message="Project not found" />;
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  );
};
