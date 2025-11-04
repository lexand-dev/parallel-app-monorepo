import { redirect } from "next/navigation";

import { ProjectIdClient } from "./client";
import { getSession } from "@/features/auth/get-session";

const ProjectIdPage = async () => {
  const auth = await getSession();
  if (!auth?.session) redirect("/sign-in");

  return <ProjectIdClient />;
};

export default ProjectIdPage;
