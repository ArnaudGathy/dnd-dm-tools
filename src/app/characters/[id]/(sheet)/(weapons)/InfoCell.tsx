export default function InfoCell({
  name,
  value,
}: {
  name: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center">
      <span className="min-w-[85px] text-muted-foreground">{name}</span>
      <>{value}</>
    </div>
  );
}
