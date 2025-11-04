import { redirect } from "next/navigation";

import { ProjectIdSettingsClient } from "./client";
import { getSession } from "@/features/auth/get-session";

const ProjectIdSettingsPage = async () => {
  const auth = await getSession();
  if (!auth?.session) redirect("/sign-in");

  return <ProjectIdSettingsClient />;
};

export default ProjectIdSettingsPage;
