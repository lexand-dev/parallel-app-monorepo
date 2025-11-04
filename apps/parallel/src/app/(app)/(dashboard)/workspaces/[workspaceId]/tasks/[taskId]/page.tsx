import { redirect } from "next/navigation";

import { TaskIdClient } from "./client";
import { getSession } from "@/features/auth/get-session";

const TaskIdPage = async () => {
  const auth = await getSession();
  if (!auth?.session) redirect("/sign-in");

  return <TaskIdClient />;
};

export default TaskIdPage;
