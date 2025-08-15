import CreateCharacterForm from "./CreateCharacterForm";
import { getSessionData } from "@/lib/utils";

export default async function AddCharacter() {
  const { userMail } = await getSessionData();

  if (!userMail) {
    throw new Error("User should be logged in");
  }

  return <CreateCharacterForm owner={userMail} />;
}
