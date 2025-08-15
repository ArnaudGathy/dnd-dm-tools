import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArrayDeleteButton({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="destructive"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      className="mt-2 h-6"
    >
      <X className="size-4" />
    </Button>
  );
}
