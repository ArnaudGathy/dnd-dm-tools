import { getSessionData } from "@/lib/utils";
import Encounters from "@/app/encounters/page";
import Characters from "@/app/characters/page";
import Spells from "@/app/spells/page";

export default async function Home() {
  const { isAdmin, isLoggedIn } = await getSessionData();

  if (isAdmin) {
    return <Encounters />;
  }
  if (isLoggedIn) {
    return <Characters searchParams={Promise.resolve({})} />;
  }
  return <Spells searchParams={Promise.resolve({})} />;
}
