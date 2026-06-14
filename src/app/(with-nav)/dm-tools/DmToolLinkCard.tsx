import NextLink from "next/link";
import { ElementType } from "react";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DmToolLinkCard({
  to,
  label,
  description,
  icon: Icon,
  openInNewTab,
}: {
  to: string;
  label: string;
  description: string;
  icon: ElementType;
  openInNewTab?: boolean;
}) {
  return (
    <NextLink
      href={to}
      target={openInNewTab ? "_blank" : undefined}
      className="group block focus-visible:outline-none"
    >
      <Card className="h-full transition-colors hover:bg-muted/60 group-focus-visible:ring-2 group-focus-visible:ring-ring">
        <CardContent className="flex items-start gap-4 p-4">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Icon className="size-6" />
          </div>
          <div className="flex flex-col">
            <span className="flex items-center gap-1 font-semibold">
              {label}
              <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
            <span className="text-sm text-muted-foreground">{description}</span>
          </div>
        </CardContent>
      </Card>
    </NextLink>
  );
}
