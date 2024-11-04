// src/pages/bachblueten-wizard/components/blueten-vorschau/index.tsx

import React from "react";
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
import { useFlowerSuggestions } from "../../hooks/use-flower-suggestions";
import { FlowerCard } from "./FlowerCard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const BluetenVorschau: React.FC = () => {
  const {
    selectedSymptoms,
    selectedEmotionGroups,
    selectedFlowers,
    selectFlower,
    deselectFlower,
  } = useWizardContext();

  const { bachFlowers, symptoms, loading, error } = useWizardData();

  const { priorityGroups, statistics } = useFlowerSuggestions(
    bachFlowers,
    symptoms,
    selectedEmotionGroups,
    selectedSymptoms,
  );
  const handleFlowerSelection = (flowerId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (selectedFlowers.includes(flowerId)) {
      deselectFlower(flowerId);
    } else if (selectedFlowers.length < 7) {
      selectFlower(flowerId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
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

  if (!selectedSymptoms.length) {
    return (
      <Alert>
        <AlertDescription>
          Bitte wähle zuerst einige Symptome aus, um passende Bachblüten zu
          finden.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Passende Bachblüten</h2>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-5 w-5 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Wähle 4-7 Blüten aus, die dich besonders ansprechen. Eine
                ausgewogene Mischung verschiedener Blüten ist empfehlenswert.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-gray-600">
          Basierend auf deinen ausgewählten Symptomen haben wir folgende
          Bachblüten für dich zusammengestellt. Die Auswahl ist nach Relevanz
          geordnet.
        </p>
      </div>

      <ScrollArea className="pr-4">
        <div className="space-y-8">
          {/* Stark empfohlene Blüten */}
          {priorityGroups.highPriority.length > 0 && (
            <section className="px-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Stark empfohlene Blüten
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {priorityGroups.highPriority.map(
                  ({ flower, scores, matchedSymptoms }) => (
                    <div
                      key={flower.id}
                      className={cn(
                        "relative rounded-lg overflow-hidden",
                        selectedFlowers.includes(flower.id) &&
                          "ring-2 ring-primary",
                      )}
                    >
                      <FlowerCard
                        flower={flower}
                        scores={scores}
                        matchedSymptoms={matchedSymptoms}
                        priority="high"
                        isSelected={selectedFlowers.includes(flower.id)}
                        onSelect={(e) => handleFlowerSelection(flower.id, e)}
                      />
                      {selectedFlowers.includes(flower.id) && (
                        <div className="absolute top-2 right-2 z-10">
                          <Badge variant="secondary">Ausgewählt</Badge>
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            </section>
          )}

          {/* Empfohlene Blüten */}
          {priorityGroups.mediumPriority.length > 0 && (
            <section className="px-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Empfohlene Blüten
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {priorityGroups.mediumPriority.map(
                  ({ flower, scores, matchedSymptoms }) => (
                    <div
                      key={flower.id}
                      className={cn(
                        "relative rounded-lg overflow-hidden",
                        selectedFlowers.includes(flower.id) &&
                          "ring-2 ring-primary",
                      )}
                    >
                      <FlowerCard
                        flower={flower}
                        scores={scores}
                        matchedSymptoms={matchedSymptoms}
                        priority="medium"
                        isSelected={selectedFlowers.includes(flower.id)}
                        onSelect={(e) => handleFlowerSelection(flower.id, e)}
                      />
                      {selectedFlowers.includes(flower.id) && (
                        <div className="absolute top-2 right-2 z-10">
                          <Badge variant="secondary">Ausgewählt</Badge>
                        </div>
                      )}
                    </div>
                  ),
                )}
                {/* {priorityGroups.mediumPriority.map( */}
                {/*   ({ flower, scores, matchedSymptoms }) => ( */}
                {/*     <FlowerCard */}
                {/*       key={flower.id} */}
                {/*       flower={flower} */}
                {/*       scores={{ */}
                {/*         primarySymptomMatch: scores.primarySymptomMatch, */}
                {/*         emotionalGroupMatch: scores.emotionalGroupMatch, */}
                {/*         symptomGroupCoverage: scores.symptomGroupCoverage, */}
                {/*         total: scores.total, */}
                {/*       }} */}
                {/*       matchedSymptoms={matchedSymptoms} */}
                {/*       priority="medium" */}
                {/*       isSelected={selectedFlowers.includes(flower.id)} */}
                {/*       onSelect={() => */}
                {/*         selectedFlowers.includes(flower.id) */}
                {/*           ? deselectFlower(flower.id) */}
                {/*           : selectFlower(flower.id) */}
                {/*       } */}
                {/*     /> */}
                {/*   ), */}
                {/* )} */}
              </div>
            </section>
          )}

          {/* Weitere passende Blüten */}
          {priorityGroups.additionalOptions.length > 0 && (
            <section className="px-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Weitere passende Blüten
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {priorityGroups.additionalOptions.map(
                  ({ flower, scores, matchedSymptoms }) => (
                    <div
                      key={flower.id}
                      className={cn(
                        "relative rounded-lg overflow-hidden",
                        selectedFlowers.includes(flower.id) &&
                          "ring-2 ring-primary",
                      )}
                    >
                      <FlowerCard
                        flower={flower}
                        scores={scores}
                        matchedSymptoms={matchedSymptoms}
                        priority="medium"
                        isSelected={selectedFlowers.includes(flower.id)}
                        onSelect={(e) => handleFlowerSelection(flower.id, e)}
                      />
                      {selectedFlowers.includes(flower.id) && (
                        <div className="absolute top-2 right-2 z-10">
                          <Badge variant="secondary">Ausgewählt</Badge>
                        </div>
                      )}
                    </div>
                  ),
                )}
                {/* {priorityGroups.additionalOptions.map( */}
                {/*   ({ flower, scores, matchedSymptoms }) => ( */}
                {/*     <FlowerCard */}
                {/*       key={flower.id} */}
                {/*       flower={flower} */}
                {/*       scores={{ */}
                {/*         primarySymptomMatch: scores.primarySymptomMatch, */}
                {/*         emotionalGroupMatch: scores.emotionalGroupMatch, */}
                {/*         symptomGroupCoverage: scores.symptomGroupCoverage, */}
                {/*         total: scores.total, */}
                {/*       }} */}
                {/*       matchedSymptoms={matchedSymptoms} */}
                {/*       priority="low" */}
                {/*       isSelected={selectedFlowers.includes(flower.id)} */}
                {/*       onSelect={() => */}
                {/*         selectedFlowers.includes(flower.id) */}
                {/*           ? deselectFlower(flower.id) */}
                {/*           : selectFlower(flower.id) */}
                {/*       } */}
                {/*     /> */}
                {/*   ), */}
                {/* )} */}
              </div>
            </section>
          )}
        </div>
      </ScrollArea>

      {/* Auswahl-Status */}
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

export default BluetenVorschau;
