import { getAllRules } from "@/lib/external-apis/notion/rules";

export default async function RulesPage() {
  const fetchedRules = await getAllRules();
  return (
    <div className="space-y-4">
      <h1 className={"scroll-m-20 text-2xl font-bold tracking-tight"}>Liste des règles</h1>
      <ul className="flex flex-col gap-1">
        {fetchedRules.map((rule) => (
          <li key={rule.name} className="flex items-center gap-3">
            <span className="min-w-5">{rule.icon}</span>
            <a
              className="text-muted-foreground underline"
              target="_blank"
              rel="noreferrer"
              href={rule.url}
            >
              {rule.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
