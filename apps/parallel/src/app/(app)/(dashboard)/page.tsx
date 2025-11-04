import { redirect } from "next/navigation";

import { registerUrql } from "@urql/next/rsc";
import { cacheExchange, createClient, fetchExchange } from "urql";
import { getSession } from "@/features/auth/get-session";
import { Workspace } from "@/features/workspaces/schemas";
import { GET_WORKSPACES_QUERY } from "@/features/workspaces/graphql/queries";

interface QueryResponse {
  getWorkspaces: Workspace[];
}

export default async function Home() {
  const auth = await getSession();

  const makeClient = () => {
    return createClient({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/graphql`,
      exchanges: [cacheExchange, fetchExchange],
      fetchOptions: {
        credentials: "include",
        headers: {
          cookie: auth?.cookieHeader!
        }
      }
    });
  };

  const { getClient } = registerUrql(makeClient);

  if (!auth?.session) {
    redirect("/sign-in");
  }

  const { data } = await getClient().query<QueryResponse>(
    GET_WORKSPACES_QUERY,
    {}
  );

  if (!data?.getWorkspaces) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspaces/${data.getWorkspaces[0].id}`);
  }
}
