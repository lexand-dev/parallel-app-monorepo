import { redirect } from "next/navigation";

import { getSession } from "@/features/auth/get-session";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";

const TasksPage = async () => {
  const auth = await getSession();
  if (!auth?.session) redirect("/sign-in");

  return (
    <div className="h-full flex flex-col">
      <TaskViewSwitcher />
    </div>
  );
};

export default TasksPage;
