"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { SearchField } from "@/components/SearchField";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkle, MessageCircleMore, ChevronDown, X } from "lucide-react";
import { entries } from "remeda";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Classes, SpellAction } from "@prisma/client";
import { CLASS_MAP, CLASS_SPELL_PROGRESSION_MAP, SPELL_SCHOOLS } from "@/constants/maps";
import { SPELLS_GROUP_BY } from "@/lib/api/spells";
import { useState } from "react";

const tabs = {
  [SPELLS_GROUP_BY.LEVEL]: "Niveau",
  [SPELLS_GROUP_BY.ALPHABETICAL]: "Alphabétique",
  [SPELLS_GROUP_BY.NONE]: "Aucun",
};

// Only classes that actually have a spell list, sorted by their French label.
const spellcastingClasses = (Object.keys(CLASS_MAP) as Classes[])
  .filter((c) => CLASS_SPELL_PROGRESSION_MAP[c].length > 0)
  .sort((a, b) => CLASS_MAP[a].localeCompare(CLASS_MAP[b], "fr"));

const spellLevels = Array.from({ length: 10 }, (_, level) => level); // 0 (cantrips) → 9

export default function SpellsListFilters() {
  const defaultGroupBy = SPELLS_GROUP_BY.LEVEL;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathName}?${params.toString()}`);
  };

  // Toggle one value within a comma-separated multi-value param (OR within that
  // param, AND across params).
  const isInParam = (key: string, value: string) =>
    (searchParams.get(key)?.split(",") ?? []).includes(value);

  const toggleInParam = (key: string, value: string) => {
    const current = searchParams.get(key)?.split(",").filter(Boolean) ?? [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    updateParam(key, next.join(","));
  };

  const handleSearch = useDebouncedCallback((search: string) => {
    updateParam("search", search);
  }, 300);

  // Every filterable param — cleared together by "Tout effacer". The grouping
  // (groupBy) is presentation, not a filter, so it's intentionally preserved.
  const FILTER_KEYS = ["search", "level", "school", "class", "ritual", "concentration", "action"];
  const hasActiveFilters = FILTER_KEYS.some((key) => searchParams.get(key));
  // Bumped on clear so the uncontrolled (defaultValue) SearchField remounts empty.
  const [clearNonce, setClearNonce] = useState(0);
  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams);
    FILTER_KEYS.forEach((key) => params.delete(key));
    router.replace(`${pathName}?${params.toString()}`);
    setClearNonce((nonce) => nonce + 1);
  };

  const isRitualOnly = searchParams.get("ritual") === "true";
  const isConcentrationOnly = searchParams.get("concentration") === "true";

  const selectedLevels = (searchParams.get("level")?.split(",").filter(Boolean) ?? [])
    .map(Number)
    .sort((a, b) => a - b);
  const levelLabel =
    selectedLevels.length === 0
      ? "Tous les niveaux"
      : selectedLevels.length === 1
        ? `Niveau ${selectedLevels[0]}`
        : `Niveaux ${selectedLevels.join(", ")}`;

  const selectedSchools = searchParams.get("school")?.split(",").filter(Boolean) ?? [];
  const schoolLabel =
    selectedSchools.length === 0
      ? "Toutes les écoles"
      : selectedSchools.length === 1
        ? selectedSchools[0]
        : `${selectedSchools.length} écoles`;

  return (
    <div className="flex flex-col gap-3">
      {/* Presentation: search + how the list is grouped */}
      <div className="sm:flex-row sm:items-center flex gap-2">
        <SearchField
          search={searchParams.get("search") ?? ""}
          setSearch={handleSearch}
          isDefault
          clearSignal={clearNonce}
        />

        <Tabs defaultValue={searchParams.get("groupBy") ?? defaultGroupBy}>
          <TabsList>
            {entries(tabs).map(([key, value]) => (
              <TabsTrigger key={key} value={key} onClick={() => updateParam("groupBy", key)}>
                {value}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Filters: dropdowns to narrow, then toggle flags */}
      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-auto justify-between gap-2 font-normal">
              {levelLabel}
              <ChevronDown className="size-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-[60vh] overflow-y-auto">
            {spellLevels.map((level) => (
              <DropdownMenuCheckboxItem
                key={level}
                checked={isInParam("level", String(level))}
                // Keep the menu open so several levels can be picked in one go.
                onSelect={(event) => event.preventDefault()}
                onCheckedChange={() => toggleInParam("level", String(level))}
              >
                Niveau {level}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-auto justify-between gap-2 font-normal">
              {schoolLabel}
              <ChevronDown className="size-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-[60vh] overflow-y-auto">
            {SPELL_SCHOOLS.map((school) => (
              <DropdownMenuCheckboxItem
                key={school}
                checked={isInParam("school", school)}
                // Keep the menu open so several schools can be picked in one go.
                onSelect={(event) => event.preventDefault()}
                onCheckedChange={() => toggleInParam("school", school)}
              >
                {school}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Select
          value={searchParams.get("class") ?? "all"}
          onValueChange={(value) => updateParam("class", value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Classe" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Toutes les classes</SelectItem>
              {spellcastingClasses.map((spellClass) => (
                <SelectItem key={spellClass} value={spellClass}>
                  {CLASS_MAP[spellClass]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="sm:block mx-1 hidden h-6 w-px self-center bg-border" />

        <Toggle
          variant="outline"
          aria-label="Afficher seulement les rituels"
          pressed={isRitualOnly}
          onPressedChange={(pressed) => updateParam("ritual", pressed ? "true" : "")}
        >
          <Sparkle className="text-emerald-500" />
          Rituels
        </Toggle>

        <Toggle
          variant="outline"
          aria-label="Afficher seulement les sorts de concentration"
          pressed={isConcentrationOnly}
          onPressedChange={(pressed) => updateParam("concentration", pressed ? "true" : "")}
        >
          <MessageCircleMore className="text-yellow-500" />
          Concentration
        </Toggle>

        <Toggle
          variant="outline"
          aria-label="Filtrer les actions bonus"
          pressed={isInParam("action", SpellAction.BONUS_ACTION)}
          onPressedChange={() => toggleInParam("action", SpellAction.BONUS_ACTION)}
        >
          <span className="size-2 rounded-full bg-orange-500" />
          Bonus
        </Toggle>

        <Toggle
          variant="outline"
          aria-label="Filtrer les réactions"
          pressed={isInParam("action", SpellAction.REACTION)}
          onPressedChange={() => toggleInParam("action", SpellAction.REACTION)}
        >
          <span className="size-2 rounded-full bg-purple-500" />
          Réaction
        </Toggle>

        <Toggle
          variant="outline"
          aria-label="Filtrer les actions simples"
          pressed={isInParam("action", SpellAction.ACTION)}
          onPressedChange={() => toggleInParam("action", SpellAction.ACTION)}
        >
          <span className="size-2 rounded-full bg-green-700" />
          Action
        </Toggle>

        {hasActiveFilters && (
          <>
            <div className="sm:block mx-1 hidden h-6 w-px self-center bg-border" />
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={clearAllFilters}
            >
              <X className="size-4" />
              Tout effacer
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
