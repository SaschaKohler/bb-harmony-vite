import React from "react";
import { useState, useEffect, useCallback } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Download, Printer, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
import type { Blossom } from "@/lib/bachblueten/types";
import type { Database } from "@/types/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { SimpleCombobox } from "@/components/ui/simple-combobox";

type Client = Database["public"]["Tables"]["clients"]["Row"];

export interface FinalSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBlossoms: string[];
  blossomData: Record<string, Blossom>;
  onSave: (data: FinalSelectionData) => void;
}

export interface FinalSelectionData {
  id: string;
  clientId?: string;
  clientName: string;
  clientEmail?: string;
  date: Date;
  blossoms: string[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  durationWeeks: number; // NEU
  dosageNotes: string; // NEU
  followUpDate: Date | null; // NEU
  status: "active" | "completed"; // NEU
}

const defaultDosageNote = "4x täglich 4 Tropfen in ein Glas Wasser";
const defaultDuration = 4; // 4 Wochen

export const FinalSelectionDialog: React.FC<FinalSelectionDialogProps> = ({
  open,
  onOpenChange,
  selectedBlossoms,
  blossomData,
  onSave,
}) => {
  const { user } = useAuth(); // Auth Context verwenden
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isNewClient, setIsNewClient] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [durationWeeks, setDurationWeeks] = useState<number>(defaultDuration);
  const [dosageNotes, setDosageNotes] = useState(defaultDosageNote);
  const [followUpDate, setFollowUpDate] = useState<Date | null>(null);

