import React from "react";
import { useWizardContext } from "../../hooks/use-wizard-context";
import { useWizardData } from "../../hooks/use-wizard-data";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

export const PrimarySymptomsAuswahl: React.FC = () => {
  const {
    selectedEmotions,
    selectedPrimarySymptoms,
    primarySymptomWeights,
    selectPrimarySymptom,
    deselectPrimarySymptom,
    setPrimarySymptomWeight,
  } = useWizardContext();

  const { symptoms } = useWizardData();

  const filteredSymptoms = symptoms.filter((symptom) =>
    selectedEmotions.some((emotionId) =>
      symptom.verwandteEmotionen.includes(emotionId),
    ),
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Primäre Symptome</h2>
      <p>
        Wähle die primären Symptome aus, die zu deiner Situation passen und
        bewerte deren Gewichtung.
      </p>
      <div className="flex flex-wrap gap-2">
        {filteredSymptoms.map((symptom) => (
          <Badge
            key={symptom.id}
            variant={
              selectedPrimarySymptoms.includes(symptom.id)
                ? "secondary"
                : "outline"
            }
            className="cursor-pointer"
            onClick={() =>
              selectedPrimarySymptoms.includes(symptom.id)
                ? deselectPrimarySymptom(symptom.id)
                : selectPrimarySymptom(symptom.id)
            }
          >
            {symptom.bezeichnung}
            {selectedPrimarySymptoms.includes(symptom.id) && (
              <div className="mt-2">
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[primarySymptomWeights[symptom.id] || 1]}
                  onValueChange={(value) =>
                    setPrimarySymptomWeight(symptom.id, value[0])
                  }
                  className="w-40"
                />
              </div>
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
};
