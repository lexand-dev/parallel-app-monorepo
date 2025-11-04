import { redirect } from "next/navigation";

import { getSession } from "@/features/auth/get-session";
import { SignInCard } from "@/features/auth/components/sign-in-card";

const SignInPage = async () => {
  const auth = await getSession();

  if (auth) {
    redirect("/");
  }

  return <SignInCard />;
};

export default SignInPage;
