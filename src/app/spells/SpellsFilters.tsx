"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchField } from "@/components/SearchField";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { entries } from "remeda";
import { GROUP_BY } from "@/lib/api/characters";

const tabs = {
  [GROUP_BY.ALPHABETICAL]: "Alphabétique",
  [GROUP_BY.LEVEL]: "Niveau",
  [GROUP_BY.CHARACTER]: "Personnage",
};

export default function SpellsFilters({
  defaultSearch = GROUP_BY.ALPHABETICAL,
  disablePlayer = false,
}: {
  defaultSearch?: GROUP_BY;
  disablePlayer?: boolean;
}) {
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

  const handleGroupBy = (groupBy: GROUP_BY) => {
    if (!!groupBy) {
      params.set("groupBy", groupBy);
    } else {
      params.delete("groupBy");
    }

    updateParams();
  };

  return (
    <div className="flex gap-4">
      <Tabs defaultValue={params.get("groupBy") ?? defaultSearch}>
        <TabsList>
          {entries(tabs).map(([key, value]) => {
            if (disablePlayer && key === GROUP_BY.CHARACTER) {
              return null;
            }

            return (
              <TabsTrigger
                key={key}
                value={key}
                onClick={() => handleGroupBy(key as GROUP_BY)}
              >
                {value}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <SearchField
        search={params.get("search") ?? ""}
        setSearch={handleSearchParams}
        isDefault
      />
    </div>
  );
}
