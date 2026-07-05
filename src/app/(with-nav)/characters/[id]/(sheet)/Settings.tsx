"use client";

import { CharacterById, cn } from "@/lib/utils";
import { SectionPanel, StatLine } from "@/app/(with-nav)/characters/[id]/(sheet)/sheetUI";
import { CAMPAIGN_MAP, CHARACTER_STATUS_MAP, PARTY_MAP } from "@/constants/maps";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Flag, Info, RefreshCcw, Trash, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import ToggleConfirmDialog from "@/components/ui/ToggleConfirmDialog";
import { deleteCharacter } from "@/lib/actions/characters";
import { CharacterStatus } from "@prisma/client";
import { ReactNode } from "react";

const formatDate = (date: Date) =>
  Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);

/** Status is the one semantic value on this tab — it gets a colored state dot. */
const STATUS_DOT: Record<CharacterStatus, string> = {
  [CharacterStatus.ACTIVE]: "bg-emerald-500",
  [CharacterStatus.DEAD]: "bg-red-500",
  [CharacterStatus.RETIRED]: "bg-slate-500",
  [CharacterStatus.BACKUP]: "bg-amber-500",
};

function MetaLine({ label, value }: { label: string; value: ReactNode }) {
  return (
    <StatLine
      label={<span className="truncate text-sm text-muted-foreground">{label}</span>}
      value={value}
      valueClassName="text-sm font-semibold"
    />
  );
}

/** One entry of the danger zone: what the action does on the left, its button on the right. */
function DangerAction({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-3 py-3 md:flex-row md:items-center">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <span className="text-sm leading-snug text-muted-foreground">{description}</span>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function Settings({ character }: { character: CharacterById }) {
  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-4 p-0 md:p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
        <SectionPanel accent="slate" icon={Info} title="Informations">
          <MetaLine
            label="État"
            value={
              <span className="flex items-center justify-end gap-2">
                <span
                  className={cn("size-2 shrink-0 rounded-full", STATUS_DOT[character.status])}
                />
                {CHARACTER_STATUS_MAP[character.status]}
              </span>
            }
          />
          <MetaLine label="Propriétaire" value={character.owner} />
          <MetaLine label="Création" value={formatDate(character.createdAt)} />
          <MetaLine label="Modification" value={formatDate(character.updatedAt)} />
          <Link href={`/characters/${character.id}/update`} className="mt-3">
            <Button variant="outline" className="w-full">
              <Edit /> Modifier le personnage
            </Button>
          </Link>
        </SectionPanel>

        <SectionPanel accent="violet" icon={Flag} title="Campagne">
          <MetaLine label="Campagne" value={CAMPAIGN_MAP[character.campaign.name]} />
          <MetaLine label="DM de la campagne" value={character.campaign.owner.join(", ")} />
          <MetaLine label="Groupe" value={PARTY_MAP[character.campaign.party.name]} />
        </SectionPanel>
      </div>

      <SectionPanel
        accent="red"
        icon={TriangleAlert}
        title="Zone dangereuse"
        contentClassName="gap-0 divide-y divide-border px-4 py-1"
      >
        <DangerAction
          title="Vider le cache"
          description="Réinitialise les ressources et les emplacements de sorts stockés sur cet appareil."
        >
          <Button
            variant="outline"
            onClick={() => {
              localStorage.clear();
              toast("Les ressources et les emplacements de sorts ont été réinitialisés.");
            }}
          >
            <RefreshCcw /> Vider le cache
          </Button>
        </DangerAction>
        <DangerAction
          title="Supprimer le personnage"
          description="Action irréversible : le personnage et toutes ses données seront définitivement supprimés."
        >
          <ToggleConfirmDialog
            title="Supprimer le personnage ?"
            description="Cette action est irréversible. Le personnage et toutes ses données (sorts, créatures, armes, armures, équipement, objets magiques et argent) seront définitivement supprimés."
            onConfirm={async () => {
              const result = await deleteCharacter(character.id);
              if (result?.error) {
                toast.error(result.error);
              }
            }}
          >
            {(setIsOpen) => (
              <Button theme="red" onClick={() => setIsOpen(true)}>
                <Trash /> Supprimer le personnage
              </Button>
            )}
          </ToggleConfirmDialog>
        </DangerAction>
      </SectionPanel>
    </div>
  );
}
