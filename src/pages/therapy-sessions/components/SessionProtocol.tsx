import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarIcon, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTherapySessions } from "../hooks/use-therapy-sessions";
import type { SessionWithDetails, SessionProtocolInput } from "../types";

const protocolSchema = z.object({
  symptoms: z
    .array(z.string())
    .min(1, "Mindestens ein Symptom muss angegeben werden"),
  diagnosis: z.string().optional(),
  treatment_plan: z.string().optional(),
  recommendations: z.string().optional(),
  follow_up_needed: z.boolean().default(false),
  follow_up_date: z.date().optional(),
  notes: z.string().optional(),
});

interface SessionProtocolProps {
  session: SessionWithDetails;
}

export function SessionProtocol({ session }: SessionProtocolProps) {
  const [isEditing, setIsEditing] = useState(!session.protocol);
  const { updateProtocol } = useTherapySessions();

  const form = useForm<z.infer<typeof protocolSchema>>({
    resolver: zodResolver(protocolSchema),
    defaultValues: session.protocol || {
      symptoms: [],
      follow_up_needed: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof protocolSchema>) => {
    try {
      await updateProtocol.mutateAsync({
        sessionId: session.id,
        protocol: values,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating protocol:", error);
    }
  };

  if (!isEditing && session.protocol) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Sitzungsprotokoll</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Bearbeiten
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {session?.protocol?.symptoms?.length > 0 && (
              <div>
                <h4 className="font-medium mb-1">Symptome</h4>
                <ul className="list-disc pl-4 text-sm text-muted-foreground">
                  {session.protocol.symptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
              </div>
            )}

            {session.protocol.diagnosis && (
              <div>
                <h4 className="font-medium mb-1">Diagnose</h4>
                <p className="text-sm text-muted-foreground">
                  {session.protocol.diagnosis}
                </p>
              </div>
            )}

            {session.protocol.treatment_plan && (
              <div>
                <h4 className="font-medium mb-1">Behandlungsplan</h4>
                <p className="text-sm text-muted-foreground">
                  {session.protocol.treatment_plan}
                </p>
              </div>
            )}

            {session.protocol.recommendations && (
              <div>
                <h4 className="font-medium mb-1">Empfehlungen</h4>
                <p className="text-sm text-muted-foreground">
                  {session.protocol.recommendations}
                </p>
              </div>
            )}

            {session.protocol.follow_up_date && (
              <div>
                <h4 className="font-medium mb-1">Folgetermin</h4>
                <p className="text-sm text-muted-foreground">
                  {format(
                    new Date(session.protocol.follow_up_date),
                    "dd.MM.yyyy",
                    { locale: de },
                  )}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Symptome & Befund</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symptome</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Beschreiben Sie die Symptome..."
                      value={field.value?.join("\n")}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.split("\n").filter(Boolean),
                        )
                      }
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diagnosis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnose</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Diagnose eingeben..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Behandlung & Empfehlungen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="treatment_plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Behandlungsplan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Behandlungsplan beschreiben..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recommendations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empfehlungen</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Empfehlungen für den Klienten..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="follow_up_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Folgetermin</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
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
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          {session.protocol && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Abbrechen
            </Button>
          )}
          <Button type="submit" disabled={updateProtocol.isPending}>
            {updateProtocol.isPending ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Wird gespeichert...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Protokoll speichern
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
