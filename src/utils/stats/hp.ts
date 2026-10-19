import { Capacity } from "@prisma/client";

export const getBonusHP = (capacities: { name: Capacity["name"] }[], level: number) => {
  if (
    capacities.find(
      ({ name }) => name.toLowerCase().includes("tough") || name.toLowerCase().includes("robuste"),
    )
  ) {
    return level * 2;
  }
};

/** Max HP actually in effect: the computed `maximumHP` plus any temporary
 *  adjustment (Life Drain lowers it, Aid raises it). Never below 0. */
export const getEffectiveMaxHP = ({
  maximumHP,
  maximumHPAdjustment,
}: {
  maximumHP: number;
  maximumHPAdjustment: number;
}) => Math.max(0, maximumHP + maximumHPAdjustment);
