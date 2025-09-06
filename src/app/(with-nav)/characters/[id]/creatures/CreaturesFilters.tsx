"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { entries } from "remeda";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Toggle } from "@/components/ui/toggle";
import { Heart } from "lucide-react";
import { CREATURES_FILTER_BY, CREATURES_GROUP_BY } from "@/lib/api/creatures";

const tabs = {
  [CREATURES_GROUP_BY.ALPHABETICAL]: "Alphabétique",
  [CREATURES_GROUP_BY.CR]: "Facteur de Puissance",
};

export default function CreaturesFilters() {
  const defaultSearch = CREATURES_GROUP_BY.CR;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const params = new URLSearchParams(searchParams);

  const updateParams = () => {
    router.replace(`${pathName}?${params.toString()}`);
  };

  const handleGroupBy = (groupBy: CREATURES_GROUP_BY) => {
    if (!!groupBy) {
      params.set("groupBy", groupBy);
    } else {
      params.delete("groupBy");
    }
    updateParams();
  };

  const handleFilterBy = (filterBy?: CREATURES_FILTER_BY) => {
    if (!!filterBy) {
      params.set("filterBy", filterBy);
    } else {
      params.delete("filterBy");
    }
    updateParams();
  };

  return (
    <div className="flex flex-wrap gap-4">
      <Tabs defaultValue={params.get("groupBy") ?? defaultSearch}>
        <TabsList>
          {entries(tabs).map(([key, value]) => {
            return (
              <TabsTrigger
                key={key}
                value={key}
                onClick={() => handleGroupBy(key as CREATURES_GROUP_BY)}
              >
                {value}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
      <Toggle
        variant="outline"
        pressed={params.get("filterBy") === CREATURES_FILTER_BY.FAVORITE}
        onPressedChange={(isEnabled) =>
          isEnabled
            ? handleFilterBy(CREATURES_FILTER_BY.FAVORITE)
            : handleFilterBy(undefined)
        }
      >
        <Heart /> Favoris
      </Toggle>
    </div>
  );
}
