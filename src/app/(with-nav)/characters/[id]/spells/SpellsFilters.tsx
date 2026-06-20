"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchField } from "@/components/SearchField";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { entries } from "remeda";
import {
  ChevronsUp,
  MessageCircleMore,
  Moon,
  SquareCheckBig,
  Sparkle,
  SlidersHorizontal,
  Zap,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SPELLS_GROUP_BY } from "@/lib/api/spells";
import { SpellAction } from "@prisma/client";

const tabs = {
  [SPELLS_GROUP_BY.LEVEL]: "Niveau",
  [SPELLS_GROUP_BY.ALPHABETICAL]: "Alphabétique",
};

export type SpellsSearchParams = {
  groupBy?: SPELLS_GROUP_BY;
  search?: string;
  usable?: string;
  level?: string;
  ritual?: string;
  concentration?: string;
  action?: string;
  longRestCast?: string;
  swapLongRest?: string;
  swapLevelUp?: string;
  editMode?: "true" | "false";
};

// Filters that live inside the popover — drive the "Filtres" count badge.
const POPOVER_FILTER_KEYS = [
  "usable",
  "ritual",
  "concentration",
  "action",
  "longRestCast",
  "swapLongRest",
  "swapLevelUp",
];

// All narrowing params (popover + the inline level select) — drive reset.
const ALL_FILTER_KEYS = [...POPOVER_FILTER_KEYS, "level"];

const spellLevels = Array.from({ length: 10 }, (_, level) => level);

export default function SpellsFilters() {
  const defaultGroupBy = SPELLS_GROUP_BY.LEVEL;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const replaceParams = (params: URLSearchParams) => {
    router.replace(`${pathName}?${params.toString()}`);
  };

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    replaceParams(params);
  };

  const isInParam = (key: string, value: string) =>
    (searchParams.get(key)?.split(",") ?? []).includes(value);

  const toggleInParam = (key: string, value: string) => {
    const current = searchParams.get(key)?.split(",").filter(Boolean) ?? [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    updateParam(key, next.join(","));
  };

  const isOn = (key: string) => searchParams.get(key) === "true";

  const handleSearchParams = useDebouncedCallback((search: string) => {
    updateParam("search", search);
  }, 300);

  const handleGroupBy = (groupBy: SPELLS_GROUP_BY) => {
    updateParam("groupBy", groupBy);
  };

  const resetFilters = () => {
    const params = new URLSearchParams(searchParams);
    ALL_FILTER_KEYS.forEach((key) => params.delete(key));
    replaceParams(params);
  };

  const activeCount = POPOVER_FILTER_KEYS.filter((key) => searchParams.get(key)).length;
  const anyActive = ALL_FILTER_KEYS.some((key) => searchParams.get(key));

  const filters = (
    <div className="flex flex-col gap-4 text-sm">
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Disponibilité
        </h3>
        <Toggle
          variant="outline"
          className="w-fit"
          pressed={isOn("usable")}
          onPressedChange={(p) => updateParam("usable", p ? "true" : "")}
        >
          <SquareCheckBig className="size-4 text-sky-500" /> Utilisables
        </Toggle>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Propriétés du sort
        </h3>
        <div className="flex flex-wrap gap-2">
          <Toggle
            variant="outline"
            pressed={isOn("concentration")}
            onPressedChange={(p) => updateParam("concentration", p ? "true" : "")}
          >
            <MessageCircleMore className="size-4 text-yellow-500" /> Concentration
          </Toggle>
          <Toggle
            variant="outline"
            pressed={isOn("ritual")}
            onPressedChange={(p) => updateParam("ritual", p ? "true" : "")}
          >
            <Sparkle className="size-4 text-emerald-500" /> Rituel
          </Toggle>
          <Toggle
            variant="outline"
            pressed={isInParam("action", SpellAction.BONUS_ACTION)}
            onPressedChange={() => toggleInParam("action", SpellAction.BONUS_ACTION)}
          >
            <span className="size-2 rounded-full bg-orange-500" /> Bonus
          </Toggle>
          <Toggle
            variant="outline"
            pressed={isInParam("action", SpellAction.REACTION)}
            onPressedChange={() => toggleInParam("action", SpellAction.REACTION)}
          >
            <span className="size-2 rounded-full bg-purple-500" /> Réaction
          </Toggle>
          <Toggle
            variant="outline"
            pressed={isInParam("action", SpellAction.ACTION)}
            onPressedChange={() => toggleInParam("action", SpellAction.ACTION)}
          >
            <span className="size-2 rounded-full bg-green-700" /> Action
          </Toggle>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Configuration
        </h3>
        <div className="flex flex-wrap gap-2">
          <Toggle
            variant="outline"
            pressed={isOn("longRestCast")}
            onPressedChange={(p) => updateParam("longRestCast", p ? "true" : "")}
          >
            <Zap className="size-4 text-muted-foreground" /> 1 / long repos
          </Toggle>
          <Toggle
            variant="outline"
            pressed={isOn("swapLongRest")}
            onPressedChange={(p) => updateParam("swapLongRest", p ? "true" : "")}
          >
            <Moon className="size-4 text-muted-foreground" /> Échange repos
          </Toggle>
          <Toggle
            variant="outline"
            pressed={isOn("swapLevelUp")}
            onPressedChange={(p) => updateParam("swapLevelUp", p ? "true" : "")}
          >
            <ChevronsUp className="size-4 text-muted-foreground" /> Échange niveau
          </Toggle>
        </div>
      </div>

      {anyActive && (
        <>
          <Separator />
          <Button variant="ghost" size="sm" className="self-start" onClick={resetFilters}>
            Réinitialiser les filtres
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
      <SearchField
        search={searchParams.get("search") ?? ""}
        setSearch={handleSearchParams}
        isDefault
      />

      <Tabs defaultValue={searchParams.get("groupBy") ?? defaultGroupBy}>
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

      <Select
        value={searchParams.get("level") ?? "all"}
        onValueChange={(value) => updateParam("level", value === "all" ? "" : value)}
      >
        <SelectTrigger className="w-auto gap-2">
          <SelectValue placeholder="Niveau" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">Tous les niveaux</SelectItem>
            {spellLevels.map((level) => (
              <SelectItem key={level} value={String(level)}>
                Niveau {level}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <SlidersHorizontal className="size-4" />
            Filtres
            {activeCount > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 font-normal tabular-nums">
                {activeCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[min(34rem,calc(100vw-2rem))]">
          {filters}
        </PopoverContent>
      </Popover>
    </div>
  );
}
