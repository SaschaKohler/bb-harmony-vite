import React from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import type { DBEmotion } from "../../types";

interface EmotionCardProps {
  emotion: DBEmotion;
  isSelected: boolean;
  intensity?: number;
  onSelect: () => void;
  onIntensityChange?: (value: number) => void;
}

export const EmotionCard: React.FC<EmotionCardProps> = ({
  emotion,
  isSelected,
  intensity = 5,
  onSelect,
  onIntensityChange,
}) => {
  return (
    <Card
      className={`
        p-4 cursor-pointer transition-all duration-200 hover:shadow-md
        ${isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:bg-gray-50"}
      `}
      onClick={onSelect}
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{emotion.name}</h3>
          {emotion.description && (
            <p className="text-sm text-gray-600 mt-1">{emotion.description}</p>
          )}
        </div>

        {isSelected && onIntensityChange && (
          <div className="pt-2 space-y-2">
            <label className="text-sm text-gray-600 block">
              Intensität: {intensity}
            </label>
            <Slider
              value={[intensity]}
              min={1}
              max={10}
              step={1}
              className="w-full"
              onValueChange={(value) => onIntensityChange(value[0])}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {emotion.color && (
          <div
            className="w-4 h-4 rounded-full absolute top-4 right-4"
            style={{ backgroundColor: emotion.color }}
          />
        )}
      </div>
    </Card>
  );
};

EmotionCard.displayName = "EmotionCard";
