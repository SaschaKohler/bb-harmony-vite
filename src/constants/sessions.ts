export const SESSION_STATUS = {
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
} as const;

export const SESSION_TYPES = {
  INITIAL_CONSULTATION: "initial_consultation",
  FOLLOW_UP: "follow_up",
  EMERGENCY: "emergency",
  ONLINE: "online",
} as const;

export type SessionStatus = keyof typeof SESSION_STATUS;
export type SessionType = keyof typeof SESSION_TYPES;
