"use client";

import { Label } from "@radix-ui/react-label";
import { Switch } from "@/components/ui/switch";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function EditModeButton() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const params = new URLSearchParams(searchParams);

  const updateParams = () => {
    router.replace(`${pathName}?${params.toString()}`);
  };

  const handleEditMode = useDebouncedCallback((editMode: string) => {
    if (editMode !== "false") {
      params.set("editMode", editMode);
    } else {
      params.delete("editMode");
    }
    updateParams();
  }, 300);

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="editMode" className="text-sm">
        Éditer
      </Label>
      <Switch
        id="editMode"
        checked={params.get("editMode") === "true"}
        onCheckedChange={(checked) => handleEditMode(checked.toString())}
      />
    </div>
  );
}
