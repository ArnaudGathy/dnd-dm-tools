"use client";

import dynamic from "next/dynamic";
import { Encounter } from "@/types/types";

const CombatModule = dynamic(() => import("./CombatModule"), {
  ssr: false,
});

export default function Wrapper({ encounter }: { encounter: Encounter }) {
  return <CombatModule encounter={encounter} />;
}
