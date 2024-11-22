import React from "react";
import { useWizardContext } from "../../hooks/use-wizard-context";
import { useWizardData } from "../../hooks/use-wizard-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const SecondarySymptomsAuswahl: React.FC = () => {
  const {
    selectedPrimarySymptoms,
    selectedSecondarySymptoms,
    selectSecondarySymptom,
    deselectSecondarySymptom,
    blutenCount,
  } = useWizardContext();

  const { secondarySymptoms, bachFlowers } = useWizardData();

  const filteredSymptoms = secondarySymptoms.filter((symptom) =>
    selectedPrimarySymptoms.includes(symptom.primarySymptomId),
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Sekundäre Symptome</h2>
      <p>
        Wähle die sekundären Symptome aus, die zu deiner Situation passen.
        Maximal {Math.min(blutenCount, 10)} Blüten.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSymptoms.map((symptom) => {
          const flower = bachFlowers.find(
            (flower) => flower.id === symptom.flowerId,
          );
          return (
            <Card
              key={symptom.id}
              className="p-4 cursor-pointer"
              onClick={() =>
                selectedSecondarySymptoms.includes(symptom.id)
                  ? deselectSecondarySymptom(symptom.id)
                  : selectSecondarySymptom(symptom.id)
              }
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{symptom.name}</h3>
                {selectedSecondarySymptoms.includes(symptom.id) && (
                  <Badge variant="secondary">Ausgewählt</Badge>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {symptom.description}
              </p>
              {flower && (
                <div className="mt-4">
                  <img
                    src={`/blossoms/${flower.name_english.toLowerCase()}.png`}
                    alt={flower.name_deutsch}
                    className="w-20 h-20 object-cover rounded-full mx-auto"
                  />
                  <p className="mt-2 text-center">{flower.name_deutsch}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
