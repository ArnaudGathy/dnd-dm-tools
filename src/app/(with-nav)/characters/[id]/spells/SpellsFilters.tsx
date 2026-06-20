"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchField } from "@/components/SearchField";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { entries } from "remeda";
import { SquareCheckBig } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { SPELLS_FILTER_BY, SPELLS_GROUP_BY } from "@/lib/api/spells";

const tabs = {
  [SPELLS_GROUP_BY.LEVEL]: "Niveau",
  [SPELLS_GROUP_BY.ALPHABETICAL]: "Alphabétique",
};

export type SpellsSearchParams = {
  groupBy?: SPELLS_GROUP_BY;
  search?: string;
  filterBy?: SPELLS_FILTER_BY;
  editMode?: "true" | "false";
};

export default function SpellsFilters() {
  const defaultGroupBy = SPELLS_GROUP_BY.LEVEL;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const params = new URLSearchParams(searchParams);

  const updateParams = () => {
    router.replace(`${pathName}?${params.toString()}`);
  };

  const handleSearchParams = useDebouncedCallback((search: string) => {
    if (search !== "") {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    updateParams();
  }, 300);

  const handleGroupBy = (groupBy: SPELLS_GROUP_BY) => {
    if (groupBy) {
      params.set("groupBy", groupBy);
    } else {
      params.delete("groupBy");
    }
    updateParams();
  };

  const handleFilterBy = (filterBy?: SPELLS_FILTER_BY) => {
    if (filterBy) {
      params.set("filterBy", filterBy);
    } else {
      params.delete("filterBy");
    }
    updateParams();
  };

  return (
    <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
      <SearchField search={params.get("search") ?? ""} setSearch={handleSearchParams} isDefault />

      <Tabs defaultValue={params.get("groupBy") ?? defaultGroupBy}>
        <TabsList>
          {entries(tabs).map(([key, value]) => (
            <TabsTrigger
              key={key}
              value={key}
              onClick={() => handleGroupBy(key as SPELLS_GROUP_BY)}
            >
              {value}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Toggle
        variant="outline"
        aria-label="Afficher seulement les sorts utilisables (préparés)"
        pressed={params.get("filterBy") === SPELLS_FILTER_BY.PREPARED}
        onPressedChange={(isEnabled) =>
          isEnabled ? handleFilterBy(SPELLS_FILTER_BY.PREPARED) : handleFilterBy(undefined)
        }
      >
        <SquareCheckBig className="size-4" /> Sorts utilisables
      </Toggle>
    </div>
  );
}
