import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FlowerScore } from "../../hooks/use-flower-suggestions";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { EMOTION_GROUPS } from "../../constants/emotion-groups";

// interface FlowerScore {
//   primarySymptomMatch: number;
//   emotionalGroupMatch: number;
//   symptomGroupCoverage: number;
//   total: number;
// }

interface MatchedSymptom {
  id: string;
  name: string;
  emotion_category: string;
  description?: string;
}
interface FlowerCardProps {
  flower: {
    id: string;
    name_german: string;
    name_latin: string | null;
    name_english: string;
    flower_symptom_relations?: Array<{
      symptom_id: string;
      is_primary: boolean;
    }>;
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
  priority: "high" | "medium" | "low";
  isSelected: boolean;
  onSelect: (event: React.MouseEvent) => void;
}

// interface FlowerCardProps {
//   flower: {
//     id: string;
//     name_german: string;
//     name_latin: string;
//     name_english: string;
//     description?: string | null;
//   };
//   scores: {
//     primarySymptomMatch: number;
//     secondarySymptomMatch: number;
//     emotionalGroupMatch: number;
//     symptomGroupCoverage: number;
//     total: number;
//   };
//   matchedSymptoms: {
//     primary: Array<{
//       id: string;
//       name: string;
//       emotion_category: string;
//       description?: string;
//     }>;
//     secondary: Array<{
//       symptom: {
//         id: string;
//         name: string;
//         emotion_category: string;
//         description?: string;
//       };
//       weight: number;
//     }>;
//   };
//   priority: "high" | "medium" | "low";
//   isSelected: boolean;
//   onSelect: (event: React.MouseEvent) => void;
// }

export const FlowerCard: React.FC<FlowerCardProps> = ({
  flower,
  scores,
  matchedSymptoms,
  priority,
  isSelected,
  onSelect,
}) => {
  //
  // In der FlowerCard-Komponente vor dem useMemo
  console.log("FlowerCard Debug:", {
    flowerId: flower.id,
    flowerName: flower.name_german,
    priority,
    matchedSymptomsCount: {
      primary: matchedSymptoms.primary.length,
      secondary: matchedSymptoms.secondary.length,
    },
    symptomRelationsCount: flower.flower_symptom_relations?.length || 0,
    matchedSymptoms: {
      primary: matchedSymptoms.primary.map((s) => s.name),
      secondary: matchedSymptoms.secondary.map((s) => s.symptom.name),
    },
    flower_symptom_relations: flower.flower_symptom_relations?.map((rel) => ({
      symptom_id: rel.symptom_id,
      is_primary: rel.is_primary,
    })),
  });

  const groupedSymptoms = useMemo(() => {
    // Sammle alle einzigartigen Emotionsgruppen
    const emotionGroups = new Set([
      ...matchedSymptoms.primary.map((s) => s.emotion_category),
      ...matchedSymptoms.secondary.map((s) => s.symptom.emotion_category),
    ]);

    return Array.from(emotionGroups).map((groupName) => {
      return {
        groupName,
        primarySymptoms:
          priority === "high"
            ? matchedSymptoms.primary.filter(
                (s) => s.emotion_category === groupName,
              )
            : [],
        secondarySymptoms: matchedSymptoms.secondary
          .filter((s) => s.symptom.emotion_category === groupName)
          .sort((a, b) => b.weight - a.weight),
      };
    });
  }, [matchedSymptoms, priority]);

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all duration-200",
        "relative h-full", // Volle Höhe
        "flex flex-col", // Flexbox für gleichmäßige Verteilung
        "hover:shadow-lg hover:-translate-y-0.5",
        isSelected && "ring-2 ring-primary shadow-md bg-primary/5",
      )}
      onClick={onSelect}
    >
      {/* Auswahl-Badge */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-20">
          <Badge className="bg-primary text-white">Ausgewählt</Badge>
        </div>
      )}

      {/* Blütenbild */}
      <div className="relative aspect-square rounded-lg overflow-hidden">
        <img
          src={`/images/blossoms/${flower.name_english.toLowerCase().replace(/\s+/g, "_")}.png`}
          alt={flower.name_german}
          className="object-cover w-full h-full"
        />
        {isSelected && <div className="absolute inset-0 bg-primary/10" />}
      </div>

      {/* Blüten-Info */}
      <div className="space-y-4 mt-4">
        {/* Titel */}
        <div>
          <h3 className="font-semibold text-lg">{flower.name_german}</h3>
          <p className="text-sm text-gray-500 italic">{flower.name_latin}</p>
        </div>

        {/* Gefühlsgruppen und Symptome */}
        <div className="space-y-6">
          {groupedSymptoms.map(
            ({ groupName, primarySymptoms, secondarySymptoms }) => (
              <div key={groupName} className="space-y-3">
                {/* Gefühlsgruppe */}
                <div>
                  <Badge
                    className="font-medium"
                    style={{
                      backgroundColor: EMOTION_GROUPS[groupName].bgColor,
                      color: EMOTION_GROUPS[groupName].textColor,
                      borderColor: EMOTION_GROUPS[groupName].color,
                    }}
                  >
                    {groupName}
                  </Badge>
                </div>

                {/* Primäre Symptome nur bei high priority */}
                {priority === "high" && primarySymptoms.length > 0 && (
                  <div className="space-y-1 pl-2">
                    <p className="text-xs uppercase text-gray-500 font-medium">
                      Primär:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {primarySymptoms.map((symptom) => (
                        <Badge
                          key={`primary-${symptom.id}`}
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor: EMOTION_GROUPS[groupName].color,
                            color: EMOTION_GROUPS[groupName].textColor,
                          }}
                        >
                          {symptom.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sekundäre/Unterstützende Symptome */}
                {secondarySymptoms.length > 0 && (
                  <div className="space-y-1 pl-2">
                    <p className="text-xs uppercase text-gray-500 font-medium">
                      {priority === "high"
                        ? "Sekundär:"
                        : "Unterstützende Wirkung:"}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {secondarySymptoms.map(({ symptom, weight }) => (
                        <Badge
                          key={`secondary-${symptom.id}`}
                          variant="outline"
                          className="text-xs opacity-80"
                          style={{
                            borderColor: EMOTION_GROUPS[groupName].color,
                            color: EMOTION_GROUPS[groupName].textColor,
                          }}
                        >
                          {symptom.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ),
          )}
        </div>

        {/* Relevanz */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600">Relevanz</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1 text-xs">
                    {priority === "high" ? (
                      <>
                        <p>
                          Primäre Symptome:{" "}
                          {scores.primarySymptomMatch.toFixed(1)}
                        </p>
                        <p>
                          Emotionale Übereinstimmung:{" "}
                          {scores.emotionalGroupMatch.toFixed(1)}
                        </p>
                        <p>
                          Symptomgruppen-Abdeckung:{" "}
                          {scores.symptomGroupCoverage.toFixed(1)}
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          Emotionale Übereinstimmung:{" "}
                          {scores.emotionalGroupMatch.toFixed(1)}
                        </p>
                        <p>
                          Unterstützende Wirkung:{" "}
                          {scores.symptomGroupCoverage.toFixed(1)}
                        </p>
                      </>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="h-2 w-full max-w-[120px] bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-500",
                  isSelected ? "bg-primary" : "bg-primary/60",
                )}
                style={{
                  width: `${
                    ((priority === "high"
                      ? scores.total
                      : scores.emotionalGroupMatch +
                        scores.symptomGroupCoverage) /
                      (priority === "high" ? 15 : 10)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FlowerCard;
