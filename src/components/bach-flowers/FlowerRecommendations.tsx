// components/FlowerRecommendationView.tsx
import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
  Clock,
  Flower,
  Droplets,
  CalendarIcon,
} from "lucide-react";
import type { Database } from "@/types/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { SimpleCombobox } from "../ui/simple-combobox";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Textarea } from "../ui/textarea";
import { RecommendedFlower } from "@/types/bachFlowerTypes";

type Client = Database["public"]["Tables"]["clients"]["Row"];

interface RecommendationViewProps {
  flowers: RecommendedFlower[]; // Verwende das gleiche Interface
}

export const FlowerRecommendationView = ({
  flowers,
}: RecommendationViewProps) => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  // Dialog-spezifische States
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [followUpDate, setFollowUpDate] = useState<Date | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState("");

  const totalDrops = flowers.reduce((sum, f) => sum + f.drops, 0);

  const handleSave = async () => {
    if (!selectedClient || !user?.id) {
      toast.error("Bitte wählen Sie einen Klienten aus");
      return;
    }
    console.log("handleSave:", selectedClient);
    setIsSaving(true);
    try {
      // Generiere eine valide UUID für die flower_selections

      const { data: selection, error: selectionError } = await supabase
        .from("flower_selections")
        .insert({
          client_id: selectedClient.id,
          therapist_id: user.id,
          date: date.toISOString(),
          notes: additionalNotes || null, // Explizit null wenn leer
          duration_weeks: durationWeeks,
          dosage_notes: "4x täglich 4 Tropfen",
          follow_up_date: followUpDate?.toISOString() || null,
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } satisfies Database["public"]["Tables"]["flower_selections"]["Insert"])
        .select()
        .single();

      if (selectionError) throw selectionError;

      // Zweite Insertion mit korrekten Typen für selection_flowers
      const flowerInserts: Database["public"]["Tables"]["selection_flowers"]["Insert"][] =
        flowers.map((f, index) => ({
          selection_id: selection.id,
          flower_id: f.flower.id,
          position: index + 1,
        }));

      const { error: flowersError } = await supabase
        .from("selection_flowers")
        .insert(flowerInserts);

      if (flowersError) throw flowersError;

      toast.success("Empfehlung erfolgreich gespeichert");
      setShowAssignDialog(false);
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

  const fetchClients = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("therapist_id", user.id)
        .order("last_name", { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Fehler beim Laden der Klienten");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (showAssignDialog) {
      fetchClients();
    }
  }, [showAssignDialog, fetchClients]);

  useEffect(() => {
    if (date && durationWeeks) {
      const followUp = new Date(date);
      followUp.setDate(followUp.getDate() + durationWeeks * 7);
      setFollowUpDate(followUp);
    }
  }, [date, durationWeeks]);

  return (
    <>
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
                    <CardDescription>
                      {item.flower.name_english}
                    </CardDescription>
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
              <li>
                Lassen Sie die Tropfen kurz im Mund bevor Sie sie schlucken
              </li>
              <li>Die empfohlene Anwendungsdauer beträgt 3-4 Wochen</li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-2 print:hidden">
          <Button onClick={() => setShowAssignDialog(true)} className="flex-1">
            <Save className="mr-2 h-4 w-4" />
            Speichern
          </Button>{" "}
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
      {/* Assignment Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Empfehlung speichern</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Kundenauswahl */}
            <div className="space-y-2">
              <Label>Kunde</Label>
              <SimpleCombobox
                clients={clients}
                selectedClient={selectedClient}
                setSelectedClient={setSelectedClient}
                isLoading={isLoading}
                placeholder="Kunde auswählen..."
              />
            </div>

            {/* Datum und Dauer */}
            <div className="space-y-2">
              <Label>Startdatum</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "d. MMMM yyyy", { locale: de })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    locale={de}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Behandlungsdauer</Label>
              <select
                className="w-full h-10 px-3 rounded-md border"
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(Number(e.target.value))}
              >
                {[2, 3, 4, 6, 8].map((weeks) => (
                  <option key={weeks} value={weeks}>
                    {weeks} Wochen
                  </option>
                ))}
              </select>
              {followUpDate && (
                <p className="text-sm text-muted-foreground">
                  Folgetermin:{" "}
                  {format(followUpDate, "d. MMMM yyyy", { locale: de })}
                </p>
              )}
            </div>

            {/* Notizen */}
            <div className="space-y-2">
              <Label>Zusätzliche Notizen</Label>
              <Textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Optionale Notizen..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAssignDialog(false)}
            >
              Abbrechen
            </Button>
            <Button onClick={handleSave} disabled={!selectedClient || isSaving}>
              {isSaving ? "Wird gespeichert..." : "Speichern"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
