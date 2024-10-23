// src/components/bachblueten/BlossomGrid.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

const buttonVariants = {
  default: cn(
    "bg-gray-50/80 hover:bg-gray-100/90",
    "text-gray-700",
    "border border-gray-100",
  ),
  selected: cn(
    "bg-violet-50 hover:bg-violet-100/90",
    "text-violet-700",
    "border border-violet-200",
    "ring-1 ring-violet-200",
  ),
  disabled: cn(
    "bg-gray-50/60",
    "text-gray-400",
    "border border-gray-100",
    "cursor-not-allowed",
  ),
};

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
    if (isSelected) return false;
    if (!hasConfirmedInitial) {
      return selectedBlossoms.length >= recommendedBlossoms;
    }
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
                  className={cn(
                    "h-24 w-full",
                    "flex flex-col items-center justify-center gap-1",
                    "transition-all duration-200",
                    "shadow-sm hover:shadow",
                    isDisabled
                      ? buttonVariants.disabled
                      : isSelected
                        ? buttonVariants.selected
                        : buttonVariants.default,
                  )}
                  onClick={() => onBlossomSelect(blossom)}
                  disabled={isDisabled && !isSelected}
                >
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isSelected ? "text-violet-700" : "text-gray-700",
                    )}
                  >
                    {blossom}
                  </span>
                  <span
                    className={cn(
                      "text-xs",
                      isSelected ? "text-violet-600/80" : "text-gray-500",
                    )}
                  >
                    {blossomInfo.deutsch}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className={cn(
                  "max-w-[200px]",
                  "bg-white/90 backdrop-blur-sm",
                  "border border-violet-100",
                )}
              >
                <p className="text-sm">{getTooltipText(blossom)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};