  const [newClientData, setNewClientData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const fetchClients = useCallback(async () => {
    if (!user?.id) {
      console.error("No user ID available");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("therapist_id", user.id)
        .order("last_name", { ascending: true });

      console.log("Raw response from supabase:", data); // Debug log

      if (error) {
        throw error;
      }

      // Sehr defensive Prüfung
      if (!data) {
        setClients([]);
        return;
      }

      if (!Array.isArray(data)) {
        console.error("Received non-array data:", data);
        throw new Error("Received invalid data format");
      }

      // Explizite Typumwandlung
      const typedClients = data as Client[];
      console.log("Typed clients:", typedClients); // Debug log

      setClients(typedClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setError(error instanceof Error ? error : new Error("Unknown error"));
      setClients([]); // Reset auf leeres Array im Fehlerfall
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
    // Automatically set follow-up date based on duration
    if (date && durationWeeks) {
      const followUp = new Date(date);
      followUp.setDate(followUp.getDate() + durationWeeks * 7);
      setFollowUpDate(followUp);
    }
  }, [date, durationWeeks]);

  const handleSave = async () => {
    if (!selectedClient && !isNewClient) return;
    if (!user?.id) return;

    let clientId = selectedClient?.id;
    let finalClient = selectedClient;

    try {
      // 1. Wenn neuer Client, erst diesen anlegen
      if (isNewClient) {
        const { data: newClient, error: clientError } = await supabase
          .from("clients")
          .insert([
            {
              first_name: newClientData.firstName,
              last_name: newClientData.lastName,
              email: newClientData.email,
              phone: newClientData.phone,
              therapist_id: user.id,
            },
          ])
          .select()
          .single();

        if (clientError) throw clientError;
        clientId = newClient.id;
        finalClient = newClient;
      }

      const { data: selection, error: selectionError } = await supabase
        .from("flower_selections")
        .insert([
          {
            client_id: clientId,
            therapist_id: user.id,
            date: date,
            notes: notes,
            duration_weeks: durationWeeks, // NEU
            dosage_notes: defaultDosageNote, // NEU
            follow_up_date: followUpDate, // NEU
            status: "active", // NEU
          },
        ])
        .select()
        .single();

      if (selectionError) throw selectionError;
      // 3. Ausgewählte Blüten mit Position speichern
      const selectionFlowers = selectedBlossoms.map((blossomId, index) => ({
        selection_id: selection.id,
        flower_id: blossomId,
        position: index + 1,
      }));

      const { error: flowersError } = await supabase
        .from("selection_flowers")
        .insert(selectionFlowers);

      if (flowersError) throw flowersError;

      // 4. Dialog schließen und Parent über erfolgreiche Speicherung informieren
      onSave({
        id: selection.id,
        clientId,
        clientName: `${finalClient?.first_name} ${finalClient?.last_name}`,
        clientEmail: finalClient?.email,
        date,
        blossoms: selectedBlossoms,
        notes,
        createdAt: new Date(selection.created_at),
        updatedAt: new Date(selection.created_at),
        durationWeeks, // NEU
        dosageNotes: defaultDosageNote, // NEU
        followUpDate, // NEU
        status: "active", // NEU
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error saving selection:", error);
    }
  };

  const resetForm = () => {
    setSelectedClient(null);
    setIsNewClient(false);
    setNewClientData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });
    setNotes("");
    setDate(new Date());
    setDurationWeeks(defaultDuration); // NEU
    setDosageNotes(defaultDosageNote); // NEU
    setFollowUpDate(null); // NEU
  };
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const isFormValid = () => {
    if (isNewClient) {
      return newClientData.firstName.trim() && newClientData.lastName.trim();
    }
    return selectedClient !== null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Finale Blütenauswahl</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-8 py-4">
            {/* Behandlungsdauer - NEU an erster Stelle */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="duration">Behandlungsdauer</Label>
                <span className="text-sm text-muted-foreground">
                  Standard: 4 Wochen
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  max={12}
                  value={durationWeeks}
                  onChange={(e) =>
                    setDurationWeeks(parseInt(e.target.value) || 4)
                  }
                  className="w-16 ml-2"
                />
                <span className="text-sm">Wochen</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Behandlung bis zum:{" "}
                {format(followUpDate || new Date(), "dd.MM.yyyy", {
                  locale: de,
                })}
              </p>
            </div>

            {/* Kundeninformationen */}
            <div className="space-y-4">
              <h3 className="text-base font-medium">Kundeninformationen</h3>
              {!isNewClient ? (
                <SimpleCombobox
                  clients={clients}
                  selectedClient={selectedClient}
                  setSelectedClient={setSelectedClient}
                  setIsNewClient={setIsNewClient}
                  isLoading={isLoading}
                  placeholder="Kunde auswählen..."
                />
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Vorname</Label>
                      <Input
                        id="firstName"
                        value={newClientData.firstName}
                        onChange={(e) =>
                          setNewClientData((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nachname</Label>
                      <Input
                        id="lastName"
                        value={newClientData.lastName}
                        onChange={(e) =>
                          setNewClientData((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newClientData.email}
                        onChange={(e) =>
                          setNewClientData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        value={newClientData.phone}
                        onChange={(e) =>
                          setNewClientData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsNewClient(false)}
                    className="w-fit"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Zurück zur Kundenauswahl
                  </Button>
                </div>
              )}
            </div>

            {/* Datum */}
            <div className="space-y-2">
              <Label>Datum der Auswahl</Label>
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
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                    locale={de}
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Ausgewählte Blüten */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium">Ausgewählte Blüten</h3>
                <span className="text-sm text-muted-foreground">
                  {selectedBlossoms.length} Blüten ausgewählt
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {selectedBlossoms.map((blossom, index) => {
                  const blossomInfo = blossomData[blossom];
                  return (
                    <Card
                      key={blossom}
                      className={cn(
                        "bg-violet-50/50",
                        "hover:shadow-sm transition-shadow",
                        "border-violet-100",
                      )}
                    >
                      <CardContent className="p-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-violet-500 text-sm font-medium">
                              {(index + 1).toString().padStart(2, "0")}
                            </span>
                            <span className="font-medium text-sm text-violet-700">
                              Nr.{blossomInfo.nummer} {blossomInfo.englisch}
                            </span>
                          </div>
                          <p className="text-xs text-violet-600/70 pl-6">
                            {blossomInfo.deutsch}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Notizen */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="notes">Notizen & Begründung</Label>
                <span className="text-xs text-muted-foreground">Optional</span>
              </div>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notizen zur Auswahl und Begründung der gewählten Blüten..."
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex justify-between items-center border-t mt-6 pt-4">
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Abbrechen
            </Button>
            <Button onClick={handleSave} disabled={!isFormValid()}>
              Speichern
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
