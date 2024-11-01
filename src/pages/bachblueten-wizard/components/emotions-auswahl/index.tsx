import React, { useMemo } from "react";
import { useWizardContext } from "../../hooks/use-wizard-context";
import { useWizardData } from "../../hooks/use-wizard-data";
import { EmotionCard } from "./emotion-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export const EmotionsAuswahl: React.FC = () => {
  const {
    selectedEmotions,
    emotionIntensities,
    selectEmotion,
    deselectEmotion,
    setEmotionIntensity,
  } = useWizardContext();

  const { emotions, loading, error } = useWizardData();

  // Gruppiere Emotionen nach Kategorien (falls vorhanden)
  const groupedEmotions = useMemo(() => {
    const grouped = emotions.reduce(
      (acc, emotion) => {
        // Hier könnten wir später nach Kategorien gruppieren
        // Aktuell alle in "Alle Emotionen"
        const category = "Alle Emotionen";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(emotion);
        return acc;
      },
      {} as Record<string, typeof emotions>,
    );

    return grouped;
  }, [emotions]);

  const handleEmotionToggle = (emotionId: string) => {
    if (selectedEmotions.includes(emotionId)) {
      deselectEmotion(emotionId);
    } else {
      selectEmotion(emotionId);
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
          Fehler beim Laden der Emotionen: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Wie fühlst du dich?</h2>
        <p className="text-gray-600">
          Wähle die Emotionen aus, die am besten zu deiner aktuellen Situation
          passen. Bewerte anschließend ihre Intensität auf einer Skala von 1-10.
        </p>
      </div>

      {Object.entries(groupedEmotions).map(([category, categoryEmotions]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryEmotions.map((emotion) => (
              <EmotionCard
                key={emotion.id}
                emotion={emotion}
                isSelected={selectedEmotions.includes(emotion.id)}
                intensity={emotionIntensities[emotion.id]}
                onSelect={() => handleEmotionToggle(emotion.id)}
                onIntensityChange={(value) =>
                  setEmotionIntensity(emotion.id, value)
                }
              />
            ))}
          </div>
        </div>
      ))}

      {selectedEmotions.length > 0 && (
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600">
            {selectedEmotions.length}{" "}
            {selectedEmotions.length === 1 ? "Emotion" : "Emotionen"} ausgewählt
          </p>
        </div>
      )}
    </div>
  );
};

EmotionsAuswahl.displayName = "EmotionsAuswahl";
