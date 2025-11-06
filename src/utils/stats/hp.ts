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
