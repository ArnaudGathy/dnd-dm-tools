import { getSubClass } from "@/lib/external-apis/externalAPIs";

export const SpellSubClass = async ({
  subclassIndex,
}: {
  subclassIndex: string;
}) => {
  const subClass = await getSubClass(subclassIndex);

  if (!subClass || !subClass?.class) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span>{subClass.class.name}</span>
      <span className="text-sm text-muted-foreground">{`(${subClass.subclass_flavor}: ${subClass.name})`}</span>
    </div>
  );
};
