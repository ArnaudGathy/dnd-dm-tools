import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ArrayAddButton({
  onClick,
  label = "Ajouter",
  disabled,
  className,
}: {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn(
        "mt-1 w-full border-dashed text-muted-foreground hover:text-foreground md:w-fit md:self-start md:px-4",
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <Plus className="mr-2 size-4" />
      {label}
    </Button>
  );
}
