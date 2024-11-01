// src/pages/TherapyConsultation.tsx
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User2, Send, Loader2, Bot, MessageSquare, Flower } from "lucide-react";
import { ClaudeConsultationService } from "@/lib/services/claudeConsultationService";
import { FlowerRecommendationView } from "./components";
import { RecommendedFlower } from "@/types/bachFlowerTypes";

const isDevelopment = import.meta.env.VITE_USE_MOCK_API === "true";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
}

const TherapyConsultation = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [recommendedFlowers, setRecommendedFlowers] = useState<
    RecommendedFlower[]
  >([]);
  const [currentTab, setCurrentTab] = useState("chat");
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);

  // Initialisiere die Beratung
  useEffect(() => {
    const initConsultation = async () => {
      try {
        setIsLoading(true);
        const initialResponse =
          await ClaudeConsultationService.startConsultation();
        setMessages([
          {
            id: "1",
            role: "assistant",
            content: initialResponse,
            timestamp: new Date(),
          },
        ]);
        setIsInitialized(true);
        toast.success("Bereit für die Beratung");
      } catch (error) {
        console.error("Initialization error:", error);
        toast.error("Fehler beim Laden der Bach-Blüten-Informationen");
      } finally {
        setIsLoading(false);
      }
    };

    initConsultation();
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const messageToSend = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      // Füge User-Nachricht hinzu
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: messageToSend,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Hole Antwort von Claude/
      const response = await ClaudeConsultationService.getTherapeuticResponse(
        [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        })),
      );

      // Füge Claude's Antwort hinzu
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      console.log(response);
      setMessages((prev) => [...prev, assistantMessage]);

      // Prüfe auf Blütenempfehlungen in der Antwort
      if (messages.length > 16) {
        // Empfehlungsphase
        const extractedFlowers = await extractRecommendations(response);
        console.log("Extracted Flowers with DB data:", extractedFlowers);

        if (extractedFlowers.length > 0) {
          setRecommendedFlowers(extractedFlowers);
          setCurrentTab("recommendations");
        }
      }
    } catch (error) {
      console.error("Message error:", error);
      toast.error("Fehler bei der Kommunikation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const extractRecommendations = async (
    response: string,
  ): Promise<RecommendedFlower[]> => {
    const recommendations: RecommendedFlower[] = [];

    if (isDevelopment) {
      const recommendations: RecommendedFlower[] = [];
      const flowerRegex =
        /\d+\.\s+Nr\.(\d+)\s+([^(]+)\(([^)]+)\)\s*-\s*([^.]+)/g;

      try {
        let match;
        while ((match = flowerRegex.exec(response)) !== null) {
          const [_, blossomNumber, germanName, englishName, description] =
            match;

          // Hole die Blüte aus der Datenbank
          const { data: flower, error } = await supabase
            .from("bach_flowers")
            .select("*")
            .eq("number", parseInt(blossomNumber))
            .single();

          if (error) throw error;
          if (!flower) {
            console.error(`Blüte Nr. ${blossomNumber} nicht gefunden`);
            continue;
          }

          // Füge die Empfehlung mit den Datenbankdaten hinzu
          recommendations.push({
            flower: {
              id: flower.id,
              number: flower.number,
              name_german: flower.name_german,
              name_english: flower.name_english,
              description: flower.description,
              affirmation: flower.affirmation,
              emotion_id: flower.emotion_id,
            },
            drops: 4, // oder aus dem Text extrahieren
            reasoning: description.trim(),
          });
        }

        return recommendations;
      } catch (error) {
        console.error("Error fetching flowers:", error);
        return [];
      }
    }
    // ... Rest des Codes
    return recommendations;
  };

  return (
    <div className="container mx-auto py-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Beratungsgespräch
          </TabsTrigger>
          <TabsTrigger
            value="recommendations"
            className="flex items-center gap-2"
          >
            <Flower className="h-4 w-4" />
            Empfehlungen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <Card className="min-h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Bach-Blüten Beratung</CardTitle>
              <CardDescription>
                Erzählen Sie von Ihrer aktuellen Situation und Ihren
                Bedürfnissen
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              {/* Nachrichtenbereich */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "assistant"
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${
                        message.role === "assistant"
                          ? "flex-row"
                          : "flex-row-reverse"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center
                        ${message.role === "assistant" ? "bg-blue-500" : "bg-green-500"}`}
                      >
                        {message.role === "assistant" ? (
                          <Bot className="w-5 h-5 text-white" />
                        ) : (
                          <User2 className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div
                        className={`rounded-lg p-4 ${
                          message.role === "assistant"
                            ? "bg-blue-50 text-blue-900"
                            : "bg-green-50 text-green-900"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Eingabebereich */}
              <div className="flex items-end space-x-2 p-4 bg-gray-50 rounded-lg">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Beschreiben Sie Ihre Situation..."
                  className="resize-none bg-white"
                  rows={3}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="mb-[3px]"
                  variant="default"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          {recommendedFlowers.length > 0 ? (
            <FlowerRecommendationView flowers={recommendedFlowers} />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  Noch keine Empfehlungen verfügbar. Führen Sie zuerst ein
                  Beratungsgespräch durch.
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TherapyConsultation;
