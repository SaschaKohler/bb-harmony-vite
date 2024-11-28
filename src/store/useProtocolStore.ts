// src/stores/useProtocolStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProtocolState {
  drafts: Record<string, ConsultationProtocol>;
  setDraft: (
    sessionId: string,
    protocol: Partial<ConsultationProtocol>,
  ) => void;
  getDraft: (sessionId: string) => ConsultationProtocol | null;
  clearDraft: (sessionId: string) => void;
}

export const useProtocolStore = create<ProtocolState>()(
  persist(
    (set, get) => ({
      drafts: {},
      setDraft: (sessionId, protocol) =>
        set((state) => ({
          drafts: {
            ...state.drafts,
            [sessionId]: {
              ...state.drafts[sessionId],
              ...protocol,
            },
          },
        })),
      getDraft: (sessionId) => get().drafts[sessionId] || null,
      clearDraft: (sessionId) =>
        set((state) => {
          const { [sessionId]: _, ...rest } = state.drafts;
          return { drafts: rest };
        }),
    }),
    {
      name: "consultation-drafts",
    },
  ),
);
