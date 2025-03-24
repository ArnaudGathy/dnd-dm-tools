import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Input } from "@/components/ui/input";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { cn } from "@/lib/utils";

export const SearchField = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (value: string) => void;
}) => {
  const iconClass = "absolute right-2 top-2.5 size-5 text-muted-foreground";
  return (
    <div className="relative w-[200px]">
      {!!search ? (
        <XMarkIcon
          className={cn(iconClass, "cursor-pointer")}
          onClick={() => setSearch("")}
        />
      ) : (
        <MagnifyingGlassIcon className={iconClass} />
      )}

      <Input
        className="w-full"
        placeholder="Recherche"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />
    </div>
  );
};
