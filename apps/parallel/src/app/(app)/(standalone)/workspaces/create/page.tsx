import { redirect } from "next/navigation";

import { getSession } from "@/features/auth/get-session";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";

const WorkspaceCreatePage = async () => {
  const auth = await getSession();
  if (!auth?.session) redirect("/sign-in");

  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  );
};

export default WorkspaceCreatePage;
