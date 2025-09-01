import { notFound } from "next/navigation";
import { SpellDescription } from "@/app/(with-nav)/spells/[id]/SpellDescription";
import { getSpellDetails } from "@/lib/external-apis/aidedd";

const SpellDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const spellId = (await params).id.toLowerCase();
  const spell = await getSpellDetails(spellId);

  if (!spell) {
    return notFound();
  }

  return <SpellDescription spell={spell} />;
};

export default SpellDetails;
