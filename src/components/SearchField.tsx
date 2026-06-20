"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

export const SearchField = ({
  search,
  setSearch,
  isDefault = false,
  clearSignal,
}: {
  search: string;
  setSearch: (value: string) => void;
  isDefault?: boolean;
  // Bump this number to imperatively empty the (uncontrolled) input — e.g. when a
  // parent "clear all filters" action resets the search param externally.
  clearSignal?: number;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasValue, setHasValue] = useState(Boolean(search));

  const handleChange = (value: string) => {
    setHasValue(Boolean(value));
    setSearch(value);
  };

  const isFirstRender = useRef(true);
  useEffect(() => {
    // Skip the mount call; only react to subsequent clear signals.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setHasValue(false);
  }, [clearSignal]);

  const clear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setHasValue(false);
    setSearch("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full md:w-[250px]">
      {hasValue ? (
        <button
          type="button"
          onClick={clear}
          aria-label="Effacer la recherche"
          className="absolute right-2 top-2.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <XMarkIcon className="size-5" />
        </button>
      ) : (
        <MagnifyingGlassIcon className="pointer-events-none absolute right-2 top-2.5 size-5 text-muted-foreground" />
      )}

      <Input
        ref={inputRef}
        className="pr-8"
        placeholder="Recherche"
        onChange={(e) => handleChange(e.target.value)}
        onFocus={(e) => e.target.select()}
        value={isDefault ? undefined : search}
        defaultValue={isDefault ? search : undefined}
      />
    </div>
  );
};
