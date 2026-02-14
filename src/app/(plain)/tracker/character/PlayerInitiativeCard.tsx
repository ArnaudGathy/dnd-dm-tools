import { cn } from "@/lib/utils";
import styles from "@/app/(plain)/tracker/character/page.module.css";
import { AnimatePresence, motion } from "framer-motion";

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
        "relative flex h-fit rounded-xl transition duration-500 ease-out",
        {
          ["translate-y-[35px]"]: isActive,
        },
        className,
      )}
    >
      <AnimatePresence mode="wait">
        {isNPCTurn ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute bottom-0 left-0 right-0 top-0 z-10 rounded-xl bg-black/60"
          />
        ) : null}
      </AnimatePresence>
      <div
        className={cn(
          "m-1 flex min-w-[160px] items-center justify-center gap-4 rounded-lg",
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
