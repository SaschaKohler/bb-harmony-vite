// src/pages/bachblueten-wizard/components/symptome-auswahl/index.tsx

import React from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useWizardContext } from "../../hooks/use-wizard-context";
import { useWizardData } from "../../hooks/use-wizard-data";
import { EMOTION_GROUPS } from "../../constants/emotion-groups";
import { cn } from "@/lib/utils";

export const SymptomeAuswahl: React.FC = () => {
  const {
    selectedEmotionGroups,
    selectedSymptoms,
    selectSymptom,
    deselectSymptom,
  } = useWizardContext();
  const { getSymptomsByEmotionGroup, loading, error } = useWizardData();

  // Früher Return wenn keine Emotionsgruppen ausgewählt sind
  if (!loading && selectedEmotionGroups.length === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            Welche dieser Symptome treffen auf dich zu?
          </h2>
          <p className="text-gray-600">
            Basierend auf deinen ausgewählten Gefühlsbereichen findest du hier
            spezifische Symptome. Wähle alle aus, die auf dich zutreffen.
          </p>
        </div>

        <Alert>
          <AlertDescription>
            Bitte wähle zuerst mindestens einen Gefühlsbereich aus.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          Welche dieser Symptome treffen auf dich zu?
        </h2>
        <p className="text-gray-600">
          Basierend auf deinen ausgewählten Gefühlsbereichen findest du hier
          spezifische Symptome. Wähle alle aus, die auf dich zutreffen.
        </p>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="space-y-8">
          {selectedEmotionGroups.map((groupName) => {
            const groupInfo = EMOTION_GROUPS[groupName];
            const symptoms = getSymptomsByEmotionGroup(groupName);

            if (symptoms.length === 0) return null;

            return (
              <div key={groupName} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{groupName}</h3>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: groupInfo.color }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {symptoms.map((symptom) => (
                    <Card
                      key={symptom.id}
                      className={cn(
                        "p-4 cursor-pointer transition-all duration-200",
                        selectedSymptoms.includes(symptom.id)
                          ? "ring-2 bg-primary/5"
                          : "hover:bg-gray-50",
                      )}
                      style={
                        {
                          "--ring-color": groupInfo.color,
                        } as React.CSSProperties
                      }
                      onClick={() => {
                        selectedSymptoms.includes(symptom.id)
                          ? deselectSymptom(symptom.id)
                          : selectSymptom(symptom.id);
                      }}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{symptom.name}</h4>
                          {selectedSymptoms.includes(symptom.id) && (
                            <Badge
                              style={{
                                backgroundColor: groupInfo.bgColor,
                                color: groupInfo.textColor,
                              }}
                            >
                              Ausgewählt
                            </Badge>
                          )}
                        </div>
                        {symptom.description && (
                          <p className="text-sm text-gray-600">
                            {symptom.description}
                          </p>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SymptomeAuswahl;
