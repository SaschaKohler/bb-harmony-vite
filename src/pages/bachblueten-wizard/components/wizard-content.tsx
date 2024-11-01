import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useWizardContext } from "../hooks/use-wizard-context";
import { EmotionsAuswahl } from "./emotions-auswahl";
import { SymptomeAuswahl } from "./symptome-auswahl";
import { ErgebnisAnsicht } from "./ergebnis-ansicht";

export const WizardContent: React.FC = () => {
  const {
    currentStep,
    nextStep,
    previousStep,
    selectedEmotions,
    selectedSymptoms,
  } = useWizardContext();

  // Prüfen ob der nächste Schritt erlaubt ist
  const canProceed = () => {
    switch (currentStep) {
      case "emotions":
        return selectedEmotions.length > 0;
      case "symptoms":
        return selectedSymptoms.length > 0;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        return (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold">
              Willkommen beim Bachblüten Finder
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dieser Wizard hilft dir dabei, die passenden Bachblüten für deine
              aktuelle Situation zu finden. Der Prozess besteht aus drei
              einfachen Schritten:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">1. Emotionen</h3>
                <p className="text-sm text-gray-500">
                  Wähle die Gefühle aus, die dich aktuell beschäftigen
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">2. Symptome</h3>
                <p className="text-sm text-gray-500">
                  Beschreibe deine konkreten Symptome
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">3. Empfehlung</h3>
                <p className="text-sm text-gray-500">
                  Erhalte deine persönliche Bachblüten-Empfehlung
                </p>
              </div>
            </div>
          </div>
        );
      case "emotions":
        return <EmotionsAuswahl />;
      case "symptoms":
        return <SymptomeAuswahl />;
      // case "result":
      //   return <ErgebnisAnsicht />;
    }
  };

  return (
    <div className="space-y-8">
      {renderStep()}

      <div className="flex justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={previousStep}
          disabled={currentStep === "welcome"}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Zurück
        </Button>

        {currentStep !== "result" && (
          <Button onClick={nextStep} disabled={!canProceed()}>
            {currentStep === "symptoms" ? "Empfehlung anzeigen" : "Weiter"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}

        {currentStep === "result" && (
          <Button variant="outline" onClick={() => window.print()}>
            Ergebnis drucken
          </Button>
        )}
      </div>
    </div>
  );
};
