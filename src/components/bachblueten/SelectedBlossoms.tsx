// src/components/bachblueten/SelectedBlossoms.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Blossom } from "@/lib/bachblueten/types";

interface SelectedBlossomsProps {
  blossoms: string[];
  onRemove: (blossom: string) => void;
  blossomData: Record<string, Blossom>;
  onConfirm: () => void;
  hasConfirmedInitial: boolean;
  maxBlossoms?: number;
  recommendedBlossoms?: number;
}

export const SelectedBlossoms: React.FC<SelectedBlossomsProps> = ({
  blossoms,
  onRemove,
  blossomData,
  onConfirm,
  hasConfirmedInitial,
  maxBlossoms = 10,
  recommendedBlossoms = 7,
}) => {
  const progress = (blossoms.length / maxBlossoms) * 100;
  const isOverRecommended = blossoms.length > recommendedBlossoms;
  const isAtMax = blossoms.length === maxBlossoms;
  const isOptimal = blossoms.length === recommendedBlossoms;
  const canAddMore =
    hasConfirmedInitial && blossoms.length >= recommendedBlossoms;

  const getProgressColor = () => {
    if (isOptimal) return "bg-violet-100";
    if (isOverRecommended) return "bg-amber-100";
    return "bg-violet-50";
  };

  return (
    <Card className="bg-white/50 backdrop-blur-sm border-gray-100">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Ausgewählte Blüten</CardTitle>
          <Badge
            variant={isOverRecommended ? "warning" : "secondary"}
            className={cn(
              "ml-2",
              isOverRecommended
                ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                : "bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200",
            )}
          >
            {blossoms.length}/{canAddMore ? maxBlossoms : recommendedBlossoms}
          </Badge>
        </div>
        {blossoms.length > 0 && (
          <div className="relative w-full h-2 bg-gray-100/50 rounded-full overflow-hidden">
            <Progress
              value={progress}
              className={cn(
                "transition-all duration-300",
                blossoms.length < recommendedBlossoms
                  ? "bg-violet-200 text-violet-200" // Noch nicht genug Blüten
                  : blossoms.length === recommendedBlossoms
                    ? "bg-emerald-200 text-emerald-200" // Optimale Anzahl
                    : "bg-amber-200 text-amber-200", // Über der empfohlenen Anzahl
              )}
            />
          </div>
        )}
      </CardHeader>

      <CardContent>
        {blossoms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
            <Info className="h-12 w-12 mb-2 opacity-50" />
            <p>Wählen Sie bis zu {recommendedBlossoms} Blüten aus</p>
            <p className="text-sm mt-1 text-gray-400">
              Optimal: {recommendedBlossoms} Blüten
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {blossoms.map((blossom) => {
                const blossomInfo = blossomData[blossom];
                return (
                  <div
                    key={blossom}
                    className={cn(
                      "group relative rounded-lg p-2",
                      "bg-violet-50/50 hover:bg-violet-50",
                      "border border-violet-100",
                      "transition-all duration-200",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 pr-2">
                        <p className="font-medium text-sm text-violet-700 truncate">
                          {blossom}
                        </p>
                        <p className="text-xs text-violet-600/70 truncate">
                          {blossomInfo.deutsch}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-6 w-6 p-0",
                          "opacity-0 group-hover:opacity-100",
                          "text-violet-500 hover:text-violet-700",
                          "hover:bg-violet-100/50",
                          "transition-all duration-200",
                        )}
                        onClick={() => onRemove(blossom)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {isOptimal && !hasConfirmedInitial && (
              <div className="mt-4 p-3 bg-violet-50 text-violet-700 rounded-md text-sm border border-violet-100">
                <p className="flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Sie haben die optimale Anzahl von {recommendedBlossoms} Blüten
                  erreicht. Bestätigen Sie Ihre Auswahl oder wählen Sie weitere
                  Blüten (max. {maxBlossoms}).
                </p>
              </div>
            )}

            {canAddMore && !isAtMax && (
              <div className="mt-4 p-3 bg-amber-50 text-amber-700 rounded-md text-sm border border-amber-100">
                <p className="flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Sie können noch bis zu {maxBlossoms - blossoms.length} weitere
                  Blüten hinzufügen. Bedenken Sie, dass weniger oft mehr ist.
                </p>
              </div>
            )}

            {isAtMax && (
              <div className="mt-4 p-3 bg-amber-50 text-amber-700 rounded-md text-sm border border-amber-100">
                <p className="flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Sie haben die maximale Anzahl von {maxBlossoms} Blüten
                  erreicht.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>

      {blossoms.length > 0 && (
        <CardFooter>
          <Button
            onClick={onConfirm}
            className={cn(
              "w-full transition-all duration-200",
              isOptimal || !isOverRecommended
                ? "bg-violet-100 hover:bg-violet-200 text-violet-700 border border-violet-200"
                : "bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200",
            )}
          >
            {isOptimal && !hasConfirmedInitial
              ? "Auswahl bestätigen und ggf. erweitern"
              : "Auswahl abschließen"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
