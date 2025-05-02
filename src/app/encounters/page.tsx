import { entries } from "remeda";
import { groupEncounters, typedEncounters } from "@/utils/utils";
import Scenario from "@/app/encounters/Scenario";

const groupedEncounters = groupEncounters(typedEncounters);

const inactiveCampaigns = ["Les dragons de l'île aux tempêtes"];
for (const campaign of inactiveCampaigns) {
  delete groupedEncounters[campaign];
}

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
