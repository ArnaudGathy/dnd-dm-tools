import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import styles from "../page.module.css";
import { shuffle } from "remeda";

const facts = [
  "Les objets magiques légendaires ont parfois autant de personnalité et de caprices que les aventuriers qui les manient.",
  "Un barde inspiré peut changer l’issue d’un combat ... ou simplement jouer du luth en arrière-plan pour la bande-son.",
  "Un DM qui sourit avant de lancer les dés n’est jamais un bon signe.",
  "Les coffres piégés ne sont pas toujours piégés... mais les joueurs expérimentés ne prennent jamais ce risque.",
  "Un pirate, au fond, c'est peut-être juste un bon gars.",
  "Un 20 naturel sur une attaque à mains nues peut transformer une poignée de main en légende locale.",
  "Les moines de haut niveau peuvent courir sur l’eau... ce qui rend les batailles navales étrangement moins navales.",
  "Un donjon sans pièges est parfois plus inquiétant qu’un donjon plein de pièges.",
  "La moitié des combats de D&D ne commencent pas par la haine ... mais par une mauvaise interprétation d’un geste.",
  "Un groupe sans roublard finira toujours par regretter l’absence d’un roublard.",
  "Le premier plan d’un barbare, c’est toujours de foncer.",
  "Le DM passe des heures a créer des personnages, pour que les joueurs finissent toujours par s'attacher aux PNJ sans importance.",
  "Le jet de perception raté, sponsor des ambuscades depuis 1974.",
  "Un bon plan doit toujours être plus compliqué que nécessaire.",
  "Les familiers vivent moins longtemps que la patience du DM.",
  "Si un Roublard trouve une porte fermée, il essaiera toujours de la crocheter avant d'essayer de l'ouvrir.",
];

export default function DidYouKnow() {
  const interval = 15000;
  const [current, setCurrent] = React.useState<string | null>(null);
  const [queue, setQueue] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (!facts || facts.length === 0) {
      setCurrent(null);
      setQueue([]);
      return;
    }
    if (facts.length === 1) {
      setCurrent(facts[0]);
      setQueue([]);
      return;
    }
    const order = shuffle(facts);
    setCurrent(order[0]);
    setQueue(order.slice(1));
  }, []);

  const nextFact = React.useCallback(() => {
    if (!facts || facts.length === 0) return;
    if (facts.length === 1) return; // nothing to rotate

    if (queue.length > 0) {
      const [next, ...rest] = queue;
      setCurrent(next);
      setQueue(rest);
      return;
    }

    const remaining = facts.filter((f) => f !== current);
    const newOrder = shuffle(remaining);
    setCurrent(newOrder[0]);
    setQueue(newOrder.slice(1));
  }, [queue, current]);

  React.useEffect(() => {
    if (!current) return;
    const id = setInterval(
      () => {
        nextFact();
      },
      Math.max(1000, interval),
    );
    return () => clearInterval(id);
  }, [current, interval, nextFact]);

  if (!facts || facts.length === 0) {
    return null;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {current && (
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <div
            className={cn(
              styles.container,
              "flex flex-col gap-4 rounded-xl border-2 border-amber-800 p-4 text-amber-800",
            )}
          >
            <div className="text-3xl font-semibold tracking-tight">
              Le saviez-vous ?
            </div>

            <span className="text-2xl">{current}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
