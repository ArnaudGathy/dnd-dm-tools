"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import AddMagicItemForm from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/AddMagicItemForm";
import { ReactNode, useState } from "react";
import { CharacterById } from "@/lib/utils";
import { MagicItem } from "@prisma/client";

export default function AddMagicItem({
  character,
  item,
  children,
  className,
  title,
}: {
  character: CharacterById;
  item?: MagicItem;
  children: ReactNode;
  className?: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger onClick={() => setOpen(true)} className={className} asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <AddMagicItemForm
          character={character}
          item={item}
          closeAction={() => setOpen(false)}
          title={title}
        />
      </PopoverContent>
    </Popover>
  );
}
