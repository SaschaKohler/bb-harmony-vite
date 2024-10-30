// components/FlowerRecommendationView.tsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Save,
  FileDown,
  Printer,
  Check,
  Clock,
  Flower,
  Droplets,
} from "lucide-react";
import type { Database } from "@/types/supabase";
import { ClaudeConsultationService } from "@/lib/services/claudeConsultationService";

type BachFlower = Database["public"]["Tables"]["bach_flowers"]["Row"];

interface RecommendationViewProps {
  flowers: Array<{
    flower: BachFlower;
    drops: number;
    reasoning: string;
  }>;
  clientId?: string;
  therapistId?: string;
  onSave?: () => void;
}

export const FlowerRecommendationView = ({
  flowers,
  clientId,
  therapistId,
  onSave,
}: RecommendationViewProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const totalDrops = flowers.reduce((sum, f) => sum + f.drops, 0);

  const handleSave = async () => {
    if (!clientId || !therapistId) {
      toast.error("Fehler: Keine Client- oder Therapeuten-ID verfügbar");
      return;
    }

    setIsSaving(true);
    try {
      await ClaudeConsultationService.saveRecommendation(
        clientId,
        therapistId,
        flowers.map((f) => f.flower),
        JSON.stringify(
          flowers.map((f) => ({
            id: f.flower.id,
            drops: f.drops,
            reasoning: f.reasoning,
          })),
        ),
      );
      toast.success("Empfehlung erfolgreich gespeichert");
      onSave?.();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Fehler beim Speichern der Empfehlung");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content =
      `Bach-Blüten Empfehlung\n\n${flowers
        .map(
          (f) =>
            `${f.flower.name_german} (${f.flower.name_english})\n` +
            `Dosierung: ${f.drops} Tropfen\n` +
            `Begründung: ${f.reasoning}\n`,
        )
        .join("\n")}\n\nAnwendung:\n` +
      `- Gesamtanzahl Tropfen: ${totalDrops}\n` +
      `- Einnahme: 4x täglich 4 Tropfen\n` +
      `- Dauer: 3-4 Wochen`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Bach-Blueten-Empfehlung.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 print:space-y-2">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flower className="h-5 w-5" />
            Bach-Blüten Empfehlung
          </CardTitle>
          <CardDescription>
            Personalisierte Zusammenstellung von {flowers.length} Bach-Blüten
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
      <div className="grid gap-4 md:grid-cols-2 print:grid-cols-2">
        {flowers.map((item, index) => (
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
      <div className="flex gap-2 print:hidden">
        {clientId && therapistId && (
          <Button onClick={handleSave} disabled={isSaving} className="flex-1">
            {isSaving ? (
              <>Speichert...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Speichern
              </>
            )}
          </Button>
        )}
        <Button variant="outline" onClick={handleDownload} className="flex-1">
          <FileDown className="mr-2 h-4 w-4" />
          Herunterladen
        </Button>
        <Button variant="outline" onClick={handlePrint} className="flex-1">
          <Printer className="mr-2 h-4 w-4" />
          Drucken
        </Button>
      </div>
    </div>
  );
};
