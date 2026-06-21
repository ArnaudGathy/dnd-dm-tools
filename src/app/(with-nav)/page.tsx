import { getSessionData } from "@/lib/utils";
import HomeLanding from "@/app/(with-nav)/home/HomeLanding";
import PlayerHome from "@/app/(with-nav)/home/PlayerHome";
import AdminHome from "@/app/(with-nav)/home/AdminHome";

export default async function Home() {
  const { isLoggedIn, isAdmin } = await getSessionData();

  if (!isLoggedIn) {
    return <HomeLanding />;
  }

  if (isAdmin) {
    return <AdminHome />;
  }

  return <PlayerHome />;
}
