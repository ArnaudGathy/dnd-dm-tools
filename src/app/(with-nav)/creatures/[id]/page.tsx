import { getCreature } from "@/lib/external-apis/aidedd";
import { StatBlock } from "@/components/statblocks/StatBlock";

export default async function Creature({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const creature = await getCreature(id);

  return (
    <div>
      <StatBlock creature={creature} />
    </div>
  );
}
