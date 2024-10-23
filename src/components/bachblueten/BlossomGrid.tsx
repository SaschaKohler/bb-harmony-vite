// src/components/bachblueten/BlossomGrid.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Blossom } from "@/lib/bachblueten/types";

interface BlossomGridProps {
  blossoms: string[];
  selectedBlossoms: string[];
  onBlossomSelect: (blossom: string) => void;
  blossomData: Record<string, Blossom>;
  hasConfirmedInitial?: boolean;
  maxBlossoms?: number;
  recommendedBlossoms?: number;
}

export const BlossomGrid: React.FC<BlossomGridProps> = ({
  blossoms,
  selectedBlossoms,
  onBlossomSelect,
  blossomData,
  hasConfirmedInitial = false,
  maxBlossoms = 10,
  recommendedBlossoms = 7,
}) => {
  const isBlossomDisabled = (blossom: string) => {
    const isSelected = selectedBlossoms.includes(blossom);

    // Wenn die Blüte bereits ausgewählt ist, ist sie nie disabled
    if (isSelected) return false;

    // Wenn noch keine initiale Bestätigung erfolgt ist
    if (!hasConfirmedInitial) {
      return selectedBlossoms.length >= recommendedBlossoms;
    }

    // Nach der Bestätigung
    return selectedBlossoms.length >= maxBlossoms;
  };

  const getTooltipText = (blossom: string) => {
    const isSelected = selectedBlossoms.includes(blossom);

    if (isSelected) {
      return "Klicken zum Entfernen";
    }

    if (
      !hasConfirmedInitial &&
      selectedBlossoms.length >= recommendedBlossoms
    ) {
      return "Bitte bestätigen Sie erst Ihre aktuelle Auswahl";
    }

    if (hasConfirmedInitial && selectedBlossoms.length >= maxBlossoms) {
      return "Maximale Anzahl erreicht";
    }

    return blossomData[blossom].affirmation;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {blossoms.map((blossom) => {
        const blossomInfo = blossomData[blossom];
        const isSelected = selectedBlossoms.includes(blossom);
        const isDisabled = isBlossomDisabled(blossom);

        return (
          <TooltipProvider key={blossom}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isSelected ? "secondary" : "outline"}
                  className={`
                    h-24 flex flex-col items-center justify-center gap-1
                    ${isDisabled && !isSelected ? "opacity-50" : ""}
                    ${isSelected ? "ring-2 ring-primary" : ""}
                  `}
                  onClick={() => onBlossomSelect(blossom)}
                  disabled={isDisabled && !isSelected}
                >
                  <span className="text-sm font-medium">{blossom}</span>
                  <span className="text-xs text-muted-foreground">
                    {blossomInfo.deutsch}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px]">
                <p className="text-sm">{getTooltipText(blossom)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};
