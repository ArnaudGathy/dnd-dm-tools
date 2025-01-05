"use client";

import dynamic from "next/dynamic";
import { Encounter } from "@/types/types";

const StatBlocksModule = dynamic(() => import("./StatBlocksModule"), {
  ssr: false,
});

export default function Wrapper({ encounter }: { encounter: Encounter }) {
  return <StatBlocksModule encounter={encounter} />;
}
