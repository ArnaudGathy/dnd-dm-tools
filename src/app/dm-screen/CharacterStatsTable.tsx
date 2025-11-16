import { getTotalAC } from "@/utils/stats/ac";
import { DMScreenCharacter } from "@/lib/api/characters";
import { getSaveDC } from "@/utils/stats/classSpecific";
import { getPassivePerception } from "@/utils/stats/skills";
import SimpleTable from "@/app/dm-screen/SimpleTable";
import TableTitle from "@/app/dm-screen/TableTitle";

export default function CharacterStatsTable({ characters }: { characters: DMScreenCharacter[] }) {
  return (
    <div className="flex flex-col gap-2">
      <TableTitle>Personnages</TableTitle>
      <SimpleTable columns={["", "CA", "PV", "DD", "PP"]}>
        {characters.map((character) => {
          const { total: AC } = getTotalAC(character);
          const saveDC = getSaveDC(character);

          return (
            <tr key={character.id}>
              <td>{character.name}</td>
              <td>{AC}</td>
              <td>{character.maximumHP}</td>
              <td>{saveDC}</td>
              <td>{getPassivePerception(character)}</td>
            </tr>
          );
        })}
      </SimpleTable>
    </div>
  );
}
