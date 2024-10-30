// src/hooks/useTherapeuticDialogue.ts
import { useCallback } from "react";
import { useTherapy } from "../contexts/TherapyContext";
import { supabase } from "../lib/supabaseClient";
import { ClaudeConsultationService } from "@/lib/services/claudeConsultationService";
import { toast } from "sonner";

export const useTherapeuticDialogue = () => {
  const { state, dispatch } = useTherapy();

  const initializeDialogue = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const { data: emotionsData, error: emotionsError } = await supabase
        .from("emotion")
        .select("*")
        .order("name");

      if (emotionsError) throw emotionsError;

      // Erstelle neue Session ID
      const sessionId = `session_${Date.now()}`;
      dispatch({ type: "SET_SESSION_ID", payload: sessionId });

      // Initiale Nachricht wird direkt als Assistant-Nachricht gesetzt
      dispatch({
        type: "SET_MESSAGES",
        payload: [
          {
            id: "1",
            role: "assistant",
            content:
              "Willkommen zur Bach-Blüten Beratung. Bitte erzählen Sie mir zunächst etwas über Ihre aktuelle Lebenssituation, damit ich ein besseres Verständnis dafür gewinnen kann.",
            timestamp: new Date(),
          },
        ],
      });
    } catch (error) {
      console.error("Initialization error:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Fehler beim Laden der Beratung",
      });
      toast.error("Fehler beim Laden der Beratung");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [dispatch]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      dispatch({ type: "SET_LOADING", payload: true });

      try {
        // Füge User-Nachricht hinzu
        const userMessage = {
          id: Date.now().toString(),
          role: "user" as const,
          content,
          timestamp: new Date(),
        };

        dispatch({ type: "ADD_MESSAGE", payload: userMessage });

        // Konvertiere Messages für Claude API
        const conversationMessages = state.messages
          .concat(userMessage)
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
          }));

        // Hole Antwort von Claude
        const response =
          await ClaudeConsultationService.getTherapeuticResponse(
            conversationMessages,
          );

        // Füge Claude's Antwort hinzu
        dispatch({
          type: "ADD_MESSAGE",
          payload: {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: response,
            timestamp: new Date(),
          },
        });
      } catch (error) {
        console.error("Message error:", error);
        dispatch({
          type: "SET_ERROR",
          payload: "Fehler beim Senden der Nachricht",
        });
        toast.error("Konnte keine Antwort generieren");
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [state.messages, dispatch],
  );

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    selectedEmotions: state.selectedEmotions,
    recommendedFlowers: state.recommendedFlowers,
    sendMessage,
    initializeDialogue,
  };
};
