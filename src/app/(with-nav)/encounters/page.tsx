import { entries } from "remeda";
import { groupEncounters, typedEncounters } from "@/utils/utils";
import Scenario from "@/app/(with-nav)/encounters/Scenario";

const groupedEncounters = groupEncounters(typedEncounters);

const Encounters = () => {
  return (
    <div className="flex flex-col">
      {entries(groupedEncounters).map(([scenario, encounters]) => (
        <Scenario
          key={scenario}
          scenarioName={scenario}
          encounters={encounters}
        />
      ))}
    </div>
  );
};

export default Encounters;
