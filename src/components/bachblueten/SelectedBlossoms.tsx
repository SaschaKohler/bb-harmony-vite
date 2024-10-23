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
  const canAddMore =
    hasConfirmedInitial && blossoms.length >= recommendedBlossoms;

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Ausgewählte Blüten</CardTitle>
          <Badge
            variant={isOverRecommended ? "warning" : "secondary"}
            className="ml-2"
          >
            {blossoms.length}/{canAddMore ? maxBlossoms : recommendedBlossoms}
          </Badge>
        </div>
        {blossoms.length > 0 && (
          <Progress
            value={progress}
            className={isOverRecommended ? "text-amber-500" : ""}
          />
        )}
      </CardHeader>

      <CardContent>
        {blossoms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <Info className="h-12 w-12 mb-2 opacity-50" />
            <p>Wählen Sie bis zu {recommendedBlossoms} Blüten aus</p>
            <p className="text-sm mt-1">
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
                    className="group relative bg-muted/50 rounded-lg p-2 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 pr-2">
                        <p className="font-medium truncate">{blossom}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {blossomInfo.deutsch}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onRemove(blossom)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {blossoms.length === recommendedBlossoms &&
              !hasConfirmedInitial && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/50 text-green-900 dark:text-green-100 rounded-md text-sm">
                  <p className="flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Sie haben die optimale Anzahl von {recommendedBlossoms}{" "}
                    Blüten erreicht. Bestätigen Sie Ihre Auswahl oder wählen Sie
                    weitere Blüten (max. {maxBlossoms}).
                  </p>
                </div>
              )}

            {canAddMore && !isAtMax && (
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-100 rounded-md text-sm">
                <p className="flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Sie können noch bis zu {maxBlossoms - blossoms.length} weitere
                  Blüten hinzufügen. Bedenken Sie, dass weniger oft mehr ist.
                </p>
              </div>
            )}

            {isAtMax && (
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-100 rounded-md text-sm">
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
            className="w-full"
            onClick={onConfirm}
            variant={isOverRecommended ? "secondary" : "default"}
          >
            {blossoms.length === recommendedBlossoms && !hasConfirmedInitial
              ? "Auswahl bestätigen und ggf. erweitern"
              : "Auswahl abschließen"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
