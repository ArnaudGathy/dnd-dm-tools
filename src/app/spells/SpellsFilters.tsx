"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchField } from "@/components/SearchField";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { entries } from "remeda";
import { useState } from "react";
import { ChevronDown, ChevronUp, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";
import { SPELLS_GROUP_BY, SPELLS_VIEW } from "@/lib/api/spells";

const tabs = {
  [SPELLS_GROUP_BY.ALPHABETICAL]: "Alphabétique",
  [SPELLS_GROUP_BY.LEVEL]: "Niveau",
  [SPELLS_GROUP_BY.CHARACTER]: "Personnage",
};

export default function SpellsFilters({
  defaultSearch = SPELLS_GROUP_BY.ALPHABETICAL,
  disablePlayer = false,
  disableCards = false,
}: {
  defaultSearch?: SPELLS_GROUP_BY;
  disablePlayer?: boolean;
  disableCards?: boolean;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const params = new URLSearchParams(searchParams);
  const isCardView = params.get("view") === SPELLS_VIEW.CARDS;

  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const handleView = (view: SPELLS_VIEW) => {
    if (view) {
      params.set("view", view);
    } else {
      params.delete("view");
    }
    updateParams();
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="flex gap-2">
        <Toggle
          className="md:hidden"
          variant="outline"
          defaultPressed={!isCollapsed}
          onClick={() => setIsCollapsed((current) => !current)}
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

      <div className={cn("flex items-center gap-4", { hidden: isCollapsed })}>
        {!disableCards && (
          <div>
            <Toggle
              variant="outline"
              pressed={params.get("view") === SPELLS_VIEW.CARDS}
              onPressedChange={(isEnabled) =>
                handleView(isEnabled ? SPELLS_VIEW.CARDS : SPELLS_VIEW.LIST)
              }
            >
              <StickyNote />
              Cartes
            </Toggle>
          </div>
        )}
        <Tabs defaultValue={params.get("groupBy") ?? defaultSearch}>
          <TabsList>
            {entries(tabs).map(([key, value]) => {
              if (disablePlayer && key === SPELLS_GROUP_BY.CHARACTER) {
                return null;
              }

              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  onClick={() => handleGroupBy(key as SPELLS_GROUP_BY)}
                  disabled={isCardView}
                >
                  {value}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
