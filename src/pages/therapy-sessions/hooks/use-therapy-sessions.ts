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

  // Fetch sessions
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["therapy-sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("view_therapy_sessions")
        .select("*")
        .eq("therapist_id", user?.id)
        .order("start_time", { ascending: false });

      if (error) throw error;
      return data as SessionWithDetails[];
    },
    enabled: !!user?.id,
  });

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

      if (calendarError) throw calendarError;

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

      if (sessionError) throw sessionError;

      return session;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["therapy-sessions"] });
      toast.success("Therapiesitzung erfolgreich erstellt");
    },
    onError: (error) => {
      toast.error("Fehler beim Erstellen der Therapiesitzung");
      console.error("Session creation error:", error);
    },
  });

  // Update protocol
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
        .upsert([
          {
            session_id: sessionId,
            ...protocol,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["therapy-sessions"] });
      toast.success("Protokoll erfolgreich aktualisiert");
    },
  });

  // Add flower mixture
  const addFlowerMixture = useMutation({
    mutationFn: async (mixture: FlowerMixtureForSession) => {
      // 1. Create flower selection
      const { data: selection, error: selectionError } = await supabase
        .from("flower_selections")
        .insert([
          {
            therapist_id: user?.id,
            client_id: activeSession?.client_id,
            date: new Date().toISOString(),
            notes: mixture.notes,
            dosage_notes: mixture.dosage_notes,
            duration_weeks: mixture.duration_weeks,
          },
        ])
        .select()
        .single();

      if (selectionError) throw selectionError;

      // 2. Add flowers to selection
      const flowerSelections = mixture.flowers.map((flowerId, index) => ({
        selection_id: selection.id,
        flower_id: flowerId,
        position: index + 1,
      }));

      const { error: flowersError } = await supabase
        .from("selection_flowers")
        .insert(flowerSelections);

      if (flowersError) throw flowersError;

      // 3. Update session protocol with used flowers
      await updateProtocol.mutateAsync({
        sessionId: mixture.session_id,
        protocol: {
          used_flowers: mixture.flowers,
          symptoms: activeSession?.protocol?.symptoms || [],
          follow_up_needed: true,
          follow_up_date: new Date(
            Date.now() + mixture.duration_weeks! * 7 * 24 * 60 * 60 * 1000,
          ),
        },
      });

      return selection;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["therapy-sessions"] });
      toast.success("Blütenmischung erfolgreich hinzugefügt");
    },
  });

  const startSession = useCallback(
    async (sessionId: string) => {
      const { error } = await supabase
        .from("therapy_sessions")
        .update({ status: "in_progress" })
        .eq("id", sessionId);

      if (error) {
        toast.error("Fehler beim Starten der Sitzung");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["therapy-sessions"] });
      toast.success("Sitzung gestartet");
    },
    [queryClient],
  );

  const completeSession = useCallback(
    async (sessionId: string) => {
      const { error } = await supabase
        .from("therapy_sessions")
        .update({ status: "completed" })
        .eq("id", sessionId);

      if (error) {
        toast.error("Fehler beim Abschließen der Sitzung");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["therapy-sessions"] });
      toast.success("Sitzung abgeschlossen");
    },
    [queryClient],
  );

  return {
    sessions,
    isLoading,
    activeSession,
    setActiveSession,
    createSession,
    updateProtocol,
    addFlowerMixture,
    startSession,
    completeSession,
  };
}
