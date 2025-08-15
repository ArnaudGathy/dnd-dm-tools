import { cn } from "@/lib/utils";
import styles from "@/app/(plain)/tracker/initiative/page.module.css";

export default function Hexagon({
  children,
  isActive,
}: {
  children?: React.ReactNode;
  isActive?: boolean;
}) {
  return (
    <div
      className={cn(
        styles.hexagonContainer,
        "relative flex w-12 items-center justify-center",
      )}
    >
      <div className="text-xl font-bold">{children}</div>
      <div
        className={cn(
          styles.hexagon,
          "absolute bottom-0 left-0 right-0 top-0 w-12 bg-neutral-700",
          {
            ["bg-amber-800"]: isActive,
          },
        )}
      />
    </div>
  );
}
