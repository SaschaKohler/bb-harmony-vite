// src/services/claudeConsultationService.ts
import { config, devLog } from "@/config";

import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/types/supabase";

type BachFlower = Database["public"]["Tables"]["bach_flowers"]["Row"];
type Emotion = Database["public"]["Tables"]["emotion"]["Row"];

// Umgebungsvariablen
const anthropic = new Anthropic({
  apiKey: config.claude.apiKey,
  dangerouslyAllowBrowser: true,
});

// Mock-Antworten für Development
const MOCK_RESPONSES = [
  "Wie fühlen Sie sich in solchen Situationen?",
  "Können Sie mir mehr darüber erzählen, was Sie dabei empfinden?",
  "Was würde Ihnen in dieser Situation helfen?",
  "Wie gehen Sie normalerweise mit solchen Herausforderungen um?",
  "Welche Gefühle löst das bei Ihnen aus?",
  "Was würden Sie sich in dieser Situation wünschen?",
];

export interface ConsultationMessage {
  role: "assistant" | "user";
  content: string;
}

interface SavedRecommendation {
  id: string;
  flower_id: string;
  drops: number;
  reasoning: string;
}

export class ClaudeConsultationService {
  private static knowledgeBase: string | null = null;

  private static async initializeKnowledgeBase(): Promise<string> {
    if (this.knowledgeBase) {
      return this.knowledgeBase;
    }

    try {
      // Hole alle Bach-Blüten und Emotionen aus der Datenbank
      const { data: flowers, error: flowersError } = await supabase
        .from("bach_flowers")
        .select("*")
        .order("number");

      const { data: emotions, error: emotionsError } = await supabase
        .from("emotion")
        .select("*");

      if (flowersError) throw flowersError;
      if (emotionsError) throw emotionsError;

      // Erstelle eine strukturierte Wissensbasis
      const flowerKnowledge = flowers
        .map((flower) => {
          const emotion = emotions.find((e) => e.id === flower.emotion_id);
          return `BLÜTE ${flower.number}: ${flower.name_german} (${flower.name_english})
EMOTION: ${emotion?.name || "-"}
BESCHREIBUNG: ${flower.description || "-"}
AFFIRMATION: ${flower.affirmation || "-"}
ANWENDUNGSBEREICH: ${flower.description || "-"}
`;
        })
        .join("\n\n");

      this.knowledgeBase = `VOLLSTÄNDIGE BACH-BLÜTEN INFORMATIONEN:

${flowerKnowledge}

Diese Bach-Blüten stehen zur Verfügung. Nutze diese Informationen als Basis für die Beratung.`;

      return this.knowledgeBase;
    } catch (error) {
      console.error("Error initializing knowledge base:", error);
      throw new Error("Fehler beim Laden der Bach-Blüten-Informationen");
    }
  }

  private static readonly systemPrompt = `Du bist ein erfahrener Bach-Blüten-Therapeut, der durch einfühlsames und 
detailliertes Nachfragen die emotionale Situation des Klienten verstehen möchte. Dein Ziel ist es, am Ende maximal 
7 passende Bach-Blüten zu identifizieren, aber zunächst konzentrierst du dich darauf, die Situation vollständig zu verstehen.

Wichtige Gesprächsrichtlinien:

1. Stelle IMMER nur eine konkrete Frage pro Antwort.

2. Folge diesem Gesprächsablauf strikt:
   Phase 1 (Situationsverständnis, 1-4 Fragen):
   - Frage nach der aktuellen Lebenssituation
   - Erkunde spezifische Herausforderungen im Alltag
   - Frage nach konkreten Beispielen
   - Konzentriere dich auf die Hauptbelastungen

   Phase 2 (Emotionale Tiefe, 5-8 Fragen):
   - Erfrage Details zu einzelnen Gefühlen
   - Frage nach Auslösern und Situationen
   - Erkunde die Intensität und Häufigkeit der Gefühle
   - Erforsche emotionale Muster

   Phase 3 (Bewältigungsmuster, 9-12 Fragen):
   - Wie geht die Person damit um?
   - Was wurde bereits versucht?
   - Was würde sich die Person anders wünschen?
   - Welche Verhaltensmuster werden beobachtet?

   Phase 4 (Ressourcen, 13-16 Fragen):
   - Was gibt Kraft?
   - Welche positiven Momente gibt es?
   - Was funktioniert bereits gut?
   - Welche Unterstützung ist vorhanden?

   Phase 5 (Bach-Blüten-Auswahl, ab Frage 17):
   - Systematische Auswahl basierend auf dem Gesamtbild
   - Maximal 7 Blüten
   - Ausführliche Begründung je Blüte

3. Wichtige Frageregeln:
   - Stelle offene, aber konkrete Fragen
   - Eine Frage pro Antwort
   - Greife Details aus vorherigen Antworten auf
   - Frage gezielt nach Beispielsituationen
   - Ermutige zu detaillierten Beschreibungen
   - Vermeide Suggestivfragen

4. Für jede Antwort des Klienten:
  - Greife einen konkreten Aspekt der Antwort auf
   - Stelle eine präzise Nachfrage zu diesem Aspekt
   - Warte die Antwort des Klienten ab

5. Beende jede deiner Antworten mit einer konkreten Frage.`;

