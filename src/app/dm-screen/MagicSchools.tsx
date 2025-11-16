import SimpleTable from "@/app/dm-screen/SimpleTable";
import TableTitle from "@/app/dm-screen/TableTitle";

const data = [
  {
    name: "Abjuration",
    description: "Protéger, bloquer, neutraliser, défense",
  },
  {
    name: "Conjuration",
    description: "Invoquer, téléporter",
  },
  {
    name: "Divination",
    description: "Information futur / passé. Voir, révéler",
  },
  {
    name: "Enchantement",
    description: "Charmer, controller, mental, psychique",
  },
  {
    name: "Evocation",
    description: "Dégâts, destruction, élémentaire",
  },
  {
    name: "Illusion",
    description: "Faux, tromper sens",
  },
  {
    name: "Nécromancie",
    description: "Manipulation de la vie et des morts vivants",
  },
  {
    name: "Transmutation",
    description: "Altérer forme, taille, densité, vitesse. Transformer",
  },
];

export default function MagicSchools() {
  return (
    <div className="flex flex-col gap-2">
      <TableTitle>Écoles de magie</TableTitle>
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
