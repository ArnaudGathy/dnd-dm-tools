"use client";

import dynamic from "next/dynamic";
import { Creature, Encounter } from "@/types/types";

const CombatModule = dynamic(() => import("./CombatModule"), {
  ssr: false,
});

export default function Wrapper({
  encounter,
  creatures,
}: {
  encounter: Encounter;
  creatures: Creature[];
}) {
  return <CombatModule encounter={encounter} creatures={creatures} />;
}
