import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverContentProps } from "@radix-ui/react-popover";

export default function PopoverComponent({
  children,
  definition,
  className,
  asChild = false,
  side = "bottom",
}: {
  asChild?: boolean;
  children: React.ReactNode;
  definition: React.ReactNode;
  className?: string;
  side?: PopoverContentProps["side"];
}) {
  return (
    <Popover>
      <PopoverTrigger className={className} asChild={asChild}>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-fit" side={side}>
        {definition}
      </PopoverContent>
    </Popover>
  );
}
