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
import { useClients } from "../hooks/use-clients"; // Diese müssen wir noch erstellen
import { cn } from "@/lib/utils";
import type { CreateSessionInput } from "../types";

const formSchema = z.object({
  client_id: z.string().min(1, "Bitte wählen Sie einen Klienten aus"),
  session_type: z.enum([
    "initial_consultation",
    "follow_up",
    "emergency",
    "online",
  ]),
  date: z.date(),
  start_time: z.string(),
  duration_minutes: z.number().min(15).max(180),
  location: z.string().optional(),
  notes: z.string().optional(),
});

interface SessionFormDialogProps {
  trigger?: React.ReactNode;
  onSubmit: (data: CreateSessionInput) => Promise<void>;
}

export function SessionFormDialog({
  trigger,
  onSubmit,
}: SessionFormDialogProps) {
  const [open, setOpen] = useState(false);
  const { clients, isLoading: isLoadingClients } = useClients();
  console.log(clients);
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
      // setIsSubmitting(true);
      console.log("Form values:", values); // Debug log

      // Validiere, dass der Client existiert
      const selectedClient = clients.find((c) => c.id === values.client_id);
      if (!selectedClient) {
        toast.error("Ungültiger Client ausgewählt");
        return;
      }

      const startTime = new Date(values.date);
      const [hours, minutes] = values.start_time.split(":");
      startTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + values.duration_minutes);

      const sessionData: CreateSessionInput = {
        client_id: values.client_id,
        session_type: values.session_type,
        start_time: startTime,
        end_time: endTime,
        duration_minutes: values.duration_minutes,
        location: values.location || undefined,
        notes: values.notes || undefined,
      };

      console.log("Session data to submit:", sessionData); // Debug log

      await onSubmit(sessionData);
      setOpen(false);
      form.reset();
      toast.success("Sitzung erfolgreich erstellt");
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("Fehler beim Erstellen der Sitzung");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Neue Sitzung</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Neue Therapiesitzung</DialogTitle>
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
                      {clients?.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.first_name} {client.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sitzungstyp */}
            <FormField
              control={form.control}
              name="session_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sitzungstyp</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sitzungstyp auswählen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="initial_consultation">
                        Erstgespräch
                      </SelectItem>
                      <SelectItem value="follow_up">Folgesitzung</SelectItem>
                      <SelectItem value="emergency">Notfallsitzung</SelectItem>
                      <SelectItem value="online">Online-Beratung</SelectItem>
                    </SelectContent>
                  </Select>
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
                        <Input
                          type="time"
                          step="900" // 15-Minuten-Schritte
                          {...field}
                        />
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
                    <Input {...field} />
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
                  <FormLabel>Notizen (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
              >
                Abbrechen
              </Button>
              <Button type="submit">Sitzung erstellen</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
