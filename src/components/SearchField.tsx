import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Input } from "@/components/ui/input";

export const SearchField = ({
  search,
  setSearch,
  isDefault = false,
}: {
  search: string;
  setSearch: (value: string) => void;
  isDefault?: boolean;
}) => {
  const iconClass = "absolute right-2 top-2.5 size-5 text-muted-foreground";
  return (
    <div className="relative w-full md:w-[250px]">
      <MagnifyingGlassIcon className={iconClass} />

      <Input
        className=""
        placeholder="Recherche"
        onChange={(e) => setSearch(e.target.value)}
        onFocus={(e) => e.target.select()}
        value={isDefault ? undefined : search}
        defaultValue={isDefault ? search : undefined}
      />
    </div>
  );
};
