import { notFound } from "next/navigation";
import { SpellDescription } from "@/app/spells/[id]/SpellDescription";
import { SpellOwnedBy } from "@/app/spells/[id]/SpellOwnedBy";
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

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <SpellDescription spell={spell} />
      <div className="hidden flex-col gap-4 md:flex">
        <SpellOwnedBy spell={spell} />
      </div>
    </div>
  );
};

export default SpellDetails;
