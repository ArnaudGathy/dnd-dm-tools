export default function HomeHeader({
  firstName,
  subtitle,
}: {
  firstName?: string | null;
  subtitle: string;
}) {
  return (
    <header className="flex flex-col gap-1">
      <h1 className="text-3xl font-bold tracking-tight">
        {firstName ? `Bonjour, ${firstName}` : "Bienvenue"}
      </h1>
      <p className="text-muted-foreground">{subtitle}</p>
    </header>
  );
}
