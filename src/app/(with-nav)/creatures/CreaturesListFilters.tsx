"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { entries } from "remeda";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CREATURES_GROUP_BY } from "@/lib/api/creatures";

const tabs = {
  [CREATURES_GROUP_BY.ALPHABETICAL]: "Alphabétique",
  [CREATURES_GROUP_BY.CR]: "Facteur de Puissance",
};

export default function CreaturesListFilters() {
  const defaultSearch = CREATURES_GROUP_BY.ALPHABETICAL;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const handleGroupBy = (groupBy: CREATURES_GROUP_BY) => {
    const params = new URLSearchParams(searchParams);
    if (!!groupBy) {
      params.set("groupBy", groupBy);
    } else {
      params.delete("groupBy");
    }
    router.replace(`${pathName}?${params.toString()}`);
  };

  return (
    <Tabs defaultValue={searchParams.get("groupBy") ?? defaultSearch}>
      <TabsList>
        {entries(tabs).map(([key, value]) => (
          <TabsTrigger
            key={key}
            value={key}
            onClick={() => handleGroupBy(key as CREATURES_GROUP_BY)}
          >
            {value}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
