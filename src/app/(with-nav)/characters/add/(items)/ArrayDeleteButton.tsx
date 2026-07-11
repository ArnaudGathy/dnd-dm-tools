import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArrayDeleteButton({
  onClick,
  disabled = false,
  label = "Supprimer",
}: {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
