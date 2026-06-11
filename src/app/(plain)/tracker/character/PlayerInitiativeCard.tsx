import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import styles from "@/app/(plain)/tracker/character/page.module.css";

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
      data-active={isActive}
      className={cn(
        "group relative h-14 min-w-0 max-w-[320px] flex-1 overflow-hidden rounded-lg",
        "border-2 border-stone-600 bg-zinc-900 transition-all duration-500 ease-out",
        {
          // mx-4 reserves the ~16px per side the scale transform grows into, so neighbors aren't covered
          "z-30 mx-4 translate-y-2 scale-110 border-white": isActive,
        },
        className,
      )}
    >
      {children}

      {/* Active player: pulsing white inset glow + recurring glint sweep — inset so nothing bleeds onto the chroma key */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-md opacity-0 transition-opacity duration-500",
          {
            [cn("opacity-100", styles.activeGlow)]: isActive,
          },
        )}
      >
        {isActive ? <div className={styles.activeGlint} /> : null}
      </div>

      {/* Dim overlay during enemy turns */}
      <AnimatePresence mode="wait">
        {isNPCTurn ? (
          <motion.div
            key="dim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-20 bg-black/55"
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
