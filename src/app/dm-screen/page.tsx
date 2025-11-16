import { getDMScreenCharactersFromCampaignId } from "@/lib/api/characters";
import CharacterStatsTable from "@/app/dm-screen/CharacterStatsTable";
import SpecialAttacks from "@/app/dm-screen/SpecialAttacks";
import MagicSchools from "@/app/dm-screen/MagicSchools";
import DeathSavingThrows from "@/app/dm-screen/DeathSavingThrows";
import Misc from "@/app/dm-screen/Misc";
import Conditions from "@/app/dm-screen/Conditions";

export default async function DmScreen() {
  const characters = await getDMScreenCharactersFromCampaignId();

  return (
    <body className="bg-white text-sm text-black">
      <main className="h-[10.95in] w-[7.28in] border border-black px-[0.4in]">
        <div id="dm-screen" className="flex max-h-full w-full flex-col gap-4 overflow-hidden">
          <div className="flex gap-4">
            <CharacterStatsTable characters={characters} />
            <div>
              <DeathSavingThrows />
            </div>
            <div className="flex-1">
              <Misc />
            </div>
          </div>

          <Conditions />

          <MagicSchools />

          <SpecialAttacks />
        </div>
      </main>
    </body>
  );
}
