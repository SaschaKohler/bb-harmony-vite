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
import type { Database } from "@/types/supabase";

type BachFlower = Database["public"]["Tables"]["bach_flowers"]["Row"];

interface BlossomGridProps {
  blossoms: BachFlower[];
  selectedBlossoms: string[];
  onBlossomSelect: (blossomId: string) => void;
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

const getBlossomImagePath = (nameEnglish: string) => {
  const imageName = nameEnglish.toLowerCase().replace(/\s+/g, "_");
  return `/src/assets/blossoms/${imageName}.png`;
};

export const BlossomGrid: React.FC<BlossomGridProps> = ({
  blossoms,
  selectedBlossoms,
  onBlossomSelect,
  hasConfirmedInitial = false,
  maxBlossoms = 10,
  recommendedBlossoms = 7,
}) => {
  const isBlossomDisabled = (blossomId: string) => {
    const isSelected = selectedBlossoms.includes(blossomId);
    if (isSelected) return false;
    if (!hasConfirmedInitial) {
      return selectedBlossoms.length >= recommendedBlossoms;
    }
    return selectedBlossoms.length >= maxBlossoms;
  };

  console.log("BlossomGrid Props:", {
    blossoms,
    selectedBlossoms,
  });

  const getTooltipText = (blossom: BachFlower) => {
    const isSelected = selectedBlossoms.includes(blossom.id);
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
    return blossom.affirmation;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {blossoms.map((blossom) => {
        const isSelected = selectedBlossoms.includes(blossom.id);
        const isDisabled = isBlossomDisabled(blossom.id);
        const imagePath = getBlossomImagePath(blossom.name_english);

        return (
          <TooltipProvider key={blossom.id}>
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
                  onClick={() => onBlossomSelect(blossom.id)}
                  disabled={isDisabled && !isSelected}
                >
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isSelected ? "text-violet-700" : "text-gray-700",
                    )}
                  >
                    {blossom.name_english} Nr.{blossom.number}
                  </span>
                  <span
                    className={cn(
                      "text-xs",
                      isSelected ? "text-violet-600/80" : "text-gray-500",
                    )}
                  >
                    {blossom.name_german}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className={cn(
                  "flex flex-col items-center gap-2 p-2",
                  "max-w-[250px]",
                  "bg-white/90 backdrop-blur-sm",
                  "border border-violet-100",
                )}
              >
                <img
                  src={imagePath}
                  alt={`${blossom.name_english} Blüte`}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <p className="text-sm">{blossom.affirmation}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};
