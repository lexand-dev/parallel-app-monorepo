import { redirect } from "next/navigation";

import { getSession } from "@/features/auth/get-session";
import { MembersList } from "@/features/workspaces/components/member-list";

const WorkspaceIdMembersPage = async () => {
  const auth = await getSession();
  if (!auth?.session) redirect("/sign-in");

  return (
    <div className="w-full lg:max-w-xl">
      <MembersList />
    </div>
  );
};

export default WorkspaceIdMembersPage;
