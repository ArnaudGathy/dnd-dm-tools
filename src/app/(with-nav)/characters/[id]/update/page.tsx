import { getValidCharacter } from "@/lib/utils";
import CreateCharacterForm from "../../add/CreateCharacterForm";

export default async function UpdateCharacter({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const character = await getValidCharacter(id);

  return <CreateCharacterForm character={character} />;
}
