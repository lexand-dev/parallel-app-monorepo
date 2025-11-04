"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { GET_WORKSPACE_INFO } from "@/features/workspaces/graphql/queries";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useQuery } from "@urql/next";

interface QueryResponse {
  getWorkspaceInfo: {
    name: string;
  };
}

export const WorkspaceIdJoinClient = () => {
  const workspaceId = useWorkspaceId();

  const [{ data: initialValues, fetching: isLoading }] =
    useQuery<QueryResponse>({
      query: GET_WORKSPACE_INFO,
      variables: {
        id: workspaceId
      }
    });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!initialValues?.getWorkspaceInfo) {
    return <PageError message="Project not found" />;
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValues={initialValues.getWorkspaceInfo} />
    </div>
  );
};
