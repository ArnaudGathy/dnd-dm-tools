"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchField } from "@/components/SearchField";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { entries } from "remeda";
import { ChevronDown, ChevronUp, SquareCheckBig } from "lucide-react";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";
import { SPELLS_FILTER_BY, SPELLS_GROUP_BY } from "@/lib/api/spells";

const tabs = {
  [SPELLS_GROUP_BY.ALPHABETICAL]: "Alphabétique",
  [SPELLS_GROUP_BY.LEVEL]: "Niveau",
};

export type SpellsSearchParams = {
  groupBy?: SPELLS_GROUP_BY;
  search?: string;
  filterBy?: SPELLS_FILTER_BY;
  editMode?: "true" | "false";
  isCollapsed?: "true" | "false";
};

export default function SpellsFilters() {
  const defaultSearch = SPELLS_GROUP_BY.LEVEL;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const params = new URLSearchParams(searchParams);

  const isCollapsed = params.get("isCollapsed") === "true";

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
    if (!!groupBy) {
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

  const handleCollapse = (isCollapsed: boolean) => {
    if (isCollapsed) {
      params.set("isCollapsed", "true");
    } else {
      params.delete("isCollapsed");
    }
    updateParams();
  };

  return (
    <div className="flex flex-col gap-2 md:flex-row">
      <div className="flex gap-2">
        <Toggle
          variant="outline"
          pressed={isCollapsed}
          onPressedChange={handleCollapse}
        >
          Filtres
          {isCollapsed ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronUp className="size-4" />
          )}
        </Toggle>
        <SearchField
          search={params.get("search") ?? ""}
          setSearch={handleSearchParams}
          isDefault
        />
      </div>

      <div
        className={cn("flex items-center gap-2", {
          hidden: params.get("isCollapsed"),
        })}
      >
        <Tabs defaultValue={params.get("groupBy") ?? defaultSearch}>
          <TabsList>
            {entries(tabs).map(([key, value]) => {
              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  onClick={() => handleGroupBy(key as SPELLS_GROUP_BY)}
                >
                  {value}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <Toggle
            variant="outline"
            pressed={params.get("filterBy") === SPELLS_FILTER_BY.PREPARED}
            onPressedChange={(isEnabled) =>
              isEnabled
                ? handleFilterBy(SPELLS_FILTER_BY.PREPARED)
                : handleFilterBy(undefined)
            }
          >
            <SquareCheckBig /> Préparés
          </Toggle>
        </div>
      </div>
    </div>
  );
}
