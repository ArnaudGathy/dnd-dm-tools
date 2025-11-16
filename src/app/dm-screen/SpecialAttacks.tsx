import SimpleTable from "@/app/dm-screen/SimpleTable";
import TableTitle from "@/app/dm-screen/TableTitle";

const data = [
  {
    name: "Dégats",
    description: "Jet d’attaque de corps à corps (FOR + Mast). Dégâts 1 + FOR",
  },
  {
    name: "Bousculade",
    description:
      "Repousser de 1 case et infliger état à terre. JdS FOR/DEX vs DD 8 + FOR + Mast. Catégorie de taille > de 1 max",
  },
  {
    name: "Lutte",
    description:
      "JdS FOR/DEX vs DD 8 + FOR + Mast. Action pour tenter un JdS et se libérer. Trainer = ½ vitesse de déplacement. Nécessite 1 main libre. Catégorie de taille > de 1 max",
  },
];

export default function SpecialAttacks() {
  return (
    <div className="flex flex-col gap-2">
      <TableTitle>Attaques à mains nues</TableTitle>
      <SimpleTable>
        {data.map(({ name, description }) => (
          <tr key={name}>
            <td>{name}</td>
            <td>{description}</td>
          </tr>
        ))}
      </SimpleTable>
    </div>
  );
}
