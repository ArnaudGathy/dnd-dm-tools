import SimpleTable from "@/app/dm-screen/SimpleTable";
import TableTitle from "@/app/dm-screen/TableTitle";

const data = [
  {
    name: "1",
    description: "+2 échecs",
  },
  {
    name: "2-9",
    description: "+1 échec",
  },
  {
    name: "10-19",
    description: "+1 succès",
  },
  {
    name: "20",
    description: "+1 PV",
  },
];

export default function DeathSavingThrows() {
  return (
    <div className="flex flex-col gap-2">
      <TableTitle>Mort</TableTitle>
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
