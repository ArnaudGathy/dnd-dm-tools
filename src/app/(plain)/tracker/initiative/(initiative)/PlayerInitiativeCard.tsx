import { cn } from "@/lib/utils";
import styles from "@/app/(plain)/tracker/initiative/page.module.css";

export default function PlayerInitiativeCard({
  children,
  isActive,
  className,
  isNPCTurn = false,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
  isNPCTurn?: boolean;
}) {
  return (
    <div
      className={cn(
        styles.container,
        "rounded-xl transition duration-500 ease-out",
        {
          ["translate-x-[35px]"]: isActive,
        },
        className,
      )}
    >
      <div
        className={cn(
          "m-1 flex items-center gap-4 rounded-lg",
          "border-2 border-neutral-700 p-2 text-neutral-700",
          {
            ["opacity-20"]: isNPCTurn,
            ["border-amber-800 p-2 text-amber-800"]: isActive,
          },
        )}
      >
        {children}
      </div>
    </div>
  );
}
