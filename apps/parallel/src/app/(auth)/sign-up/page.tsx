import { redirect } from "next/navigation";

import { getSession } from "@/features/auth/get-session";
import { SignUpCard } from "@/features/auth/components/sign-up-card";

const SignUpPage = async () => {
  const auth = await getSession();

  if (auth) {
    redirect("/");
  }

  return <SignUpCard />;
};

export default SignUpPage;
