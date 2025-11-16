import SimpleTable from "@/app/dm-screen/SimpleTable";
import TableTitle from "@/app/dm-screen/TableTitle";

const data = [
  {
    name: "A terre",
    effect: "Désavantage Attaque. Attaquant avantage Melee, désavantage Distance",
  },
  {
    name: "Agrippé",
    effect: "Vitesse 0. Désavantage attaque contre autre que agrippeur",
  },
  {
    name: "Assourdi",
    effect: "N'entend rien. Jet de caractéristique auditions ratés",
  },
  {
    name: "Aveuglé",
    effect: "Désavantage Attaque. Attaquant avantage Attaque",
  },
  {
    name: "Charmé",
    effect: "Ne peut pas infliger de dégâts au charmeur. Avantage social du charmeur",
  },
  {
    name: "Effrayé",
    effect: "Désavantage Attaque & Caract. si source in LoS. Peut pas approcher la source",
  },
  {
    name: "Empoisonné",
    effect: "Désavantage Attaque & Caract",
  },
  {
    name: "Entravé",
    effect: "Vitesse 0. Voir effet aveugle. Désavantage JdS DEX",
  },
  {
    name: "Ėpuisement",
    effect: "Voir table. 6 = mort",
  },
  {
    name: "Étourdi",
    effect: "Aussi effet Neutralisé. Rater JdS FOR et DEX. Attaquant avantage attaque",
  },
  {
    name: "Inconscient",
    effect: "Combine les effets : à terre et Paralysé",
  },
  {
    name: "Invisible",
    effect: "Avantage init. Avantage Attaque. Attaquant désavantage Attaque",
  },
  {
    name: "Neutralisé",
    effect: "Aucune action, bonus ou réaction. Concentration brisée. Muet. Désavantage init",
  },
  {
    name: "Paralysé",
    effect: "Aussi effet Étourdi. Vitesse 0. Critique automatique attaque Melee",
  },
  {
    name: "Pétrifié",
    effect: "Aussi effet Étourdi. Vitesse 0. Resistance à tous les dégâts. Immunité empoisonné.",
  },
];

export default function Conditions() {
  return (
    <div className="flex flex-col gap-2">
      <TableTitle>Conditions</TableTitle>
      <SimpleTable>
        {data.map(({ name, effect }) => (
          <tr key={name}>
            <td>{name}</td>
            <td>{effect}</td>
          </tr>
        ))}
      </SimpleTable>
    </div>
  );
}
