import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArrayAddButton({
  onClick,
  label = "Ajouter",
  disabled,
}: {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className="mt-2"
      onClick={onClick}
      disabled={disabled}
    >
      <Plus className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
