import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function PopoverComponent({
  children,
  definition,
}: {
  children: React.ReactNode;
  definition: React.ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-fit">{definition}</PopoverContent>
    </Popover>
  );
}
