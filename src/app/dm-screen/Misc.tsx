import SimpleTable from "@/app/dm-screen/SimpleTable";
import TableTitle from "@/app/dm-screen/TableTitle";

const data = [
  {
    name: "Concentration",
    description: "DD : 10 + ½ dégâts subits",
  },
  {
    name: "Épuisement",
    description: "-2 jets & -1 case / lvl. -1 / long repos",
  },
  {
    name: "Saut longueur",
    description: "30cm * val FOR. élan 1c ou ½",
  },
  {
    name: "Saut hauteur",
    description: "90cm + (30cm * mod FOR)",
  },
];

export default function Misc() {
  return (
    <div className="flex flex-col gap-2">
      <TableTitle>Autres</TableTitle>
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
