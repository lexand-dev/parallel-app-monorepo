"use client";

import { useQuery } from "@urql/next";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";

import { Workspace } from "@/features/workspaces/schemas";
import { GET_WORKSPACE_QUERY } from "@/features/workspaces/graphql/queries";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";

interface QueryResponse {
  getWorkspace: Workspace;
}

export const SettingsClient = () => {
  const workspaceId = useWorkspaceId();
  const [{ data, fetching: isLoading }] = useQuery<QueryResponse>({
    query: GET_WORKSPACE_QUERY,
    variables: { id: workspaceId }
  });

  const initialValues = data?.getWorkspace;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!initialValues) {
    return <PageError message="Project not found" />;
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={initialValues} />
    </div>
  );
};
