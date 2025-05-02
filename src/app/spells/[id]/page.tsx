import { notFound } from "next/navigation";
import { SpellDescription } from "@/app/spells/[id]/SpellDescription";
import { SpellOwnedBy } from "@/app/spells/[id]/SpellOwnedBy";
import { SpellClasses } from "@/app/spells/[id]/SpellClasses";
import { getSpell } from "@/lib/external-apis/externalAPIs";
import { SpellVersion } from "@prisma/client";

const SpellDetails = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ v?: string }>;
}) => {
  const spellVersion = ((await searchParams).v ??
    SpellVersion.V2014) as SpellVersion;
  const spellId = (await params).id.toLowerCase();
  const spell = await getSpell(spellId, spellVersion);

  if (!spell) {
    return notFound();
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <SpellDescription spell={spell} />
      <div className="hidden flex-col gap-4 md:flex">
        <SpellOwnedBy spell={spell} />
        <SpellClasses spell={spell} />
      </div>
    </div>
  );
};

export default SpellDetails;
