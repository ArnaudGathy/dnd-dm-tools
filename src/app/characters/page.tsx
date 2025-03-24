import { getCharacters } from "@/lib/api/characters";

export default async function Characters() {
  const char = await getCharacters();
  // eslint-disable-next-line no-console
  console.log("char", char);

  return <div>Characters</div>;
}
