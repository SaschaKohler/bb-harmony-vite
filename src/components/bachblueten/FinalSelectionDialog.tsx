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
import { SimpleCombobox } from "../ui/simple-combobox";

type Client = Database["public"]["Tables"]["clients"]["Row"];

// interface Client {
//   id: string;
//   therapist_id: string;
//   first_name: string;
//   last_name: string;
//   email: string | null;
//   phone: string | null;
// }

interface FinalSelectionDialogProps {
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
}

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

  const handleNewClientSubmit = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from("clients")
        .insert([
          {
            first_name: newClientData.firstName,
            last_name: newClientData.lastName,
            email: newClientData.email,
            phone: newClientData.phone,
            therapist_id: session.session.user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setSelectedClient(data);
      setIsNewClient(false);
      await fetchClients();
      return data;
    } catch (error) {
      console.error("Error creating client:", error);
      return null;
    }
  };

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

      // 2. Haupteintrag für die Blütenauswahl erstellen
      const { data: selection, error: selectionError } = await supabase
        .from("flower_selections")
        .insert([
          {
            client_id: clientId,
            therapist_id: user.id,
            date: date,
            notes: notes,
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
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error saving selection:", error);
      // Hier solltest du dem Benutzer eine Fehlermeldung anzeigen
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Finale Blütenauswahl</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Kundenauswahl */}
          <div className="grid gap-4">
            <h3 className="text-lg font-medium">Kundeninformationen</h3>

            {!isNewClient ? (
              <div className="flex gap-2">
                <SimpleCombobox
                  clients={clients}
                  selectedClient={selectedClient}
                  setSelectedClient={setSelectedClient}
                  setIsNewClient={setIsNewClient}
                  isLoading={isLoading}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
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
                  <div className="grid gap-2">
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
                  <div className="grid gap-2">
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
                  <div className="grid gap-2">
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
          <div className="grid gap-2">
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
                    format(date, "PPP", { locale: de })
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
                  disabled={(date) =>
                    date > new Date() || date < new Date("2000-01-01")
                  }
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Ausgewählte Blüten */}
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Ausgewählte Blüten</h3>
              <span className="text-sm text-muted-foreground">
                {selectedBlossoms.length} Blüten ausgewählt
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
                      <div className="flex gap-2 items-start">
                        <span className="text-violet-500 text-sm font-medium">
                          {(index + 1).toString().padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-violet-700 truncate">
                            Nr.{blossomInfo.nummer} {blossomInfo.englisch}
                          </p>
                          <p className="text-xs text-violet-600/70 truncate">
                            {blossomInfo.deutsch}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Notizen */}
          <div className="grid gap-2">
            <Label
              htmlFor="notes"
              className="flex items-center justify-between"
            >
              Notizen & Begründung
              <span className="text-xs text-muted-foreground">Optional</span>
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notizen zur Auswahl und Begründung der gewählten Blüten..."
              className="min-h-[100px] resize-y"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center">
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
