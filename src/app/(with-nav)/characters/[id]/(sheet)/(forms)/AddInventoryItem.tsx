"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AddInventoryItemForm from "@/app/(with-nav)/characters/[id]/(sheet)/(forms)/AddInventoryItemForm";
import { ReactNode, useState } from "react";
import { CharacterById } from "@/lib/utils";
import { InventoryItem } from "@prisma/client";

export default function AddInventoryItem({
  character,
  item,
  children,
  className,
  title,
}: {
  character: CharacterById;
  item?: InventoryItem;
  children: ReactNode;
  className?: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        onClick={() => setOpen(true)}
        className={className}
        asChild
      >
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <AddInventoryItemForm
          character={character}
          item={item}
          closeAction={() => setOpen(false)}
          title={title}
        />
      </PopoverContent>
    </Popover>
  );
}
