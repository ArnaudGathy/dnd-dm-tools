import CreatureList from "@/app/creatures/CreatureList";
import { getSessionData } from "@/lib/utils";

export default async function Home() {
  const { isAdmin } = await getSessionData();

  return <CreatureList isAuthorized={isAdmin} />;
}
