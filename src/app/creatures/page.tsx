import CreatureList from "@/app/creatures/CreatureList";
import { auth } from "@/../auth";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      <CreatureList isAuthorized={!!session} />
    </div>
  );
}
