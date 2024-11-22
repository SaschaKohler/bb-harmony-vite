// src/pages/bachblueten-wizard/components/blueten-vorschau/index.tsx

import React, { useEffect, useState } from "react";
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

interface WeightedSymptom {
  symptom: {
    id: string;
    name: string;
    emotion_category: string;
    description?: string;
  };
  weight: number;
}

interface FlowerSuggestion {
  flower: {
    id: string;
    name_german: string;
    name_latin: string | null;
    name_english: string;
  };
  scores: {
    primarySymptomMatch: number;
    secondarySymptomMatch: number;
    emotionalGroupMatch: number;
    symptomGroupCoverage: number;
    total: number;
  };
  matchedSymptoms: {
    primary: Array<{
      id: string;
      name: string;
      emotion_category: string;
      description?: string;
    }>;
    secondary: Array<{
      symptom: {
        id: string;
        name: string;
        emotion_category: string;
        description?: string;
      };
      weight: number;
    }>;
  };
}
export const BluetenVorschau: React.FC = () => {
  const {
    selectedSymptoms,
    selectedEmotionGroups,
    selectedFlowers,
    selectFlower,
    deselectFlower,
  } = useWizardContext();

  const { bachFlowers, symptoms, loading, error } = useWizardData();

  // useFlowerSuggestions direkt aufrufen (nicht in useEffect)
  const { priorityGroups, statistics } = useFlowerSuggestions(
    bachFlowers ?? [],
    symptoms ?? [],
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

  // Rendert eine Sektion mit Blüten einer bestimmten Priorität
  const renderFlowerSection = (
    title: string,
    flowers: FlowerSuggestion[],
    priority: "high" | "medium" | "low",
  ) => (
    <section className="px-2">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {flowers.map(({ flower, scores, matchedSymptoms }) => (
          <div
            key={flower.id}
            className={cn(
              "relative rounded-lg overflow-hidden",
              selectedFlowers.includes(flower.id) && "ring-2 ring-primary",
            )}
          >
            <FlowerCard
              flower={flower}
              scores={scores}
              matchedSymptoms={{
                primary: matchedSymptoms.primary,
                secondary: matchedSymptoms.secondary,
              }}
              priority={priority}
              isSelected={selectedFlowers.includes(flower.id)}
              onSelect={(e) => handleFlowerSelection(flower.id, e)}
            />
            {selectedFlowers.includes(flower.id) && (
              <div className="absolute top-2 right-2 z-10">
                <Badge variant="secondary">Ausgewählt</Badge>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );

  // Loading, Error und leere Zustände
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

  // Statistik für die Auswahl
  const getSelectionStats = () => {
    const selectedFlowerDetails = [
      ...priorityGroups.highPriority,
      ...priorityGroups.mediumPriority,
      ...priorityGroups.additionalOptions,
    ].filter((f) => selectedFlowers.includes(f.flower.id));

    return {
      totalScore: selectedFlowerDetails.reduce(
        (sum, f) => sum + f.scores.total,
        0,
      ),
      emotionalCoverage: new Set(
        selectedFlowerDetails.flatMap((f) => [
          ...f.matchedSymptoms.primary.map((s) => s.emotion_category),
          ...f.matchedSymptoms.secondary.map((s) => s.symptom.emotion_category),
        ]),
      ).size,
    };
  };

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
              <div className="space-y-2">
                <p>Wähle 4-7 Blüten aus, die dich besonders ansprechen.</p>
                <p className="text-sm text-gray-400">
                  Eine ausgewogene Mischung verschiedener Blüten ist
                  empfehlenswert.
                </p>
              </div>
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
          {priorityGroups.highPriority.length > 0 &&
            renderFlowerSection(
              "Stark empfohlene Blüten",
              priorityGroups.highPriority,
              "high",
            )}

          {/* Empfohlene Blüten */}
          {priorityGroups.mediumPriority.length > 0 &&
            renderFlowerSection(
              "Empfohlene Blüten",
              priorityGroups.mediumPriority,
              "medium",
            )}

          {/* Weitere passende Blüten */}
          {priorityGroups.additionalOptions.length > 0 &&
            renderFlowerSection(
              "Weitere passende Blüten",
              priorityGroups.additionalOptions,
              "low",
            )}
        </div>
      </ScrollArea>

      {/* Auswahl-Status */}
      {selectedFlowers.length > 0 && (
        <div className="sticky bottom-0 bg-white border-t shadow-lg p-4">
          <div className="max-w-4xl mx-auto">
            {/* Obere Zeile: Ausgewählte Blüten */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-primary/10">
                  {selectedFlowers.length} von 7 Blüten
                </Badge>
                {selectedFlowers.length > 7 && (
                  <Alert variant="warning" className="ml-2">
                    <AlertDescription>
                      Maximal 7 Blüten empfohlen
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            {/* Untere Zeile: Statistiken */}
            {selectedFlowers.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Gesamtrelevanz:</span>
                    <Badge variant="secondary">
                      {getSelectionStats().totalScore.toFixed(1)}
                    </Badge>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Emotionale Abdeckung:
                    </span>
                    <Badge variant="secondary">
                      {getSelectionStats().emotionalCoverage} Bereiche
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BluetenVorschau;
