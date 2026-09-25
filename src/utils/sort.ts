// Postgres sorts `orderBy: { name: "asc" }` by byte order ("Trousse" before "potion", "É" after "Z").
// Use these for anything user-facing so ordering ignores case and accents.
const collator = new Intl.Collator("fr", { sensitivity: "base", numeric: true });

export const compareLocale = (a: string, b: string) => collator.compare(a, b);

export const sortByName = <T extends { name: string }>(items: T[]) =>
  items.toSorted((a, b) => compareLocale(a.name, b.name));
