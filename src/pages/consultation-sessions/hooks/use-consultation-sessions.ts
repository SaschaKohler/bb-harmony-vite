import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type {
  ConsultationSessionWithDetails,
  CreateConsultationInput,
  UpdateProtocolInput,
} from "../types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// Event Types basierend auf der Datenbank-Constraint
const EVENT_TYPES = {
  SESSION: "session",
  BLOCK: "block",
  REMINDER: "reminder",
  OTHER: "other",
} as const;

type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

export function useConsultationSessions() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Hauptquery für alle Konsultationen
  const {
    data: sessions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["consultation-sessions"],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user ID available");

      const { data, error } = await supabase
        .from("view_consultation_sessions")
        .select(
          `
          *,
          client:clients(
            id,
            first_name,
            last_name,
            email
          ),
          protocol:consultation_protocols(
            current_situation,
            emotional_states,
            resources,
            goals,
            recommendations,
            agreements,
            follow_up_date
          ),
          flower_selection:flower_selections(
            id,
            notes,
            dosage_notes,
            duration_weeks,
            created_at,
            flowers:selection_flowers(
              flower:bach_flowers(
                id,
                name_german,
                name_english
              )
            )
          )
        `,
        )
        .eq("therapist_id", user.id)
        .order("start_time", { ascending: false });

      if (error) throw error;
      return data as ConsultationSessionWithDetails[];
    },
    enabled: !!user?.id,
  });

  // Query für einzelne Konsultation
  // Hauptquery für Sitzungsdetails
  const useSession = (sessionId: string) => {
    return useQuery({
      queryKey: ["consultation-session", sessionId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("view_consultation_sessions")
          .select("*")
          .eq("id", sessionId)
          .single();

        if (error) throw error;
        return data;
      },
      enabled: !!sessionId,
      staleTime: Infinity, // Wichtig: Verhindert Auto-Refetching
    });
  };

  // Mutation für das Erstellen einer neuen Konsultation
  const createSession = useMutation({
    mutationFn: async (input: CreateConsultationInput) => {
      if (!user?.id) throw new Error("No user ID available");

      try {
        // 1. Create calendar event
        const { data: calendarEvent, error: calendarError } = await supabase
          .from("calendar_events")
          .insert([
            {
              therapist_id: user.id,
              title: `Beratungsgespräch`,
              start_time: input.start_time.toISOString(),
              end_time: input.end_time.toISOString(),
              event_type: EVENT_TYPES.SESSION,
            },
          ])
          .select()
          .single();

        if (calendarError) {
          throw new Error(
            calendarError.message.includes("calendar_events_event_type_check")
              ? "Ungültiger Event-Typ für den Kalender"
              : "Kalendereintrag konnte nicht erstellt werden",
          );
        }

        // 2. Create consultation session
        const { data: session, error: sessionError } = await supabase
          .from("consultation_sessions")
          .insert([
            {
              therapist_id: user.id,
              client_id: input.client_id,
              session_type: input.session_type,
              start_time: input.start_time.toISOString(),
              end_time: input.end_time.toISOString(),
              duration_minutes: input.duration_minutes,
              location: input.location,
              notes: input.notes,
              status: "scheduled",
              calendar_event_id: calendarEvent.id,
            },
          ])
          .select(
            `
            *,
            client:clients(
              first_name,
              last_name,
              email
            )
          `,
          )
          .single();

        if (sessionError) {
          // Cleanup calendar event if session creation fails
          await supabase
            .from("calendar_events")
            .delete()
            .eq("id", calendarEvent.id);

          throw new Error(
            sessionError.message.includes("check_session_overlap")
              ? "Terminüberschneidung: Bitte wählen Sie eine andere Zeit"
              : "Beratungsgespräch konnte nicht erstellt werden",
          );
        }

        // 3. Update calendar event with client name
        const clientName = `${session.client.first_name} ${session.client.last_name}`;
        await supabase
          .from("calendar_events")
          .update({
            title: `Beratungsgespräch - ${clientName}`,
            description: input.notes,
          })
          .eq("id", calendarEvent.id);

        return session;
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Unbekannter Fehler beim Erstellen der Konsultation");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultation-sessions"] });
      toast.success("Beratungsgespräch erfolgreich geplant");
    },
    onError: (error: Error) => {
      toast.error("Fehler beim Erstellen des Beratungsgesprächs", {
        description: error.message,
      });
    },
  });

  // Mutation für das Aktualisieren des Protokolls
  // Optimierte Update-Mutation
  const updateProtocol = useMutation({
    mutationFn: async ({ consultationId, protocol }) => {
      const { data, error } = await supabase
        .from("consultation_protocols")
        .upsert({
          session_id: consultationId,
          ...protocol,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      // Manuelles Cache-Update
      queryClient.setQueryData(
        ["consultation-session", variables.consultationId],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            protocol: data,
          };
        },
      );
    },
  });

  // Mutation für den Start einer Konsultation
  const startConsultation = useMutation({
    mutationFn: async (sessionId: string) => {
      const { data, error } = await supabase
        .from("consultation_sessions")
        .update({ status: "in_progress" })
        .eq("id", sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultation-sessions"] });
      toast.success("Beratungsgespräch gestartet");
    },
    onError: (error: Error) => {
      toast.error("Fehler beim Starten des Gesprächs", {
        description: error.message,
      });
    },
  });

  // Mutation für das Abschließen einer Konsultation
  const completeConsultation = useMutation({
    mutationFn: async (sessionId: string) => {
      const { data, error } = await supabase
        .from("consultation_sessions")
        .update({ status: "completed" })
        .eq("id", sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultation-sessions"] });
      toast.success("Beratungsgespräch erfolgreich abgeschlossen");
    },
    onError: (error: Error) => {
      toast.error("Fehler beim Abschließen des Gesprächs", {
        description: error.message,
      });
    },
  });

  return {
    sessions,
    isLoading,
    error,
    useSession,
    createSession,
    updateProtocol,
    startConsultation,
    completeConsultation,
  };
}
