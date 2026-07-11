import CreateCharacterForm from "./CreateCharacterForm";
import { getSessionData } from "@/lib/utils";

export default async function AddCharacter({
  searchParams,
}: {
  searchParams: Promise<{ dryRun?: string }>;
}) {
  const { userMail } = await getSessionData();
  const { dryRun } = await searchParams;

  if (!userMail) {
    throw new Error("User should be logged in");
  }

  return <CreateCharacterForm owner={userMail} dryRun={dryRun === "1" || dryRun === "true"} />;
}
