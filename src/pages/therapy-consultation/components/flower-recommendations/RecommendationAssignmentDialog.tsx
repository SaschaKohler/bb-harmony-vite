// src/components/bach-flowers/RecommendationAssignmentDialog.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Download, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { SimpleCombobox } from "@/components/ui/simple-combobox";
import type { Database } from "@/types/supabase";

type BachFlower = Database["public"]["Tables"]["bach_flowers"]["Row"];
type Client = Database["public"]["Tables"]["clients"]["Row"];

export interface RecommendationAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recommendedFlowers: Array<{
    flower: BachFlower;
    drops: number;
    reasoning: string;
  }>;
  onSave: () => void;
}

export const RecommendationAssignmentDialog: React.FC<
  RecommendationAssignmentDialogProps
> = ({ open, onOpenChange, recommendedFlowers, onSave }) => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [followUpDate, setFollowUpDate] = useState<Date | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState("");

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
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (open) {
      fetchClients();
    }
  }, [open, fetchClients]);

  useEffect(() => {
    if (date && durationWeeks) {
      const followUp = new Date(date);
      followUp.setDate(followUp.getDate() + durationWeeks * 7);
      setFollowUpDate(followUp);
    }
  }, [date, durationWeeks]);

  const handleSave = async () => {
    if (!selectedClient || !user?.id) return;

    try {
      // Speichere die Blüten-Auswahl
      const { data: selection, error: selectionError } = await supabase
        .from("flower_selections")
        .insert({
          client_id: selectedClient.id,
          therapist_id: user.id,
          date: date.toISOString(),
          notes: additionalNotes,
          duration_weeks: durationWeeks,
          dosage_notes: "4x täglich 4 Tropfen",
          follow_up_date: followUpDate?.toISOString(),
          status: "active",
        })
        .select()
        .single();

      if (selectionError) throw selectionError;

      // Speichere die einzelnen Blüten
      const flowerInserts = recommendedFlowers.map((rec, index) => ({
        selection_id: selection.id,
        flower_id: rec.flower.id,
        position: index + 1,
      }));

      const { error: flowersError } = await supabase
        .from("selection_flowers")
        .insert(flowerInserts);

      if (flowersError) throw flowersError;

      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving recommendation:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Blüten-Empfehlung zuordnen</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 py-4">
            {/* Kundenauswahl */}
            <div className="space-y-4">
              <Label>Kunde auswählen</Label>
              <SimpleCombobox
                clients={clients}
                selectedClient={selectedClient}
                setSelectedClient={setSelectedClient}
                isLoading={isLoading}
                placeholder="Kunde auswählen..."
              />
            </div>

            {/* Behandlungszeitraum */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Startdatum</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? (
                          format(date, "d. MMMM yyyy", { locale: de })
                        ) : (
                          <span>Datum wählen</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
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
                  <Label>Dauer (Wochen)</Label>
                  <select
                    className="w-full px-3 py-2 rounded-md border"
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(Number(e.target.value))}
                  >
                    {[2, 3, 4, 6, 8].map((weeks) => (
                      <option key={weeks} value={weeks}>
                        {weeks} Wochen
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {followUpDate && (
                <p className="text-sm text-muted-foreground">
                  Folgetermin:{" "}
                  {format(followUpDate, "d. MMMM yyyy", { locale: de })}
                </p>
              )}
            </div>

            {/* Empfohlene Blüten */}
            <div className="space-y-4">
              <Label>Empfohlene Bach-Blüten</Label>
              <div className="grid grid-cols-2 gap-3">
                {recommendedFlowers.map((rec, index) => (
                  <Card key={rec.flower.id} className="bg-violet-50/50">
                    <CardContent className="p-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-violet-500 font-medium">
                            {(index + 1).toString().padStart(2, "0")}
                          </span>
                          <span className="font-medium text-violet-700">
                            {rec.flower.name_german}
                          </span>
                        </div>
                        <p className="text-sm text-violet-600/70 pl-6">
                          {rec.drops} Tropfen
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Zusätzliche Notizen */}
            <div className="space-y-2">
              <Label>Zusätzliche Notizen</Label>
              <Textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Optionale Notizen zur Empfehlung..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between border-t mt-6 pt-4">
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSave} disabled={!selectedClient}>
              Speichern
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
