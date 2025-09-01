import {
  CardTitle,
  Card,
  CardDescription,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import PopoverComponent from "@/components/ui/PopoverComponent";
import {
  CAMPAIGN_MAP,
  CLASS_MAP,
  PARTY_MAP,
  RACE_MAP,
  SPELLCASTING_MODIFIER_MAP,
} from "@/constants/maps";
import { CharacterByOwner, cn } from "@/lib/utils";
import {
  BookOpenIcon,
  Edit,
  FileSpreadsheet,
  Heart,
  MapPin,
  RotateCcw,
  Skull,
  TreePalm,
  Users,
} from "lucide-react";
import { CharacterStatus } from "@prisma/client";
import { classColors } from "@/constants/colors";
import { StatCell } from "@/components/statblocks/StatCell";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CharacterList({
  character,
  numberOfCharacters,
}: {
  character: CharacterByOwner;
  numberOfCharacters: number;
}) {
  const spellCastingModifier = SPELLCASTING_MODIFIER_MAP[character.className];

  return (
    <div
      key={character.id}
      className={cn(
        "p-[1px]",
        character.status === CharacterStatus.ACTIVE &&
          "animate-shimmer rounded-lg bg-gradient-to-r from-blue-500 via-pink-500 to-blue-500 bg-[length:200%_100%]",
      )}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{character.name}</span>
            <div>
              {character.status === CharacterStatus.DEAD && (
                <PopoverComponent definition="Personnage mort">
                  <Skull />
                </PopoverComponent>
              )}
              {character.status === CharacterStatus.RETIRED && (
                <PopoverComponent definition="Personnage retraité">
                  <TreePalm />
                </PopoverComponent>
              )}
              {character.status === CharacterStatus.ACTIVE && (
                <PopoverComponent definition="Personnage actif">
                  <Heart />
                </PopoverComponent>
              )}
              {character.status === CharacterStatus.BACKUP && (
                <PopoverComponent definition="Personnage de secours">
                  <RotateCcw />
                </PopoverComponent>
              )}
            </div>
          </CardTitle>
          <CardDescription className="flex gap-1">
            <span
              style={{
                color: classColors[character.className].background,
              }}
            >
              {CLASS_MAP[character.className]}
            </span>
            <span>{RACE_MAP[character.race]}</span>
            <span>{`niveau ${character.level}`}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {numberOfCharacters > 1 && (
            <div className="flex flex-col gap-4">
              <StatCell
                name={<Users />}
                stat={PARTY_MAP[character.campaign.party.name]}
                isInline
              />
              <StatCell
                name={<MapPin />}
                stat={CAMPAIGN_MAP[character.campaign.name]}
                isInline
              />
            </div>
          )}
          <div className="flex gap-4">
            <Link href={`/characters/${character.id}`}>
              <Button variant="default" size="sm">
                <FileSpreadsheet />
                Fiche
              </Button>
            </Link>
            {!!spellCastingModifier && (
              <Link href={`/characters/${character.id}/spells`}>
                <Button variant="secondary" size="sm" theme="sky">
                  <BookOpenIcon />
                  Sorts
                </Button>
              </Link>
            )}
            <Link href={`/characters/${character.id}/update`}>
              <Button variant="secondary" size="sm">
                <Edit />
                Éditer
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
