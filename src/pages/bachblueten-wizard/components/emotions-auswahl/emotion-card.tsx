import React from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DBEmotion } from "../../types";

interface EmotionCardProps {
  emotion: DBEmotion;
  isSelected: boolean;
  intensity?: number;
  onSelect: () => void;
  onIntensityChange?: (value: number) => void;
  disabled?: boolean;
}

export const EmotionCard: React.FC<EmotionCardProps> = ({
  emotion,
  isSelected,
  intensity = 5,
  onSelect,
  onIntensityChange,
  disabled,
}) => {
  // Intensitätsstufen für bessere UX
  const getIntensityLabel = (value: number): string => {
    if (value <= 3) return "Leicht";
    if (value <= 7) return "Mittel";
    return "Stark";
  };

  // Farbintensität basierend auf Auswahlstatus
  const getColorStyle = () => {
    if (!emotion.color) return {};
    return {
      backgroundColor: isSelected ? `${emotion.color}15` : "transparent",
      borderColor: isSelected ? emotion.color : "transparent",
    };
  };

  return (
    <Card
      className={cn(
        "relative p-4 transition-all duration-200",
        "hover:shadow-md hover:transform hover:-translate-y-0.5",
        isSelected && "ring-2 ring-primary",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      )}
      style={getColorStyle()}
      onClick={() => !disabled && onSelect()}
      role="button"
      aria-pressed={isSelected}
      aria-disabled={disabled}
    >
      <div className="space-y-4">
        {/* Header mit Emotion Name und Info */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{emotion.name}</h3>
              {emotion.description && (
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-sm">{emotion.description}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Auswahlstatus und Farbindikator */}
          <div className="flex items-center gap-2">
            {isSelected && (
              <Badge variant="secondary" className="animate-in fade-in">
                <Check className="h-3 w-3 mr-1" />
                Ausgewählt
              </Badge>
            )}
            {emotion.color && (
              <div
                className="w-4 h-4 rounded-full border-2"
                style={{
                  backgroundColor: emotion.color,
                  borderColor: emotion.color,
                }}
              />
            )}
          </div>
        </div>

        {/* Beschreibung */}
        {emotion.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {emotion.description}
          </p>
        )}

        {/* Intensitätsregler (nur wenn ausgewählt) */}
        {isSelected && onIntensityChange && (
          <div className="pt-4 space-y-3 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Intensität</span>
              <Badge variant="outline" className="font-medium">
                {getIntensityLabel(intensity)}
              </Badge>
            </div>

            <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
              <Slider
                value={[intensity]}
                min={1}
                max={10}
                step={1}
                className="w-full"
                onValueChange={(value) => onIntensityChange(value[0])}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Disabled Overlay */}
      {disabled && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] rounded-lg flex items-center justify-center">
          <p className="text-sm text-muted-foreground bg-background/90 px-3 py-1 rounded-full">
            Maximale Auswahl erreicht
          </p>
        </div>
      )}
    </Card>
  );
};

// Für besseres Debug-Erlebnis
EmotionCard.displayName = "EmotionCard";

export default EmotionCard;
