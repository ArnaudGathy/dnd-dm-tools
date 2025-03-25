"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { SearchField } from "@/components/SearchField";

export default function CreatureFilters() {
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

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <SearchField
        search={params.get("search") ?? ""}
        setSearch={handleSearchParams}
        isDefault
      />
    </div>
  );
}
