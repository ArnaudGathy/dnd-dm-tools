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
  definition: string;
}) {
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="w-fit max-w-[250px]">
        {definition}
      </PopoverContent>
    </Popover>
  );
}
