import { restrictToAdmins } from "@/lib/utils";
import DeathList from "@/app/(with-nav)/death/DeathList";

export default async function Death() {
  await restrictToAdmins();

  return <DeathList />;
}