  private static readonly flowerRecommendationPrompt = `
5. In der Empfehlungsphase beachte strikt:

EMPFEHLUNGSFORMAT:
Blüte [Nummer]: [Deutscher Name] - [Tropfenanzahl] Tropfen
- Begründung: [Spezifische emotionale Situation des Klienten]
- Wirkung: [Erwartete Wirkung der Blüte]

BEISPIEL:
Blüte 1: Aspen (Zitterpappel) - 4 Tropfen
- Begründung: Der Klient berichtet von diffusen Ängsten vor Meetings
- Wirkung: Unterstützt bei der Überwindung unbestimmter Ängste

WICHTIGE REGELN:
1. Maximal 7 Blüten insgesamt
2. Tropfenanzahl immer zwischen 2-4 pro Blüte
3. Verwende ausschließlich die verfügbaren Blüten
4. Nenne immer die deutschen Namen mit Nummer
5. Begründe jede Blüte mit Bezug zur individuellen Situation
6. Füge am Ende eine klare Anwendungsanweisung hinzu`;

  private static async getAvailableFlowers(): Promise<BachFlower[]> {
    const { data: flowers, error } = await supabase
      .from("bach_flowers")
      .select("*")
      .order("number");

    if (error) {
      console.error("Error fetching flowers:", error);
      throw new Error("Fehler beim Laden der Bach-Blüten");
    }

    return flowers || [];
  }

  private static generateMockRecommendation = async (
    messageCount: number,
  ): Promise<string> => {
    if (messageCount <= 16) {
      return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
    }

    try {
      // Hole alle Bach-Blüten aus der Datenbank
      const { data: flowers, error } = await supabase
        .from("bach_flowers")
        .select(
          `
        id,
        number,
        name_german,
        name_english,
        description,
        affirmation,
        emotion_id
      `,
        )
        .order("number");

      if (error) throw error;
      if (!flowers || flowers.length === 0) {
        throw new Error("Keine Bach-Blüten in der Datenbank gefunden");
      }
      console.log(flowers);

      // Wähle zufällig 4-7 Blüten aus
      const flowerCount = Math.floor(Math.random() * 4) + 4;
      const selectedFlowers = flowers
        .sort(() => 0.5 - Math.random())
        .slice(0, flowerCount);

      console.log(selectedFlowers);

      const recommendation = selectedFlowers
        .map((flower, index) => {
          return {
            index: index + 1,
            id: flower.id, // Wichtig: Speichere die korrekte ID
            number: flower.number,
            name_german: flower.name_german,
            name_english: flower.name_english,
            description: flower.description || "Ihre Situation zu verbessern",
            drops: Math.floor(Math.random() * 3) + 2, // Zufällig 2-4 Tropfen
            affirmation: flower.affirmation || "Ich fühle mich ausgeglichen",
          };
        })
        .map(
          (flower) =>
            `${flower.index}. Nr.${flower.number} ${flower.name_german} (${flower.name_english}) - Diese Blüte kann Ihnen helfen, ${
              flower.description
            }. Die Affirmation "${flower.affirmation}" kann Sie dabei unterstützen. Empfohlene Dosierung: ${flower.drops} Tropfen.`,
        )
        .join("\n\n");

      devLog(recommendation);

      return `Gut, dann lass uns nun zu Phase 5 kommen und die passenden Bach-Blüten für deine Situation auswählen. 
Basierend auf deinen Schilderungen schlage ich folgende ${flowerCount} Blüten vor:

${recommendation}

Diese Mischung wurde speziell für deine Situation zusammengestellt. Die Blüten ergänzen sich in ihrer Wirkung 
und unterstützen dich bei deinem Entwicklungsprozess.

Lass mich wissen, was du dazu denkst! Ich kann die Auswahl noch einmal überdenken oder näher erläutern, wenn du möchtest.`;
    } catch (error) {
      console.error("Error generating mock recommendation:", error);
      return "Entschuldigung, es gab einen Fehler bei der Erstellung der Empfehlung. Bitte versuchen Sie es später erneut.";
    }
  };

