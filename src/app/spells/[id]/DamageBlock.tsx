"use client";

import { StatCell } from "@/app/creatures/StatCell";
import { getPartyLevel } from "@/utils/localStorageUtils";
import { keys, reduce } from "remeda";
import dynamic from "next/dynamic";

const DamageBlock = ({ damages }: { damages: { [level: string]: string } }) => {
  const partyLevel = getPartyLevel();
  const highestDamageLevel = reduce(
    keys(damages),
    (highestLevel, level) => {
      const partyLevelInt = parseInt(partyLevel, 10);
      const levelInt = parseInt(level, 10);

      if (partyLevelInt >= levelInt) {
        return levelInt;
      }
      return highestLevel;
    },
    1,
  );
  const damage = damages[highestDamageLevel.toString()];

  return <StatCell name="Dégats" stat={damage} />;
};

export default dynamic(() => Promise.resolve(DamageBlock), { ssr: false });
