import { redirect } from "next/navigation";

// The landing/sign-in screen now lives on the homepage ("/"). Keep this route as a
// permanent redirect so any old link or bookmark resolves to the single entry point.
export default async function Landing() {
  redirect("/");
}
