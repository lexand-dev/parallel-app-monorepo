import { cookies } from "next/headers";

export const getSession = async () => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const session = cookieStore.has(process.env.AUTH_COOKIE!);

  if (!session) return null;
  return {
    cookieHeader,
    session
  };
};
