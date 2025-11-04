import { redirect } from "next/navigation";
import { getSession } from "@/features/auth/get-session";
import { WorkspaceIdClient } from "./client";

const WorkspaceIdPage = async () => {
  const auth = await getSession();

  if (!auth?.session) {
    redirect("/sign-in");
  }
  return <WorkspaceIdClient />;
};

export default WorkspaceIdPage;
