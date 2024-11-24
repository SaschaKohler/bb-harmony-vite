// src/hooks/use-therapy-sessions.ts

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import type {
  TherapySession,
  SessionWithDetails,
  CreateSessionInput,
  SessionProtocolInput,
  FlowerMixtureForSession,
} from "../types";
import { useAuth } from "@/contexts/AuthContext";

export function useTherapySessions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeSession, setActiveSession] = useState<SessionWithDetails | null>(
    null,
  );

  // Liste aller Sitzungen
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["therapy-sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("therapy_sessions")
        .select(
          `
          *,
          client:clients(
            first_name,
            last_name,
            email
          ),
          calendar_event:calendar_events(
            google_event_id
          ),
          protocol:session_protocols(*)
        `,
        )
        .eq("therapist_id", user?.id)
        .order("start_time", { ascending: false });

      if (error) throw error;
      return data as SessionWithDetails[];
    },
    enabled: !!user?.id,
  });

  // Einzelne Sitzung abrufen
  const useSession = (sessionId?: string) => {
    return useQuery({
      queryKey: ["therapy-session", sessionId],
      queryFn: async () => {
        if (!sessionId || !user?.id) {
          throw new Error("Sitzungs-ID oder Benutzer fehlt");
        }

        const { data: session, error: sessionError } = await supabase
          .from("therapy_sessions")
          .select(
            `
            *,
            client:clients (
              first_name,
              last_name,
              email
            ),
            calendar_event:calendar_events (
              google_event_id
            ),
            protocol:session_protocols (*),
            flower_selections (
              id,
              notes,
              dosage_notes,
              duration_weeks,
              created_at,
              selection_flowers (
                flower:bach_flowers (*)
              )
            )
          `,
          )
          .eq("id", sessionId)
          .single();

        if (sessionError) throw sessionError;

        if (!session) {
          throw new Error("Sitzung nicht gefunden");
        }

        // Transformiere die Daten in das erwartete Format
        const flowerSelection = session.flower_selections?.[0];
        const transformedSession = {
          ...session,
          flower_selection: flowerSelection
            ? {
                id: flowerSelection.id,
                notes: flowerSelection.notes,
                dosage_notes: flowerSelection.dosage_notes,
                duration_weeks: flowerSelection.duration_weeks,
                created_at: flowerSelection.created_at,
                flowers:
                  flowerSelection.selection_flowers?.map((sf) => sf.flower) ||
                  [],
              }
            : undefined,
          flower_selections: undefined, // Entferne das Original-Array
        };

        return transformedSession;
      },
      enabled: !!sessionId && !!user?.id,
    });
  };

  // Create session
  const createSession = useMutation({
    mutationFn: async (input: CreateSessionInput) => {
      // 1. Create calendar event
      const { data: calendarEvent, error: calendarError } = await supabase
        .from("calendar_events")
        .insert([
          {
            therapist_id: user?.id,
            title: `Therapiesitzung mit ${input.client_id}`,
            start_time: input.start_time,
            end_time: input.end_time,
            event_type: "session",
          },
        ])
        .select()
        .single();

      if (calendarError) {
        toast.error("Kalendareintrag konnte nicht erstellt werden", {
          description: calendarError.message,
        });
        throw calendarError;
      }

      // 2. Create therapy session
      const { data: session, error: sessionError } = await supabase
        .from("therapy_sessions")
        .insert([
          {
            ...input,
            therapist_id: user?.id,
            calendar_event_id: calendarEvent.id,
          },
        ])
        .select()
        .single();

      if (sessionError) {
        // Cleanup calendar event if session creation fails
        await supabase
          .from("calendar_events")
          .delete()
          .eq("id", calendarEvent.id);

        if (
          sessionError.code === "P0001" &&
          sessionError.message.includes("Terminüberschneidung")
        ) {
          toast.error("Terminüberschneidung", {
            description:
              "Für diesen Zeitraum existiert bereits ein Termin. Bitte wählen Sie eine andere Zeit.",
          });
        } else {
          toast.error("Fehler beim Erstellen der Sitzung", {
            description: sessionError.message,
          });
        }
        throw sessionError;
      }

      return session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["therapy-sessions"] });
      toast.success("Therapiesitzung erfolgreich erstellt");
    },
    onError: (error) => {
      console.error("Error creating session:", error);
      // Generische Fehlermeldung nur wenn keine spezifische bereits gezeigt wurde
      if (!error.message?.includes("Terminüberschneidung")) {
        toast.error("Unerwarteter Fehler", {
          description:
            "Die Sitzung konnte nicht erstellt werden. Bitte versuchen Sie es später erneut.",
        });
      }
    },
  });

  // Protokoll aktualisieren
  const updateProtocol = useMutation({
    mutationFn: async ({
      sessionId,
      protocol,
    }: {
      sessionId: string;
      protocol: SessionProtocolInput;
    }) => {
      const { data, error } = await supabase
        .from("session_protocols")
        .upsert({
          session_id: sessionId,
          ...protocol,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ["therapy-sessions"] });
      queryClient.invalidateQueries({
        queryKey: ["therapy-session", sessionId],
      });
      toast.success("Protokoll wurde aktualisiert");
    },
    onError: (error) => {
      toast.error("Fehler beim Aktualisieren des Protokolls", {
        description: error.message,
      });
    },
  });

  // Blütenmischung hinzufügen
  const addFlowerMixture = useMutation({
    mutationFn: async (mixture: FlowerMixtureForSession) => {
      // 1. Erstelle die Blütenmischung
      const { data: selection, error: selectionError } = await supabase
        .from("flower_selections")
        .insert([
          {
            therapist_id: user?.id,
            client_id: mixture.client_id, // Wir brauchen das jetzt von der Session
            session_id: mixture.session_id,
            date: new Date().toISOString(),
            notes: mixture.notes,
            dosage_notes: mixture.dosage_notes,
            duration_weeks: mixture.duration_weeks,
          },
        ])
        .select()
        .single();

      if (selectionError) throw selectionError;

      // 2. Füge die Blüten hinzu
      const flowerSelections = mixture.flowers.map((flowerId, index) => ({
        selection_id: selection.id,
        flower_id: flowerId,
        position: index + 1,
      }));

      const { error: flowersError } = await supabase
        .from("selection_flowers")
        .insert(flowerSelections);

      if (flowersError) throw flowersError;

      return selection;
    },
    onSuccess: (_, { session_id }) => {
      queryClient.invalidateQueries({ queryKey: ["therapy-sessions"] });
      queryClient.invalidateQueries({
        queryKey: ["therapy-session", session_id],
      });
      toast.success("Blütenmischung wurde erstellt");
    },
    onError: (error) => {
      toast.error("Fehler beim Erstellen der Blütenmischung", {
        description:
          error instanceof Error ? error.message : "Unbekannter Fehler",
      });
    },
  });

  // Status-Änderungen
  const startSession = useMutation({
    mutationFn: async (sessionId: string) => {
      const { data, error } = await supabase
        .from("therapy_sessions")
        .update({
          status: "in_progress",
          updated_at: new Date().toISOString(),
        })
        .eq("id", sessionId)
        .select()
        .single();

      if (error) {
        console.error("Start session error:", error);
        throw new Error("Fehler beim Starten der Sitzung");
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["therapy-sessions"] });
      queryClient.invalidateQueries({
        queryKey: ["therapy-session", data.id],
      });
    },
  });

  const completeSession = useMutation({
    mutationFn: async (sessionId: string) => {
      const { data, error } = await supabase
        .from("therapy_sessions")
        .update({
          status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", sessionId)
        .select()
        .single();

      if (error) {
        console.error("Complete session error:", error);
        throw new Error("Fehler beim Abschließen der Sitzung");
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["therapy-sessions"] });
      queryClient.invalidateQueries({
        queryKey: ["therapy-session", data.id],
      });
    },
  });

  return {
    sessions,
    isLoading,
    useSession,
    activeSession,
    setActiveSession,
    createSession,
    updateProtocol,
    addFlowerMixture,
    startSession: startSession.mutateAsync,
    completeSession: completeSession.mutateAsync,
  };
}
