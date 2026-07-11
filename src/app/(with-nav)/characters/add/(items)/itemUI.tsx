import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { PackagePlus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";

/** Accent-insensitive lowercase form, for search matching. */
export const normalizeSearchText = (value: string) =>
  value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/**
 * Container for one entry of a repeatable list (arme, armure, objet, capacité…).
 * Gives every entry the same anatomy: a small uppercase header with its rank,
 * a delete button, and a body laid out by the caller.
 */
export function ItemCard({
  title,
  onDelete,
  deleteDisabled,
  className,
  children,
}: {
  title: string;
  onDelete?: () => void;
  deleteDisabled?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("rounded-lg border border-border bg-muted/40 p-3", className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
          {title}
        </span>
        {onDelete && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="-mr-1 -mt-1 size-7 text-muted-foreground hover:text-destructive"
            onClick={onDelete}
            disabled={deleteDisabled}
            aria-label={`Supprimer : ${title}`}
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

export type QuickAddItem = {
  value: string;
  label: string;
  /** Extra keywords matched by the search besides the label (e.g. English name). */
  searchText?: string;
  /** Muted suffix rendered right after the label (e.g. bundle size). */
  labelExtra?: ReactNode;
  /** Right-aligned secondary info (price, dégâts, CA…). */
  hint?: ReactNode;
};

export type PresetGroup = {
  label: string;
  items: QuickAddItem[];
};

type QuickAddOption = { kind: "preset"; item: QuickAddItem; group?: string } | { kind: "custom" };

/**
 * Combobox to append entries to a repeatable list fast: type to filter the
 * presets (accent-insensitive), Enter/click to add; with an empty query the
 * whole catalog is browsable by group. The « Créer » option appends a custom
 * entry pre-named with the current query. By default adding a preset keeps
 * the input focused and the list open so several entries can be added in a
 * row; pass closeOnAdd for lists where that flow doesn't fit (armes,
 * armures). Adding a custom entry always closes the list (the caller opens
 * the new row for editing).
 */
export function QuickAddCombobox({
  placeholder,
  ariaLabel,
  groups,
  customBrowseLabel,
  onAddPreset,
  onAddCustom,
  closeOnAdd = false,
}: {
  placeholder: string;
  ariaLabel: string;
  groups: PresetGroup[];
  /** Label of the create-custom option while browsing (no query typed). */
  customBrowseLabel: string;
  onAddPreset: (value: string) => void;
  onAddCustom: (query: string) => void;
  closeOnAdd?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const trimmedQuery = query.trim();
  const isBrowsing = trimmedQuery === "";

  const options = useMemo<QuickAddOption[]>(() => {
    if (isBrowsing) {
      return [
        { kind: "custom" },
        ...groups.flatMap((group) =>
          group.items.map((item) => ({ kind: "preset" as const, item, group: group.label })),
        ),
      ];
    }

    const needle = normalizeSearchText(trimmedQuery);
    const matches = groups
      .flatMap((group) => group.items)
      .filter(
        (item) =>
          normalizeSearchText(item.label).includes(needle) ||
          (!!item.searchText && normalizeSearchText(item.searchText).includes(needle)),
      )
      .sort((a, b) => {
        const aStarts = normalizeSearchText(a.label).startsWith(needle);
        const bStarts = normalizeSearchText(b.label).startsWith(needle);
        if (aStarts !== bStarts) {
          return aStarts ? -1 : 1;
        }
        return a.label.localeCompare(b.label, "fr");
      })
      .map((item) => ({ kind: "preset" as const, item }));
    return [...matches, { kind: "custom" }];
  }, [groups, isBrowsing, trimmedQuery]);

  // Clamp the highlight when the option list shrinks, reset it on new input.
  useEffect(() => {
    setHighlighted((current) => Math.min(current, options.length - 1));
  }, [options.length]);

  useEffect(() => {
    listRef.current
      ?.querySelector('[data-highlighted="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [highlighted, isOpen]);

  const select = (option: QuickAddOption) => {
    if (option.kind === "preset") {
      onAddPreset(option.item.value);
      setQuery("");
      setHighlighted(0);
      if (closeOnAdd) {
        setIsOpen(false);
      } else {
        // Stay open and focused: adding several entries in a row is the normal flow.
        inputRef.current?.focus();
      }
    } else {
      onAddCustom(trimmedQuery);
      setQuery("");
      setIsOpen(false);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen && ["ArrowDown", "ArrowUp", "Enter"].includes(event.key)) {
      setIsOpen(true);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((current) => Math.min(current + 1, options.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = options[highlighted];
      if (option) {
        select(option);
      }
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  let lastGroup: string | undefined;

  return (
    // The panel that hosts the search clips its overflow, so the list goes
    // through a portaled popover. Focus never leaves the input: open/close is
    // driven here, and option clicks prevent the blur with onMouseDown.
    <Popover open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <PopoverAnchor asChild>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            role="combobox"
            aria-expanded={isOpen}
            aria-label={ariaLabel}
            placeholder={placeholder}
            className="pl-8"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
              setHighlighted(0);
            }}
            onFocus={() => setIsOpen(true)}
            // closeOnAdd leaves the input focused with the list closed, so a
            // plain click (no focus event) must reopen it.
            onClick={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            onKeyDown={onKeyDown}
          />
        </div>
      </PopoverAnchor>

      {isOpen && (
        <PopoverContent
          ref={listRef}
          role="listbox"
          align="start"
          className="max-h-72 w-[--radix-popper-anchor-width] overflow-y-auto p-1 md:max-h-[min(30rem,var(--radix-popper-available-height))]"
          onOpenAutoFocus={(event) => event.preventDefault()}
          // Keep the input focused (and the list open) while clicking options.
          onMouseDown={(event) => event.preventDefault()}
        >
          {options.map((option, index) => {
            const isHighlighted = index === highlighted;
            const groupHeader =
              option.kind === "preset" && option.group && option.group !== lastGroup
                ? option.group
                : undefined;
            if (option.kind === "preset") {
              lastGroup = option.group;
            }

            return (
              <div key={option.kind === "preset" ? option.item.value : "custom"}>
                {groupHeader && (
                  <p className="mt-2 px-2 pb-1 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground/70 first:mt-1">
                    {groupHeader}
                  </p>
                )}
                <div
                  role="option"
                  aria-selected={isHighlighted}
                  data-highlighted={isHighlighted}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                    isHighlighted && "bg-accent text-accent-foreground",
                  )}
                  onMouseEnter={() => setHighlighted(index)}
                  onClick={() => select(option)}
                >
                  {option.kind === "preset" ? (
                    <>
                      <span className="min-w-0 flex-1 truncate">
                        {option.item.label}
                        {option.item.labelExtra}
                      </span>
                      {option.item.hint && (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {option.item.hint}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <PackagePlus className="size-4 shrink-0 text-sky-400" />
                      <span className="min-w-0 flex-1 truncate">
                        {isBrowsing ? (
                          customBrowseLabel
                        ) : (
                          <>
                            Créer «&nbsp;<span className="font-medium">{trimmedQuery}</span>&nbsp;»
                          </>
                        )}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </PopoverContent>
      )}
    </Popover>
  );
}
