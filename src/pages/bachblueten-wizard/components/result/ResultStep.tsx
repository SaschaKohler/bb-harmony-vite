// src/pages/bachblueten-wizard/components/wizard-content/ResultStep.tsx
import { useWizardContext } from "../../hooks/use-wizard-context";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flower, Droplets, Clock } from "lucide-react";
import type { BachFlower, RecommendedFlower } from "@/types/bachFlowerTypes";
import { RecommendationAssignmentDialog } from "@/pages/therapy-consultation/components";
import { supabase } from "@/lib/supabaseClient";
import { FLOWER_TRANSFORMATIONS } from "@/data/flower-transformations";

export const ResultStep = () => {
  const { selectedFlowers } = useWizardContext();
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedFlowers, setRecommendedFlowers] = useState<
    RecommendedFlower[]
  >([]);

  const generateReasoning = (flower: BachFlower): string => {
    console.log(flower.name_english.toLowerCase().replace(/\s+/g, "_"));
    const transformation =
      FLOWER_TRANSFORMATIONS[
        flower.name_english.toLowerCase().replace(/\s+/g, "_")
      ];

    if (transformation) {
      return `Diese Blüte unterstützt Sie auf Ihrem Weg von ${transformation.from} zu ${transformation.to}`;
    }

    return "Diese Blüte kann Ihnen helfen, Ihre Situation zu verbessern";
  };
  // Bereite die ausgewählten Blüten für die Anzeige vor
  useEffect(() => {
    async function fetchFlowerDetails() {
      try {
        setIsLoading(true);
        // Hole alle Details für die ausgewählten Blüten
        const { data: flowerDetails, error } = await supabase
          .from("bach_flowers")
          .select(
            `
            *,
            flower_symptom_relations (
              symptom_id,
              is_primary
            )
          `,
          )
          .in("id", selectedFlowers);

        if (error) throw error;
        if (!flowerDetails) throw new Error("No flower details found");

        const prepared = flowerDetails.map(
          (flower): RecommendedFlower => ({
            flower, // Vollständige Blüteninformationen aus der DB
            drops: 4,
            reasoning: generateReasoning(flower),
          }),
        );
        console.log(prepared);
        setRecommendedFlowers(prepared);
      } catch (error) {
        console.error("Error fetching flower details:", error);
        // Hier könnte man einen Error State setzen
      } finally {
        setIsLoading(false);
      }
    }

    if (selectedFlowers.length > 0) {
      fetchFlowerDetails();
    }
  }, [selectedFlowers]);

  if (isLoading) {
    return <div>Lade Blüteninformationen...</div>;
  }

  if (!recommendedFlowers.length) {
    return <div>Keine Blüten ausgewählt.</div>;
  }

  const totalDrops = recommendedFlowers.reduce((sum, f) => sum + f.drops, 0);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flower className="h-5 w-5" />
            Ihre Bach-Blüten Auswahl
          </CardTitle>
          <CardDescription>
            Personalisierte Zusammenstellung von {recommendedFlowers.length}{" "}
            Bach-Blüten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Droplets className="h-4 w-4" />
              {totalDrops} Tropfen gesamt
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              3-4 Wochen Anwendung
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Flowers Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {recommendedFlowers.map((item) => (
          <Card key={item.flower.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {item.flower.name_german}
                  </CardTitle>
                  <CardDescription>{item.flower.name_english}</CardDescription>
                </div>
                <Badge variant="secondary">{item.drops} Tropfen</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {item.reasoning}
                </div>
                {item.flower.affirmation && (
                  <div className="text-sm italic">
                    "{item.flower.affirmation}"
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Application Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Anwendung</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-4 space-y-2">
            <li>Mischen Sie alle Blüten in einer 30ml Stockbottle</li>
            <li>Füllen Sie die Flasche mit Wasser auf</li>
            <li>
              Fügen Sie einen Teelöffel Brandy/Cognac als Konservierungsmittel
              hinzu
            </li>
            <li>Nehmen Sie 4x täglich 4 Tropfen aus dieser Mischung</li>
            <li>Lassen Sie die Tropfen kurz im Mund bevor Sie sie schlucken</li>
            <li>Die empfohlene Anwendungsdauer beträgt 3-4 Wochen</li>
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={() => setShowAssignDialog(true)} className="flex-1">
          Einem Kunden zuordnen
        </Button>
      </div>

      {/* Assignment Dialog */}
      <RecommendationAssignmentDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        recommendedFlowers={recommendedFlowers}
        onSave={() => {
          // Hier könntest du zusätzliche Aktionen nach dem Speichern ausführen
          setShowAssignDialog(false);
        }}
      />
    </div>
  );
};
