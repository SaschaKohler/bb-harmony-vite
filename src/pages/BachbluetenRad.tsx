// src/pages/BachblutenRad.tsx
import React, { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HarmonyWheel } from "@/components/bachblueten/HarmonyWheel";
import { ColorSelector } from "@/components/bachblueten/ColorSelector";
import { BlossomGrid } from "@/components/bachblueten/BlossomGrid";
import { SelectedBlossoms } from "@/components/bachblueten/SelectedBlossoms";
import { sectors, blossomData } from "@/lib/bachblueten/data";
import { toast } from "sonner";
import type { Sector } from "@/lib/bachblueten/types";

type ViewType = "wheel" | "colors";

const BachbluetenRad = () => {
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [selectedBlossoms, setSelectedBlossoms] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<ViewType>("wheel");
  const [hasConfirmedInitial, setHasConfirmedInitial] = useState(false);

  const handleSectorClick = useCallback((sector: Sector) => {
    setSelectedSector((prev) => (prev?.group === sector.group ? null : sector));
  }, []);

  const handleBlossomSelect = useCallback((blossom: string) => {
    setSelectedBlossoms((prev) => {
      // Wenn die Blüte bereits ausgewählt ist, entferne sie
      if (prev.includes(blossom)) {
        const newSelection = prev.filter((b) => b !== blossom);
        // Prüfe ob die Mindestanzahl noch erreicht ist
        if (newSelection.length < 4 && prev.length >= 4) {
          toast.warning("Mindestanzahl beachten", {
            description:
              "Bitte wählen Sie mindestens 4 Blüten für eine wirksame Mischung.",
            duration: 4000,
          });
        }
        return newSelection;
      }

      // Prüfe die Maximalanzahl
      if (prev.length >= 7) {
        toast.warning("Maximale Anzahl erreicht", {
          description:
            "Für eine optimale Wirkung sollten nicht mehr als 7 Blüten kombiniert werden.",
          duration: 4000,
        });
        return prev;
      }

      // Zeige Hinweise je nach Anzahl
      if (prev.length === 3) {
        toast.success("Mindestanzahl erreicht", {
          description:
            "Sie haben die Mindestanzahl von 4 Blüten erreicht. Sie können bis zu 3 weitere Blüten hinzufügen.",
          duration: 4000,
        });
      } else if (prev.length === 6) {
        toast.info("Optimale Anzahl erreicht", {
          description:
            "Sie haben die empfohlene Höchstanzahl von 7 Blüten erreicht.",
          duration: 4000,
        });
      }

      return [...prev, blossom];
    });
  }, []);

  const handleBlossomRemove = useCallback((blossom: string) => {
    setSelectedBlossoms((prev) => prev.filter((b) => b !== blossom));
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
      // Finale Bestätigung
      console.log("Finale Auswahl:", selectedBlossoms);
      toast.success("Auswahl abgeschlossen", {
        description: `Sie haben ${selectedBlossoms.length} Blüten ausgewählt.`,
        duration: 4000,
      });
      // Hier könnte die weitere Verarbeitung erfolgen
    }
  }, [selectedBlossoms.length, hasConfirmedInitial]);

  const renderBlossomSelection = () => {
    if (!selectedSector) return null;

    return (
      <div className="w-full">
        <h3 className="text-lg font-medium mb-2">{selectedSector.group}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {selectedSector.description}
        </p>
        <BlossomGrid
          blossoms={selectedSector.blossoms}
          selectedBlossoms={selectedBlossoms}
          onBlossomSelect={handleBlossomSelect}
          blossomData={blossomData}
          hasConfirmedInitial={hasConfirmedInitial}
          maxBlossoms={10}
          recommendedBlossoms={7}
        />{" "}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <Card className="max-w-4xl mx-auto">
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
                <div className="w-full max-w-[400px]">
                  <HarmonyWheel
                    sectors={sectors}
                    onSectorClick={handleSectorClick}
                    activeSector={selectedSector}
                  />
                </div>
                {renderBlossomSelection()}
              </div>
            </TabsContent>

            <TabsContent value="colors" className="mt-4">
              <div className="space-y-6">
                <ColorSelector
                  sectors={sectors}
                  onSectorClick={handleSectorClick}
                  activeSector={selectedSector}
                />
                {renderBlossomSelection()}
              </div>
            </TabsContent>

            <div className="mt-6">
              <SelectedBlossoms
                blossoms={selectedBlossoms}
                onRemove={handleBlossomRemove}
                blossomData={blossomData}
                onConfirm={handleConfirm}
                hasConfirmedInitial={hasConfirmedInitial}
                maxBlossoms={10}
                recommendedBlossoms={7}
              />
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BachbluetenRad;