  private static async buildFlowerContext(): Promise<string> {
    try {
      const flowers = await this.getAvailableFlowers();

      // Erstelle eine klar strukturierte, nummerierte Liste aller verfügbaren Blüten
      const flowerList = flowers
        .sort((a, b) => (a.number || 0) - (b.number || 0))
        .map((flower) => {
          const description = flower.description?.split(".")[0] || ""; // Nimm nur den ersten Satz der Beschreibung
          return `${flower.number}. ${flower.name_german} / ${flower.name_english}
- Anwendung: ${description}
- Affirmation: ${flower.affirmation || "Keine Angabe"}`;
        })
        .join("\n\n");

      return `VERFÜGBARE BACH-BLÜTEN (Verwende NUR diese mit exakter Nummer und Namen):

${flowerList}

DOSIERUNGSRICHTLINIEN:
- Pro Blüte: 2-4 Tropfen
- Gesamtanzahl: maximal 7 Blüten
- Einnahme: 4x täglich
- Dauer: 3-4 Wochen`;
    } catch (error) {
      console.error("Error building flower context:", error);
      throw error;
    }
  }

  static async getTherapeuticResponse(
    messages: ConsultationMessage[],
    isFirstMessage: boolean = false,
  ): Promise<string> {
    if (config.claude.useMockApi) {
      return this.generateMockRecommendation(messages.length);
    }

    try {
      const messageCount = messages.length;
      const flowerContext = await this.buildFlowerContext();
      const knowledgeBase = await this.initializeKnowledgeBase();

      // Bei der ersten Nachricht: Füge die komplette Wissensbasis hinzu
      if (isFirstMessage) {
        return `Ich habe alle Informationen zu den Bach-Blüten geladen und kenne ihre spezifischen Wirkungen. 
Lassen Sie uns mit der Beratung beginnen:

Wie kann ich Ihnen heute helfen? Erzählen Sie mir von Ihrer aktuellen Situation.`;
      }
      // Bestimme die aktuelle Gesprächsphase

      const currentPhase =
        messageCount <= 4
          ? 1
          : messageCount <= 8
            ? 2
            : messageCount <= 12
              ? 3
              : messageCount <= 16
                ? 4
                : 5;

      // Baue den vollständigen Prompt
      let fullPrompt = this.systemPrompt;
      if (currentPhase === 5) {
        fullPrompt += this.flowerRecommendationPrompt + "\n\n" + flowerContext;
      }

      // Verarbeite die Nachrichten
      const processedMessages = messages.map((msg, index) => {
        if (index === 0) {
          return {
            role: "user",
            content: `${this.systemPrompt}\n\n${knowledgeBase}\n\nKlient: ${msg.content}`,
          };
        }
        return msg;
      });

      // Hole Antwort von Claude
      const response = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1000,
        temperature: 0.7,
        messages: processedMessages,
      });

      let answer = response.content[0].text;

      // In der Empfehlungsphase: strukturiere die Antwort
      if (currentPhase === 5) {
        const formattedAnswer =
          await this.formatTherapeuticRecommendation(answer);
        answer = formattedAnswer;
      }

