import type { Database } from "@/types/supabase";
import type { BachFlower } from "@/types/bachFlowerTypes";

export type TherapySession =
  Database["public"]["Tables"]["therapy_sessions"]["Row"];
export type SessionProtocol =
  Database["public"]["Tables"]["session_protocols"]["Row"];

export interface SessionWithDetails extends TherapySession {
  client: {
    first_name: string;
    last_name: string;
    email: string | null;
  };
  protocol?: SessionProtocol;
  calendar_event?: {
    google_event_id: string | null;
  };
  flower_selection?: {
    id: string;
    flowers: BachFlower[];
    notes: string;
    dosage_notes: string;
  };
}

export type SessionStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";
export type SessionType =
  | "initial_consultation"
  | "follow_up"
  | "emergency"
  | "online";

export interface CreateSessionInput {
  client_id: string;
  session_type: SessionType;
  start_time: Date;
  end_time: Date;
  duration_minutes: number;
  location?: string;
  notes?: string;
}

export interface SessionProtocolInput {
  symptoms: string[];
  diagnosis?: string;
  treatment_plan?: string;
  used_flowers?: string[];
  recommendations?: string;
  follow_up_needed: boolean;
  follow_up_date?: Date;
}

export interface FlowerMixtureForSession {
  session_id: string;
  flowers: string[]; // flower IDs
  notes?: string;
  dosage_notes?: string;
  duration_weeks?: number;
}
