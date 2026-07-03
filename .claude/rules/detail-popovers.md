# Detail Popover Rules (StatBreakdown)

How to implement informational popovers on the character sheet — the ones that
explain how a number was computed ("CA 18 = cotte de mailles 16 + bouclier 2")
or what a marker means (concentration, rituel, arme maîtrisée…). These popovers
display data only; interactive popovers (forms, config menus) are a different
pattern and are NOT covered here.

## The component

`StatBreakdown` (src/app/(with-nav)/characters/[id]/(sheet)/StatBreakdown.tsx)
renders a miniature SectionPanel: an accent-tinted header (icon + uppercase
title), dotted-leader rows (one per contribution), and an emphasized Total.
Never hand-roll `<div><span className="font-bold">…` popover bodies — always go
through StatBreakdown so every popover on the sheet reads the same way.

```tsx
<PopoverComponent
  contentClassName={breakdownContentClassName}   // ← removes padding so the header reaches the edges
  definition={
    <StatBreakdown
      accent="red"                    // match the accent of the panel that hosts the trigger
      icon={Crosshair}                // lucide icon, usually the same one as the trigger/panel
      title="Bonus d'attaque"         // short French title, no terminal period
      rows={[
        { label: "Force", value: addSignToNumber(details.abilityModifier) },
        details.attackBonus > 0 && {  // conditional rows: plain `&&`, falsy rows are dropped
          label: "Bonus",
          value: addSignToNumber(details.attackBonus),
        },
      ]}
      total={details.total}
    />
  }
>
  …trigger…
</PopoverComponent>
```

`HudTile` already passes `breakdownContentClassName` internally — when the
trigger is a HudTile just set `definition={<StatBreakdown …/>}`.

## Conventions

- **Accent = source panel.** The popover inherits the `Accent` of the panel its
  trigger lives in: `red` (Armes), `sky` (Sorts), `teal` (Tests & Sauvegardes),
  `amber` (Ressources), `indigo` (Compétences), `emerald`/`slate`/… for HUD
  tiles per their icon color. This is the visual link between the number and
  its explanation.
- **Row values are pre-formatted strings.** Base values stay plain (`8`, `16`);
  additive modifiers are signed with `addSignToNumber` (`+3`, `-1`). A row may
  carry `color` (inline CSS color) when the domain colors it, e.g. damage types.
- **Rows are the contributions, `total` is the answer.** Hide zero-value
  contribution rows with `condition && { … }` (the component filters falsy
  entries), but always show rows that can be negative (e.g. DEX). The total
  should visually match the number on the trigger.
- **Explanation-only popovers** (concentration, rituel, arme maîtrisée, tours
  de magie…) use the same component with `note` instead of `rows`/`total`:
  `<StatBreakdown accent="sky" icon={Sparkle} title="Rituel" note="Peut être lancé…" />`.
- **French copy**, ids/keys stay English. Labels short ("Maîtrise", not
  "Bonus de maîtrise appliqué").
- Non-numeric short values are fine as row values ("non", "Long repos", "1d4").
