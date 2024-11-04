import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { EMOTION_GROUPS } from "../../constants/emotion-groups";

interface FlowerScore {
  primarySymptomMatch: number;
  emotionalGroupMatch: number;
  symptomGroupCoverage: number;
  total: number;
}

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
    name_latin: string;
    name_english: string;
    description?: string | null;
    flower_symptom_relations: Array<{
      symptom_id: string;
      is_primary: boolean;
    }>;
  };
  scores: FlowerScore;
  matchedSymptoms: MatchedSymptom[];
  priority: "high" | "medium" | "low";
  isSelected: boolean;
  onSelect: () => void;
}

export const FlowerCard: React.FC<FlowerCardProps> = ({
  flower,
  scores,
  matchedSymptoms,
  priority,
  isSelected,
  onSelect,
}) => {
  //
  const groupedSymptoms = useMemo(() => {
    const emotionGroups = [
      ...new Set(matchedSymptoms.map((s) => s.emotion_category)),
    ];

    return emotionGroups
      .map((groupName) => {
        const groupSymptoms = matchedSymptoms.filter(
          (s) => s.emotion_category === groupName,
        );

        // Bei medium/low priority nur sekundäre Symptome berücksichtigen
        if (priority !== "high") {
          const onlySecondarySymptoms = groupSymptoms.filter((symptom) =>
            flower.flower_symptom_relations.some(
              (rel) => rel.symptom_id === symptom.id && !rel.is_primary,
            ),
          );

          return {
            groupName,
            primarySymptoms: [],
            secondarySymptoms: onlySecondarySymptoms,
          };
        }

        // Bei high priority normale Aufteilung
        const primarySymptoms = groupSymptoms.filter((symptom) =>
          flower.flower_symptom_relations.some(
            (rel) => rel.symptom_id === symptom.id && rel.is_primary,
          ),
        );

        const secondarySymptoms = groupSymptoms.filter((symptom) =>
          flower.flower_symptom_relations.some(
            (rel) => rel.symptom_id === symptom.id && !rel.is_primary,
          ),
        );

        return {
          groupName,
          primarySymptoms,
          secondarySymptoms,
        };
      })
      .filter((group) =>
        // Filtere Gruppen ohne Symptome aus
        priority === "high"
          ? group.primarySymptoms.length > 0 ||
            group.secondarySymptoms.length > 0
          : group.secondarySymptoms.length > 0,
      );
  }, [matchedSymptoms, flower.flower_symptom_relations, priority]);

  return (
    <Card
      className={cn(
        "relative p-4 cursor-pointer transition-all duration-200",
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
                          key={symptom.id}
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
                      {secondarySymptoms.map((symptom) => (
                        <Badge
                          key={symptom.id}
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
