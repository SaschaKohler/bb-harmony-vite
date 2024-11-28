// src/pages/consultation-sessions/types/index.ts
import { SESSION_TYPES, SESSION_STATUS } from "@/constants/sessions";
import type { Database } from "@/types/supabase";
import { z } from "zod";

type DbConsultationSession =
  Database["public"]["Tables"]["consultation_sessions"]["Row"];
type DbConsultationProtocol =
  Database["public"]["Tables"]["consultation_protocols"]["Row"];

export interface ConsultationProtocol
  extends Omit<
    DbConsultationProtocol,
    "id" | "created_at" | "updated_at" | "session_id"
  > {
  current_situation: string | null;
  emotional_states: string[] | null;
  goals: string | null;
  resources: string | null;
  recommendations: string | null;
  agreements: string | null;
  follow_up_date: string | null;
}

export interface ConsultationSessionWithDetails extends DbConsultationSession {
  client_first_name: string;
  client_last_name: string;
  client_email: string | null;
  protocol: ConsultationProtocol | null;
  flower_selection: {
    id: string;
    notes: string | null;
    flowers: Array<{
      id: string;
      name_german: string | null;
      name_english: string;
    }>;
  } | null;
  current_situation?: string | null;
  flower_selection_id?: {
    flowers: Array<any>;
    length: number;
  } | null;
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
