import { restrictToAdmins } from "@/lib/utils";
import { getUnassignedMagicItems } from "@/lib/api/magicItems";
import { BookOpenText, HeartPulse } from "lucide-react";
import DmToolLinkCard from "@/app/(with-nav)/dm-tools/DmToolLinkCard";
import DmToolsTabs from "@/app/(with-nav)/dm-tools/DmToolsTabs";

const DmToolsPage = async () => {
  await restrictToAdmins();

  const magicItems = await getUnassignedMagicItems();

  return (
    <div className="mx-auto mt-4 flex w-full max-w-5xl flex-col gap-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Outils du MJ</h1>
        <p className="text-muted-foreground">
          Accès rapide aux écrans de jeu et aux outils de gestion réservés au MJ.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Gestion
        </h2>
        <DmToolsTabs magicItems={magicItems} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Écrans de jeu
        </h2>
        <div className="sm:grid-cols-2 grid grid-cols-1 gap-4">
          <DmToolLinkCard
            to="/tracker/character"
            label="Suivi de combat"
            description="Suivi des points de vie des personnages en temps réel."
            icon={HeartPulse}
            openInNewTab
          />
          <DmToolLinkCard
            to="/dm-screen"
            label="DM Screen"
            description="Écran du MJ : stats des personnages, conditions et références."
            icon={BookOpenText}
            openInNewTab
          />
        </div>
      </section>
    </div>
  );
};

export default DmToolsPage;
