import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useWizardContext } from "../../hooks/use-wizard-context";
import { useWizardData } from "../../hooks/use-wizard-data";
import { EMOTION_GROUPS } from "../../constants/emotion-groups";

export const BluetenVorschau: React.FC = () => {
  const {
    selectedSymptoms,
    selectedEmotionGroups,
    selectedFlowers,
    selectFlower,
    deselectFlower,
  } = useWizardContext();
  const { bachFlowers, symptoms } = useWizardData();

  // Berechne die vorgeschlagenen Blüten basierend auf Symptomen
  const suggestedFlowers = useMemo(() => {
    if (!selectedSymptoms.length) return [];

    return bachFlowers
      .map((flower) => {
        // Berechne Relevanz-Score für jede Blüte
        const score = selectedSymptoms.reduce((total, symptomId) => {
          const symptom = symptoms.find((s) => s.id === symptomId);
          if (!symptom) return total;

          const isDirectMatch = flower.flower_symptom_relations.some(
            (rel) => rel.symptom_id === symptomId && rel.is_primary,
          );
          const isEmotionMatch = selectedEmotionGroups.includes(
            symptom.emotion_category,
          );

          return total + (isDirectMatch ? 2 : 0) + (isEmotionMatch ? 1 : 0);
        }, 0);

        return { ...flower, relevanceScore: score };
      })
      .filter((flower) => flower.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 12); // Zeige maximal 12 Vorschläge
  }, [bachFlowers, selectedSymptoms, selectedEmotionGroups, symptoms]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Passende Bachblüten</h2>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-5 w-5 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Wähle die Blüten aus, die dich besonders ansprechen. Eine finale
                Mischung sollte 4-7 Blüten enthalten.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        <p className="text-gray-600">
          Basierend auf deinen Symptomen haben wir diese Bachblüten für dich
          ausgewählt. Schaue dir die Bilder und Beschreibungen an und wähle die
          Blüten, die dich intuitiv ansprechen.
        </p>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestedFlowers.map((flower) => {
            const isSelected = selectedFlowers.includes(flower.id);
            const mainSymptoms = flower.flower_symptom_relations
              .filter((rel) => rel.is_primary)
              .map((rel) => symptoms.find((s) => s.id === rel.symptom_id))
              .filter(Boolean);

            return (
              <Card
                key={flower.id}
                className={cn(
                  "p-4 cursor-pointer transition-all duration-200",
                  "hover:shadow-md hover:transform hover:-translate-y-0.5",
                  isSelected && "ring-2 ring-primary bg-primary/5",
                )}
                onClick={() => {
                  isSelected
                    ? deselectFlower(flower.id)
                    : selectFlower(flower.id);
                }}
              >
                <div className="space-y-4">
                  {/* Blütenbild */}
                  <div className="relative aspect-square rounded-lg overflow-hidden">
                    <img
                      src={`/blossoms/${flower.name_english.toLowerCase()}.png`}
                      alt={flower.name_german}
                      className="object-cover w-full h-full"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                        <Badge variant="secondary">Ausgewählt</Badge>
                      </div>
                    )}
                  </div>

                  {/* Blüten-Info */}
                  <div>
                    <h3 className="font-semibold text-lg">
                      {flower.name_german}
                    </h3>
                    <p className="text-sm text-gray-500 italic">
                      {flower.name_latin}
                    </p>
                  </div>

                  {/* Hauptsymptome */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">
                      Hauptsymptome:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {mainSymptoms.map(
                        (symptom) =>
                          symptom && (
                            <Badge
                              key={symptom.id}
                              variant="outline"
                              className="text-xs"
                              style={{
                                backgroundColor: `${EMOTION_GROUPS[symptom.emotion_category].bgColor}`,
                                color:
                                  EMOTION_GROUPS[symptom.emotion_category]
                                    .textColor,
                              }}
                            >
                              {symptom.name}
                            </Badge>
                          ),
                      )}
                    </div>
                  </div>

                  {/* Kurzbeschreibung */}
                  {flower.description && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {flower.description}
                    </p>
                  )}

                  {/* Relevanz-Indikator */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${(flower.relevanceScore / 3) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">Relevanz</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      {selectedFlowers.length > 0 && (
        <div className="sticky bottom-0 p-4 bg-white border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedFlowers.length} von maximal 7 Blüten ausgewählt
            </span>
            {selectedFlowers.length > 7 && (
              <Alert variant="warning" className="text-sm">
                <AlertDescription>
                  Es werden maximal 7 Blüten empfohlen
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
