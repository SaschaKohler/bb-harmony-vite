// src/services/claudeService.ts
import Anthropic from "@anthropic-ai/sdk";
import { toast } from "sonner";

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
});

interface ConsultationMessage {
  role: "assistant" | "user";
  content: string;
}

const SYSTEM_PROMPT = `Du bist ein erfahrener Bach-Blüten-Therapeut mit jahrelanger Erfahrung in der Beratung.
Deine Aufgabe ist es, einfühlsam und verständnisvoll mit Menschen zu sprechen und ihnen durch gezielte Fragen 
zu helfen, ihre emotionale Situation besser zu verstehen. Berücksichtige dabei die Bach-Blüten-Therapie und 
deren Grundprinzipien. Halte deine Antworten prägnant und fokussiert.`;

export class ClaudeService {
  private static async createBatchRequest(
    messages: ConsultationMessage[],
    customId: string,
  ) {
    try {
      const messageBatch = await anthropic.beta.messages.batches.create({
        requests: [
          {
            custom_id: customId,
            params: {
              model: "claude-3-sonnet-20240229",
              max_tokens: 1024,
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...messages,
              ],
            },
          },
        ],
      });

      return messageBatch;
    } catch (error) {
      console.error("Fehler beim Erstellen der Batch-Anfrage:", error);
      throw error;
    }
  }

  private static async waitForBatchResults(batchId: string) {
    let attempts = 0;
    const maxAttempts = 10;
    const delayMs = 1000;

    while (attempts < maxAttempts) {
      try {
        const batch = await anthropic.beta.messages.batches.retrieve(batchId);

        if (batch.processing_status === "ended") {
          // Stream und verarbeite die Ergebnisse
          for await (const result of await anthropic.beta.messages.batches.results(
            batchId,
          )) {
            if (result.result.type === "succeeded") {
              // Extrahiere den Text aus der Nachricht
              const content = result.result.message.content;
              if (Array.isArray(content) && content.length > 0) {
                const text = content[0].type === "text" ? content[0].text : "";
                return text;
              }
            } else if (result.result.type === "errored") {
              throw new Error(
                `Batch-Anfrage fehlgeschlagen: ${result.result.error.message}`,
              );
            }
          }
        }

        await new Promise((resolve) => setTimeout(resolve, delayMs));
        attempts++;
      } catch (error) {
        console.error("Fehler beim Abrufen der Batch-Ergebnisse:", error);
        throw error;
      }
    }

    throw new Error("Zeitüberschreitung beim Warten auf Batch-Ergebnisse");
  }

  static async getTherapeuticResponse(
    conversationHistory: ConsultationMessage[],
  ): Promise<string> {
    try {
      // Erstelle eine eindeutige ID für diese Anfrage
      const customId = `therapy-${Date.now()}`;

      // Erstelle die Batch-Anfrage
      const batch = await this.createBatchRequest(
        conversationHistory,
        customId,
      );

      // Warte auf und verarbeite die Ergebnisse
      const response = await this.waitForBatchResults(batch.id);

      return (
        response ||
        "Entschuldigung, ich konnte keine passende Antwort generieren."
      );
    } catch (error) {
      console.error("Claude API Fehler:", error);
      toast.error("Es gab einen Fehler bei der Verarbeitung Ihrer Nachricht");
      throw error;
    }
  }

  static async analyzeEmotionalState(userMessage: string): Promise<{
    dominantEmotions: string[];
    suggestedApproach: string;
  }> {
    try {
      const customId = `analysis-${Date.now()}`;
      const analysisPrompt = `
        Analysiere die folgende Aussage im Kontext der Bach-Blüten-Therapie.
        Identifiziere die dominanten emotionalen Zustände und schlage einen therapeutischen Ansatz vor.
        Antworte im JSON-Format:
        {
          "dominantEmotions": ["emotion1", "emotion2"],
          "suggestedApproach": "therapeutischer Ansatz"
        }

        Aussage: ${userMessage}
      `;

      const batch = await this.createBatchRequest(
        [{ role: "user", content: analysisPrompt }],
        customId,
      );

      const response = await this.waitForBatchResults(batch.id);
      return JSON.parse(response);
    } catch (error) {
      console.error("Fehler bei der emotionalen Analyse:", error);
      toast.error("Die emotionale Analyse konnte nicht durchgeführt werden");
      throw error;
    }
  }
}
