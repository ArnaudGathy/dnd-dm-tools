import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function PopoverComponent({
  children,
  definition,
  className,
  asChild = false,
}: {
  asChild?: boolean;
  children: React.ReactNode;
  definition: React.ReactNode;
  className?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger className={className} asChild={asChild}>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-fit">{definition}</PopoverContent>
    </Popover>
  );
}
