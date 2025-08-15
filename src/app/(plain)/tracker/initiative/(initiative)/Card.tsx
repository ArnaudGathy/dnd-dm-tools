import { cn } from "@/lib/utils";
import styles from "@/app/(plain)/tracker/initiative/page.module.css";

export default function Card({
  children,
  isActive,
  className,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  index?: number;
  className?: string;
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
          "m-1 flex h-full items-center gap-4 rounded-lg",
          "border-2 border-neutral-700 p-2 text-neutral-700",
          {
            ["border-amber-800 p-2 text-amber-800"]: isActive,
          },
        )}
      >
        {children}
      </div>
    </div>
  );
}
