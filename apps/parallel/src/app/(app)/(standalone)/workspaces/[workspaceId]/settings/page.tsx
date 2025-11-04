import { redirect } from "next/navigation";

import { SettingsClient } from "./client";
import { getSession } from "@/features/auth/get-session";

const WorkspaceIdSettingPage = async () => {
  const auth = await getSession();
  if (!auth?.session) redirect("/sign-in");

  return <SettingsClient />;
};

export default WorkspaceIdSettingPage;
