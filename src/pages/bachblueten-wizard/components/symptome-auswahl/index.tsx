import React, { useMemo } from "react";
import { useWizardContext } from "../../hooks/use-wizard-context";
import { useWizardData } from "../../hooks/use-wizard-data";
import { SymptomCard } from "./symptom-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, XCircle } from "lucide-react";
import { useState } from "react";

export const SymptomeAuswahl: React.FC = () => {
  const { selectedEmotions, selectedSymptoms, selectSymptom, deselectSymptom } =
    useWizardContext();

  const { emotions, bachFlowers, loading, error } = useWizardData();
  const [searchTerm, setSearchTerm] = useState("");

  // Symptome aus den Bachblüten extrahieren und mit Emotionen verknüpfen
  const symptoms = useMemo(() => {
    const symptomMap = new Map();

    bachFlowers.forEach((flower) => {
      const emotion = emotions.find((e) => e.id === flower.emotion_id);

      if (flower.description) {
        // Hier könnten wir später die Symptome aus der Beschreibung extrahieren
        // Für jetzt nehmen wir die Beschreibung als Symptom
        const symptomKey = flower.description.toLowerCase();

        if (!symptomMap.has(symptomKey)) {
          symptomMap.set(symptomKey, {
            id: `symptom-${flower.id}`,
            bezeichnung: flower.name_german || flower.name_english,
            beschreibung: flower.description,
            verwandteEmotionen: emotion ? [emotion] : [],
          });
        } else {
          const symptom = symptomMap.get(symptomKey);
          if (
            emotion &&
            !symptom.verwandteEmotionen.find((e) => e.id === emotion.id)
          ) {
            symptom.verwandteEmotionen.push(emotion);
          }
        }
      }
    });

    return Array.from(symptomMap.values());
  }, [bachFlowers, emotions]);

  // Filtern basierend auf Suche und ausgewählten Emotionen
  const filteredSymptoms = useMemo(() => {
    return symptoms.filter((symptom) => {
      const matchesSearch =
        searchTerm === "" ||
        symptom.bezeichnung.toLowerCase().includes(searchTerm.toLowerCase()) ||
        symptom.beschreibung.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEmotions =
        selectedEmotions.length === 0 ||
        symptom.verwandteEmotionen.some((emotion) =>
          selectedEmotions.includes(emotion.id),
        );

      return matchesSearch && matchesEmotions;
    });
  }, [symptoms, searchTerm, selectedEmotions]);

  const handleSymptomToggle = (symptomId: string) => {
    if (selectedSymptoms.includes(symptomId)) {
      deselectSymptom(symptomId);
    } else {
      selectSymptom(symptomId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>
          Fehler beim Laden der Symptome: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">
          Welche Symptome nimmst du wahr?
        </h2>
        <p className="text-gray-600">
          Wähle die Symptome aus, die zu deiner Situation passen. Die Vorschläge
          basieren auf deinen ausgewählten Emotionen.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            type="search"
            placeholder="Symptome suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {selectedEmotions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedEmotions.map((emotionId) => {
              const emotion = emotions.find((e) => e.id === emotionId);
              return emotion ? (
                <Badge key={emotion.id} variant="secondary">
                  {emotion.name}
                </Badge>
              ) : null;
            })}
          </div>
        )}
      </div>

      {filteredSymptoms.length > 0 ? (
        <ScrollArea className="h-[500px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSymptoms.map((symptom) => (
              <SymptomCard
                key={symptom.id}
                {...symptom}
                isSelected={selectedSymptoms.includes(symptom.id)}
                onSelect={() => handleSymptomToggle(symptom.id)}
              />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <XCircle className="h-8 w-8 mb-2" />
          <p>Keine Symptome gefunden</p>
        </div>
      )}

      {selectedSymptoms.length > 0 && (
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600">
            {selectedSymptoms.length}{" "}
            {selectedSymptoms.length === 1 ? "Symptom" : "Symptome"} ausgewählt
          </p>
        </div>
      )}
    </div>
  );
};

SymptomeAuswahl.displayName = "SymptomeAuswahl";
