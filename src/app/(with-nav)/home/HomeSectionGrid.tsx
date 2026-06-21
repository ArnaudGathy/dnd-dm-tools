import DmToolLinkCard from "@/app/(with-nav)/dm-tools/DmToolLinkCard";
import { HomeSection } from "@/app/(with-nav)/home/homeSections";

export default function HomeSectionGrid({
  title,
  sections,
}: {
  title: string;
  sections: HomeSection[];
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      <div className="sm:grid-cols-2 lg:grid-cols-3 grid grid-cols-1 gap-4">
        {sections.map((section) => (
          <DmToolLinkCard key={section.to} {...section} />
        ))}
      </div>
    </section>
  );
}
