import { useMemo } from "react";
import { QuickAddCombobox } from "@/app/(with-nav)/characters/add/(items)/itemUI";
import {
  GEAR_PRESET_GROUPS,
  GEAR_PRESETS,
  GearPreset,
} from "@/app/(with-nav)/characters/add/(items)/gearPresets";

/**
 * Quick-add search over the PHB 2024 adventuring gear (French and English
 * names both match). Bundles show their size next to the name; packs show
 * their bundled price emphasized — that's what the player pays even though
 * the pack's items land in the inventory with their individual values.
 */
export default function GearQuickAdd({
  onAddPreset,
  onAddCustom,
}: {
  onAddPreset: (preset: GearPreset) => void;
  onAddCustom: (name: string) => void;
}) {
  const groups = useMemo(
    () =>
      GEAR_PRESET_GROUPS.map(({ label, keys }) => ({
        label,
        items: keys.map((key) => {
          const preset = GEAR_PRESETS[key];
          return {
            value: key,
            label: preset.name,
            searchText: preset.nameEn,
            labelExtra:
              (preset.quantity ?? 1) > 1 ? (
                <span className="text-muted-foreground"> ×{preset.quantity}</span>
              ) : undefined,
            hint: preset.contents ? (
              <>
                {preset.contents.length} objets ·{" "}
                <span className="font-medium text-foreground">{preset.value}</span>
              </>
            ) : (
              preset.value
            ),
          };
        }),
      })),
    [],
  );

  return (
    <QuickAddCombobox
      placeholder="Ajouter : corde, torche, rations…"
      ariaLabel="Ajouter un objet"
      groups={groups}
      customBrowseLabel="Créer un objet personnalisé"
      onAddPreset={(key) => onAddPreset(GEAR_PRESETS[key])}
      onAddCustom={onAddCustom}
    />
  );
}
