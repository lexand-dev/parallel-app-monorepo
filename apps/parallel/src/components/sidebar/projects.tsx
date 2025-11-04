"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@urql/next";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

import { cn } from "@/lib/utils";

import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";

import type { Project } from "@/features/projects/schemas";
import { GET_PROJECTS_QUERY } from "@/features/projects/graphql/queries";

interface QueryResponse {
  getProjects: Project[];
}

export const Projects = () => {
  const pathname = usePathname();
  const { open } = useCreateProjectModal();
  const workspaceId = useWorkspaceId();
  const [{ fetching: isPending, data }] = useQuery<QueryResponse>({
    query: GET_PROJECTS_QUERY,
    variables: { workspaceId },
    requestPolicy: "cache-and-network",
    context: useMemo(
      () => ({
        additionalTypenames: ["Project"]
      }),
      []
    )
  });

  if (isPending) {
    return <p className="text-xs text-neutral-500">Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Projects</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      {data?.getProjects.map((project) => {
        const href = `/workspaces/${workspaceId}/projects/${project.id}`;
        const isActive = pathname === href;

        return (
          <Link href={href} key={project.id}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <ProjectAvatar image={project.image} name={project.name} />
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
