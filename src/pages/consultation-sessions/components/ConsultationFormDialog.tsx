// src/pages/consultation-sessions/components/ConsultationFormDialog.tsx

import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useClients } from "../hooks/use-clients";
import { cn } from "@/lib/utils";
import type {
  ConsultationSessionWithDetails,
  CreateSessionInput,
} from "../types";
import { toast } from "sonner";

const formSchema = z.object({
  client_id: z.string().min(1, "Bitte wählen Sie einen Klienten aus"),
  session_type: z.enum(
    ["initial_consultation", "follow_up", "emergency", "online"],
    {
      required_error: "Bitte wählen Sie die Art des Beratungsgesprächs",
    },
  ),
  date: z.date({
    required_error: "Bitte wählen Sie ein Datum",
  }),
  start_time: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Bitte geben Sie eine gültige Uhrzeit ein",
    ),
  duration_minutes: z.number().min(30).max(180),
  location: z.string().optional(),
  notes: z.string().optional(),
});

const consultationTypeLabels = {
  initial_consultation: "Erstgespräch",
  follow_up: "Folgegespräch",
  emergency: "Notfallberatung",
  online: "Online-Beratung",
};

interface ConsultationFormDialogProps {
  trigger?: React.ReactNode;
  onSubmit: (data: CreateSessionInput) => Promise<void>;
}

export function ConsultationFormDialog({
  trigger,
  onSubmit,
}: ConsultationFormDialogProps) {
  const [open, setOpen] = useState(false);
  const { clients, isLoading: isLoadingClients } = useClients();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      session_type: "initial_consultation",
      duration_minutes: 60,
      start_time: "09:00",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      const selectedClient = clients?.find((c) => c.id === values.client_id);
      if (!selectedClient) {
        toast.error("Ungültiger Klient ausgewählt");
        return;
      }

      const startTime = new Date(values.date);
      const [hours, minutes] = values.start_time.split(":");
      startTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + values.duration_minutes);

      const consultationData: CreateSessionInput = {
        client_id: values.client_id,
        session_type: values.session_type,
        start_time: startTime,
        end_time: endTime,
        duration_minutes: values.duration_minutes,
        location: values.location,
        notes: values.notes,
      };

      await onSubmit(consultationData);
      setOpen(false);
      form.reset();
      toast.success("Beratungsgespräch erfolgreich geplant");
    } catch (error) {
      console.error("Error creating consultation:", error);
      toast.error("Fehler beim Erstellen des Beratungsgesprächs");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Neues Beratungsgespräch</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Neues Beratungsgespräch planen</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Klientenauswahl */}
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Klient</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Klient auswählen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingClients ? (
                        <SelectItem value="loading" disabled>
                          Lade Klienten...
                        </SelectItem>
                      ) : clients?.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          Keine Klienten verfügbar
                        </SelectItem>
                      ) : (
                        clients?.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.first_name} {client.last_name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Beratungstyp */}
            <FormField
              control={form.control}
              name="session_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Art des Beratungsgesprächs</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Art des Gesprächs wählen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(consultationTypeLabels).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Wählen Sie die passende Art des Beratungsgesprächs
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Datum und Uhrzeit */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Datum</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: de })
                            ) : (
                              <span>Datum wählen</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          locale={de}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Uhrzeit</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Input type="time" step="900" {...field} />
                      </FormControl>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Dauer */}
            <FormField
              control={form.control}
              name="duration_minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dauer (Minuten)</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Dauer wählen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="30">30 Minuten</SelectItem>
                      <SelectItem value="45">45 Minuten</SelectItem>
                      <SelectItem value="60">60 Minuten</SelectItem>
                      <SelectItem value="90">90 Minuten</SelectItem>
                      <SelectItem value="120">120 Minuten</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ort */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ort (optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="z.B. Praxis, Online oder externe Location"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notizen */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vorbereitungsnotizen (optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Wichtige Informationen zur Vorbereitung"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Abbrechen
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Wird erstellt...
                  </>
                ) : (
                  "Beratungsgespräch planen"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
