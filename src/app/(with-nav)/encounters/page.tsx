import { entries } from "remeda";
import { groupEncounters } from "@/utils/utils";
import Scenario from "@/app/(with-nav)/encounters/Scenario";
import { encounters } from "@/data/encounters";

const groupedEncounters = groupEncounters(encounters);

const Encounters = () => {
  return (
    <div className="flex flex-col">
      {entries(groupedEncounters).map(([scenario, encounters]) => (
        <Scenario key={scenario} scenarioName={scenario} encounters={encounters} />
      ))}
    </div>
  );
};

export default Encounters;
