// src/pages/consultation-sessions/types/index.ts

import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/types/supabase";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { z } from "zod";

type DbConsultationSession =
  Database["public"]["Tables"]["consultation_sessions"]["Row"];
type DbConsultationProtocol =
  Database["public"]["Tables"]["consultation_protocols"]["Row"];
type DbFlowerSelection =
  Database["public"]["Tables"]["flower_selections"]["Row"];
type DbBachFlower = Database["public"]["Tables"]["bach_flowers"]["Row"];

export interface ConsultationProtocol
  extends Omit<
    DbConsultationProtocol,
    "id" | "created_at" | "updated_at" | "session_id"
  > {
  follow_up_date: string | null;
}

export interface FlowerInSelection {
  id: string;
  name_german: string | null;
  name_english: string;
}

export interface FlowerSelection {
  id: string;
  created_at: string;
  notes: string | null;
  dosage_notes: string | null;
  duration_weeks: number | null;
  flowers: FlowerInSelection[];
}

export interface ConsultationSessionWithDetails extends DbConsultationSession {
  client_first_name: string;
  client_last_name: string;
  client_email: string | null;
  protocol: ConsultationProtocol | null;
  flower_selection: FlowerSelection | null;
}

export interface CreateConsultationInput {
  client_id: string;
  session_type: string;
  start_time: Date;
  end_time: Date;
  duration_minutes: number;
  location?: string;
  notes?: string;
}

export interface UpdateProtocolInput {
  consultationId: string;
  protocol: Omit<ConsultationProtocol, "id" | "session_id">;
}
// Validation Schema
export const consultationSessionSchema = z.object({
  therapist_id: z.string().uuid(),
  client_id: z.string().uuid(),
  status: z.enum(Object.values(SESSION_STATUS) as [string, ...string[]]),
  session_type: z.enum(Object.values(SESSION_TYPES) as [string, ...string[]]),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  duration_minutes: z
    .number()
    .min(15, "Mindestdauer ist 15 Minuten")
    .max(180, "Maximaldauer ist 180 Minuten"),
  location: z.string().optional(),
  notes: z.string().optional(),
  internal_notes: z.string().optional(),
});

// Custom Hook für Session Management
export function useConsultationSession(sessionId?: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["consultation-session", sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("view_consultation_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

      if (error) throw error;
      return data as ConsultationSessionWithDetails;
    },
    enabled: !!sessionId,
  });
}
