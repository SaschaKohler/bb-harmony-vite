// src/pages/BachblutenRad.tsx
import React, { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HarmonyWheel } from "./components/harmony-wheel";
import { ColorSelector } from "./components/color-selector";
import { BlossomGrid } from "./components/blossom-grid";
import { SelectedBlossoms } from "./components/selected-blossoms";
import {
  FinalSelectionDialog,
  type FinalSelectionData,
} from "./components/final-selection-dialog";
import { toast } from "sonner";
import { useHarmonyWheel } from "@/hooks/useHarmonyWheel";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { Database } from "@/types/supabase";
import { Blossom } from "@/lib/bachblueten/types";

type ViewType = "wheel" | "colors";
type EmotionWithFlowers = Database["public"]["Tables"]["emotion"]["Row"] & {
  bach_flowers: Database["public"]["Tables"]["bach_flowers"]["Row"][];
};

const BachblutenRad = () => {
  const {
    emotions,
    loading,
    error,
    selectedEmotion,
    selectEmotion,
    getBlossomData,
  } = useHarmonyWheel();

  console.log("BachblutenRad render:", {
    hasSelectedEmotion: !!selectedEmotion,
    hasSelectEmotion: !!selectEmotion,
  }); // Debug Log

  const [selectedBlossoms, setSelectedBlossoms] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<ViewType>("wheel");
  const [hasConfirmedInitial, setHasConfirmedInitial] = useState(false);
  const [showFinalDialog, setShowFinalDialog] = useState(false);

  const handleEmotionClick = useCallback(
    (emotion: EmotionWithFlowers | null) => {
      console.log("handleEmotionClick called with:", emotion); // Debug Log
      selectEmotion(emotion);
    },
    [selectEmotion],
  );

  // Konvertiere Blüten-IDs in Blüten-Daten für die SelectedBlossoms
  const getSelectedBlossomsData = useCallback(() => {
    return selectedBlossoms.reduce(
      (acc, blossomId) => {
        const flower = getBlossomData(blossomId);
        if (flower) {
          acc[flower.id] = {
            englisch: flower.name_english,
            nummer: flower.number,
            deutsch: flower.name_german,
            affirmation: flower.affirmation,
            gruppe: flower.emotion_name,
          };
        }
        return acc;
      },
      {} as Record<string, Blossom>,
    );
  }, [selectedBlossoms, getBlossomData]);
  const handleBlossomSelect = useCallback(
    (blossomName: string) => {
      setSelectedBlossoms((prev) => {
        if (prev.includes(blossomName)) {
          const newSelection = prev.filter((b) => b !== blossomName);
          if (newSelection.length < 4 && prev.length >= 4) {
            toast.warning("Mindestanzahl beachten", {
              description:
                "Bitte wählen Sie mindestens 4 Blüten für eine wirksame Mischung.",
            });
          }
          return newSelection;
        }

        if (prev.length >= 7 && !hasConfirmedInitial) {
          toast.warning("Maximale Anzahl erreicht", {
            description:
              "Für eine optimale Wirkung sollten nicht mehr als 7 Blüten kombiniert werden.",
          });
          return prev;
        }

        if (prev.length === 3) {
          toast.success("Mindestanzahl erreicht", {
            description: "Sie haben die Mindestanzahl von 4 Blüten erreicht.",
          });
        } else if (prev.length === 6) {
          toast.info("Optimale Anzahl erreicht", {
            description:
              "Sie haben die empfohlene Höchstanzahl von 7 Blüten erreicht.",
          });
        }

        return [...prev, blossomName];
      });
    },
    [hasConfirmedInitial],
  );

  const handleBlossomRemove = useCallback((blossomId: string) => {
    setSelectedBlossoms((prev) => prev.filter((b) => b !== blossomId));
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedBlossoms.length === 7 && !hasConfirmedInitial) {
      setHasConfirmedInitial(true);
      toast.success("Auswahl bestätigt", {
        description:
          "Sie können jetzt bis zu 3 weitere Blüten hinzufügen oder die Auswahl abschließen.",
        duration: 5000,
      });
    } else {
      setShowFinalDialog(true);
    }
  }, [selectedBlossoms.length, hasConfirmedInitial]);

  const handleSaveFinalSelection = async (data: FinalSelectionData) => {
    try {
      // Hier würde die Supabase-Integration kommen
      console.log("Saving selection:", data);

      toast.success("Auswahl gespeichert", {
        description: `Die Auswahl für ${data.clientName} wurde erfolgreich gespeichert.`,
      });

      setSelectedBlossoms([]);
      selectEmotion(null);
      setHasConfirmedInitial(false);
    } catch (error) {
      toast.error("Fehler beim Speichern", {
        description:
          "Die Auswahl konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.",
      });
    }
  };

  const renderBlossomSelection = () => {
    console.log(
      "renderBlossomSelection called, selectedEmotion:",
      selectedEmotion,
    ); // Debug Log
    if (!selectedEmotion) return null;

    return (
      <div className="w-full">
        <h3 className="text-lg font-medium mb-2">{selectedEmotion.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {selectedEmotion.description}
        </p>
        <BlossomGrid
          blossoms={selectedEmotion.bach_flowers}
          selectedBlossoms={selectedBlossoms}
          onBlossomSelect={handleBlossomSelect}
          hasConfirmedInitial={hasConfirmedInitial}
          maxBlossoms={10}
          recommendedBlossoms={7}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full">
      <Card className="w-[90%] mx-auto">
        <CardHeader>
          <CardTitle>Bachblüten Harmonie-Rad</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="wheel"
            className="w-full"
            onValueChange={(v) => setActiveView(v as ViewType)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="wheel">Gefühlsgruppen</TabsTrigger>
              <TabsTrigger value="colors">Farbauswahl</TabsTrigger>
            </TabsList>

            <TabsContent value="wheel" className="mt-4">
              <div className="flex flex-col items-center space-y-6">
                <div className="w-full max-w-[600px] mx-auto">
                  <HarmonyWheel
                    className="mx-auto"
                    onSectorClick={handleEmotionClick}
                  />
                </div>
                <div className="w-full">
                  {console.log("About to render blossoms section")}{" "}
                  {/* Debug log */}
                  {renderBlossomSelection()}
                  {/* Direkt die Funktion aufrufen */}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="colors" className="mt-4">
              <div className="space-y-6">
                <ColorSelector
                  sectors={emotions}
                  onSectorClick={handleEmotionClick}
                  activeSector={selectedEmotion}
                />
                {renderBlossomSelection()}
              </div>
            </TabsContent>

            <div className="mt-6">
              <SelectedBlossoms
                blossoms={selectedBlossoms}
                onRemove={handleBlossomRemove}
                blossomData={getSelectedBlossomsData()}
                onConfirm={handleConfirm}
                hasConfirmedInitial={hasConfirmedInitial}
                maxBlossoms={10}
                recommendedBlossoms={7}
              />
            </div>
          </Tabs>
        </CardContent>
      </Card>
      <ErrorBoundary>
        <FinalSelectionDialog
          open={showFinalDialog}
          onOpenChange={setShowFinalDialog}
          selectedBlossoms={selectedBlossoms}
          blossomData={getSelectedBlossomsData()}
          onSave={handleSaveFinalSelection}
        />
      </ErrorBoundary>
    </div>
  );
};

export default BachblutenRad;
