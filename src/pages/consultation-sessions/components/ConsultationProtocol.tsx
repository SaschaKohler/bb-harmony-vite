import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarIcon, Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConsultationSessions } from "../hooks/use-consultation-sessions";
import type { ConsultationSessionWithDetails } from "../types";
import { EmotionInput } from "./EmotionInput";
import { toast } from "sonner";

const protocolSchema = z.object({
  current_situation: z
    .string()
    .min(1, "Bitte beschreiben Sie die aktuelle Situation"),
  emotional_states: z
    .array(z.string())
    .min(1, "Bitte geben Sie mindestens einen emotionalen Zustand an"),
  resources: z.string().optional(),
  goals: z.string().min(1, "Bitte definieren Sie die Ziele der Beratung"),
  recommendations: z.string().optional(),
  agreements: z.string().optional(),
  follow_up_date: z.date().nullable(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof protocolSchema>;

interface ConsultationProtocolProps {
  session: ConsultationSessionWithDetails;
}

export function ConsultationProtocol({ session }: ConsultationProtocolProps) {
  const [isEditing, setIsEditing] = useState(!session.protocol);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [navigationPath, setNavigationPath] = useState<string | null>(null);
  const { updateProtocol } = useConsultationSessions();
  const navigate = useNavigate();

  // Konvertiere das follow_up_date von string zu Date wenn vorhanden
  const defaultValues: FormData = {
    current_situation: session.protocol?.current_situation ?? "",
    emotional_states: session.protocol?.emotional_states ?? [],
    resources: session.protocol?.resources ?? "",
    goals: session.protocol?.goals ?? "",
    recommendations: session.protocol?.recommendations ?? "",
    agreements: session.protocol?.agreements ?? "",
    follow_up_date: session.protocol?.follow_up_date
      ? new Date(session.protocol.follow_up_date)
      : null,
  };

  const form = useForm<FormData>({
    resolver: zodResolver(protocolSchema),
    defaultValues,
  });

  const isDirty = form.formState.isDirty;

  // Warnung bei ungespeicherten Änderungen und Navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Navigation Handler
  const handleNavigation = (path: string) => {
    if (isDirty) {
      setNavigationPath(path);
      setShowUnsavedWarning(true);
    } else {
      navigate(path);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      await updateProtocol.mutateAsync({
        consultationId: session.id,
        protocol: {
          ...data,
          follow_up_date: data.follow_up_date?.toISOString() ?? null,
        },
      });

      form.reset(data);
      toast.success("Protokoll gespeichert");

      // Nach erfolgreichem Speichern Navigation durchführen wenn gewünscht
      if (navigationPath) {
        navigate(navigationPath);
        setNavigationPath(null);
      }
    } catch (error) {
      toast.error("Fehler beim Speichern des Protokolls");
      console.error(error);
    }
  };
  if (!isEditing && session.protocol) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Gesprächsnotizen</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Bearbeiten
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Aktuelle Situation */}
            <div>
              <h4 className="font-medium mb-1">Aktuelle Situation</h4>
              <p className="text-sm text-muted-foreground">
                {session.protocol.current_situation}
              </p>
            </div>

            {/* Emotionale Zustände */}
            <div>
              <h4 className="font-medium mb-1">Emotionale Wahrnehmung</h4>
              <div className="flex flex-wrap gap-2">
                {session.protocol.emotional_states?.map((state, index) => (
                  <Badge key={index} variant="secondary">
                    {state}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Vorhandene Ressourcen */}
            {session.protocol.resources && (
              <div>
                <h4 className="font-medium mb-1">Vorhandene Ressourcen</h4>
                <p className="text-sm text-muted-foreground">
                  {session.protocol.resources}
                </p>
              </div>
            )}

            {/* Ziele */}
            <div>
              <h4 className="font-medium mb-1">Angestrebte Ziele</h4>
              <p className="text-sm text-muted-foreground">
                {session.protocol.goals}
              </p>
            </div>

            {/* Empfehlungen */}
            {session.protocol.recommendations && (
              <div>
                <h4 className="font-medium mb-1">Empfehlungen</h4>
                <p className="text-sm text-muted-foreground">
                  {session.protocol.recommendations}
                </p>
              </div>
            )}

            {/* Vereinbarungen */}
            {session.protocol.agreements && (
              <div>
                <h4 className="font-medium mb-1">Getroffene Vereinbarungen</h4>
                <p className="text-sm text-muted-foreground">
                  {session.protocol.agreements}
                </p>
              </div>
            )}

            {/* Folgetermin */}
            {session.protocol.follow_up_date && (
              <div>
                <h4 className="font-medium mb-1">Nächstes Beratungsgespräch</h4>
                <p className="text-sm text-muted-foreground">
                  {format(
                    new Date(session.protocol.follow_up_date),
                    "dd.MM.yyyy",
                    {
                      locale: de,
                    },
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
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Gesprächsnotizen</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Aktuelle Situation */}
              <FormField
                control={form.control}
                name="current_situation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aktuelle Situation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Beschreiben Sie die aktuelle Lebenssituation und die Anliegen..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Emotionale Wahrnehmung */}
              <FormField
                control={form.control}
                name="emotional_states"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emotionale Wahrnehmung</FormLabel>
                    <FormControl>
                      <EmotionInput
                        value={field.value || []}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    <FormDescription>
                      Drücken Sie Enter für einen neuen emotionalen Zustand oder
                      wählen Sie aus den Vorschlägen.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ressourcen */}
              <FormField
                control={form.control}
                name="resources"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vorhandene Ressourcen</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Welche Ressourcen und Stärken stehen zur Verfügung..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Beschreiben Sie die Stärken und
                      Unterstützungsmöglichkeiten, die der Klient bereits nutzen
                      kann.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ziele */}
              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Angestrebte Ziele</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Welche Ziele wurden gemeinsam erarbeitet..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Definieren Sie die konkreten Ziele, die durch die Beratung
                      erreicht werden sollen.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Empfehlungen */}
              <FormField
                control={form.control}
                name="recommendations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empfehlungen</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Welche Empfehlungen wurden ausgesprochen..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Formulieren Sie Ihre Empfehlungen zur Unterstützung der
                      persönlichen Entwicklung.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Vereinbarungen */}
              <FormField
                control={form.control}
                name="agreements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Getroffene Vereinbarungen</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Welche konkreten Vereinbarungen wurden getroffen..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Halten Sie die gemeinsam vereinbarten nächsten Schritte
                      fest.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Folgetermin */}
              <FormField
                control={form.control}
                name="follow_up_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Nächstes Beratungsgespräch</FormLabel>
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
                    <FormDescription>
                      Optional: Wählen Sie einen Termin für das nächste
                      Beratungsgespräch.
                    </FormDescription>
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
                onClick={() => {
                  if (isDirty) {
                    setShowUnsavedWarning(true);
                  } else {
                    setIsEditing(false);
                  }
                }}
              >
                Abbrechen
              </Button>
            )}
            <Button
              type="submit"
              disabled={updateProtocol.isPending || !isDirty}
            >
              {updateProtocol.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Wird gespeichert...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Speichern
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
      <AlertDialog
        open={showUnsavedWarning}
        onOpenChange={setShowUnsavedWarning}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ungespeicherte Änderungen</AlertDialogTitle>
            <AlertDialogDescription>
              Es gibt ungespeicherte Änderungen. Möchten Sie diese speichern?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowUnsavedWarning(false);
                if (navigationPath) {
                  navigate(navigationPath);
                  setNavigationPath(null);
                } else {
                  setIsEditing(false);
                }
              }}
            >
              Verwerfen
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                form.handleSubmit(onSave)();
              }}
            >
              Speichern
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
