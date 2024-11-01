import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DBEmotion } from "../../types";

interface SymptomCardProps {
  id: string;
  bezeichnung: string;
  beschreibung: string;
  isSelected: boolean;
  verwandteEmotionen: DBEmotion[];
  onSelect: () => void;
}

export const SymptomCard: React.FC<SymptomCardProps> = ({
  bezeichnung,
  beschreibung,
  isSelected,
  verwandteEmotionen,
  onSelect,
}) => {
  return (
    <Card
      className={`
        p-4 cursor-pointer transition-all duration-200 hover:shadow-md
        ${isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:bg-gray-50"}
      `}
      onClick={onSelect}
      role="button"
      aria-pressed={isSelected}
    >
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {bezeichnung}
            {isSelected && (
              <Badge variant="secondary" className="ml-2">
                Ausgewählt
              </Badge>
            )}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{beschreibung}</p>
        </div>

        {verwandteEmotionen.length > 0 && (
          <div className="pt-2">
            <p className="text-xs text-gray-500 mb-1">Verwandte Emotionen:</p>
            <div className="flex flex-wrap gap-1">
              {verwandteEmotionen.map((emotion) => (
                <Badge
                  key={emotion.id}
                  variant="outline"
                  className="text-xs"
                  style={{
                    borderColor: emotion.color || undefined,
                    color: emotion.color || undefined,
                  }}
                >
                  {emotion.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

SymptomCard.displayName = "SymptomCard";
