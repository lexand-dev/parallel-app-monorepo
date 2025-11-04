import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRightIcon, TrashIcon } from "lucide-react";

import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";

import { TaskFull } from "../schemas";
import { useMutation } from "@urql/next";
import { DELETE_TASK_MUTATION } from "../graphql/mutations";
import { toast } from "sonner";

interface TaskBreadcrumbsProps {
  project: TaskFull["project"];
  task: TaskFull;
}

export const TaskBreadcrumbs = ({ project, task }: TaskBreadcrumbsProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const [{ fetching: isPending }, deleteTask] =
    useMutation(DELETE_TASK_MUTATION);

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete task",
    "This action cannot be undone."
  );

  const handleDeleteTask = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteTask({ id: task.id }).then((result) => {
      if (result.error) {
        toast.error("Failed to delete task");
        return;
      }
      toast.success("Task deleted successfully");
      router.push(`/workspaces/${workspaceId}/projects/${project.id}`);
    });
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />
      <ProjectAvatar
        name={project.name}
        image={project.image}
        className="size-6 lg:size-8"
      />
      <Link href={`/workspaces/${workspaceId}/projects/${project.id}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project.name}
        </p>
      </Link>
      <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
      <Button
        onClick={handleDeleteTask}
        disabled={isPending}
        className="ml-auto"
        variant="destructive"
        size="sm"
      >
        <TrashIcon className="size-4 lg:mr-2" />
        <span className="hidden lg:block">Delete Task</span>
      </Button>
    </div>
  );
};
