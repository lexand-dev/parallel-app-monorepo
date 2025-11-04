import { redirect } from "next/navigation";

import { WorkspaceIdJoinClient } from "./client";
import { getSession } from "@/features/auth/get-session";

const WorkspaceIdJoinPage = async () => {
  const auth = await getSession();
  if (!auth?.session) redirect("/sign-in");

  return <WorkspaceIdJoinClient />;
};

export default WorkspaceIdJoinPage;
