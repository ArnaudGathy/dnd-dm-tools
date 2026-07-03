"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContentProps } from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

export default function PopoverComponent({
  children,
  definition,
  className,
  contentClassName,
  asChild = false,
  side = "bottom",
  noFocus = false,
}: {
  asChild?: boolean;
  children: React.ReactNode;
  definition: React.ReactNode;
  className?: string;
  contentClassName?: string;
  side?: PopoverContentProps["side"];
  noFocus?: boolean;
}) {
  return (
    <Popover>
      <PopoverTrigger className={className} asChild={asChild}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-fit", contentClassName)}
        side={side}
        onOpenAutoFocus={(event) => {
          if (noFocus) {
            event.preventDefault();
          }
        }}
      >
        {definition}
      </PopoverContent>
    </Popover>
  );
}