      return answer;
    } catch (error) {
      console.error("Claude API Error:", error);
      throw new Error("Fehler bei der Kommunikation mit Claude");
    }
  }

  // Neue Methode für die erste Kontaktaufnahme
  static async startConsultation(): Promise<string> {
    if (config.claude.useMockApi) {
      return "Willkommen zur Bach-Blüten Beratung (Development Mode). Wie kann ich Ihnen heute helfen?";
    }

    try {
      const knowledgeBase = await this.initializeKnowledgeBase();
      const initialPrompt = `${this.systemPrompt}\n\n${knowledgeBase}\n\nBereite dich auf die Beratung vor und bestätige, dass du alle Bach-Blüten-Informationen zur Verfügung hast.`;

      const response = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1000,
        temperature: 0.7,
        messages: [{ role: "user", content: initialPrompt }],
      });

      return response.content[0].text;
    } catch (error) {
      console.error("Error starting consultation:", error);
      throw new Error("Fehler beim Starten der Beratung");
    }
  }

  private static async formatTherapeuticRecommendation(
    response: string,
  ): Promise<string> {
    const flowers = await this.getAvailableFlowers();

    // Extrahiere die empfohlenen Blüten aus der Antwort
    const recommendations = [];
    for (const flower of flowers) {
      const regex = new RegExp(
        `Blüte ${flower.number}:\\s*${flower.name_german}.*?(?=Blüte|$)`,
        "si",
      );
      const match = response.match(regex);
      if (match) {
        recommendations.push({
          number: flower.number,
          name: flower.name_german,
          description: flower.description,
          matched_text: match[0],
        });
      }
    }

    if (recommendations.length === 0) {
      return `${response}`;
    }

    // Formatiere die Empfehlung
    return `BACH-BLÜTEN EMPFEHLUNG:

${recommendations
  .map(
    (rec, index) => `${index + 1}. Blüte ${rec.number}: ${rec.name}
${rec.matched_text.split("\n").slice(1).join("\n")}`,
  )
  .join("\n\n")}

ANWENDUNG:
- Mischen Sie die empfohlenen Tropfen in einer 30ml Stockbottle
- Füllen Sie diese mit Wasser und einem Teelöffel Brandy/Cognac auf
- Nehmen Sie 4x täglich 4 Tropfen aus dieser Mischung
- Lassen Sie die Tropfen kurz im Mund bevor Sie sie schlucken
- Empfohlene Anwendungsdauer: 3-4 Wochen

${response}`;
  }

  // Hilfsmethode zum Speichern einer Empfehlung
  static async saveRecommendation(
    clientId: string,
    therapistId: string,
    flowers: BachFlower[],
    notes: string,
  ): Promise<string> {
    try {
      const currentDate = new Date().toISOString();
      console.log("clientId", clientId);
      console.log("therapistId", therapistId);
      // Erstelle neue Blüten-Selektion
      const { data: selection, error: selectionError } = await supabase
        .from("flower_selections")
        .insert({
          client_id: clientId,
          therapist_id: therapistId,
          date: currentDate,
          notes: notes,
          status: "active",
          duration_weeks: 4,
          dosage_notes: "4x täglich 4 Tropfen",
          follow_up_date: new Date(
            Date.now() + 28 * 24 * 60 * 60 * 1000,
          ).toISOString(), // 4 Wochen später
        })
        .select()
        .single();

      if (selectionError || !selection) throw selectionError;

      // Parse die gespeicherten Details
      let savedDetails: SavedRecommendation[] = [];
      try {
        savedDetails = JSON.parse(notes);
      } catch (e) {
        console.error("Error parsing notes:", e);
      }

      // Füge die ausgewählten Blüten hinzu
      const flowerInserts = flowers.map((flower, index) => {
        const details = savedDetails.find((d) => d.id === flower.id);
        return {
          selection_id: selection.id,
          flower_id: flower.id,
          position: index + 1,
          notes: details?.reasoning || "",
        };
      });

      const { error: flowersError } = await supabase
        .from("selection_flowers")
        .insert(flowerInserts);

      if (flowersError) throw flowersError;

      // Aktualisiere das Inventar (optional)
      await this.updateInventory(therapistId, flowers);

      return selection.id;
    } catch (error) {
      console.error("Error saving recommendation:", error);
      throw new Error("Fehler beim Speichern der Empfehlung");
    }
  }
}
