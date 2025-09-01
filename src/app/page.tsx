import { getSessionData } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function Home() {
  const { isAdmin, isLoggedIn } = await getSessionData();

  if (isAdmin) {
    redirect("/encounters");
  }

  if (isLoggedIn) {
    redirect("/characters");
  }

  redirect("/landing");
}
