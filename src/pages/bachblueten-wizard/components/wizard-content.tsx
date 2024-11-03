// src/pages/bachblueten-wizard/components/wizard-content.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useWizardContext } from "../hooks/use-wizard-context";
import { EmotionsAuswahl } from "./emotions-auswahl";
import { SymptomeAuswahl } from "./symptome-auswahl";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@radix-ui/react-progress";
import { BluetenVorschau } from "./flower-preview";

const STEPS = [
  { id: "welcome", title: "Willkommen" },
  { id: "emotion-groups", title: "Gefühlsbereiche" },
  { id: "symptoms", title: "Symptome" },
  { id: "flower-preview", title: "Blütenauswahl" },
  { id: "result", title: "Deine Empfehlung" },
] as const;

export const WizardContent: React.FC = () => {
  const {
    currentStep,
    nextStep,
    previousStep,
    selectedEmotionGroups,
    selectedSymptoms,
    selectedFlowers,
  } = useWizardContext();

  // Berechne den aktuellen Fortschritt
  const progress = () => {
    const currentIndex = STEPS.findIndex((step) => step.id === currentStep);
    return ((currentIndex + 1) / STEPS.length) * 100;
  };

  // Prüfen ob der nächste Schritt erlaubt ist
  const canProceed = () => {
    switch (currentStep) {
      case "emotion-groups":
        return selectedEmotionGroups.length > 0;
      case "symptoms":
        return selectedSymptoms.length >= 1;
      case "flower-preview":
        return selectedFlowers.length >= 1 && selectedFlowers.length <= 7;
      default:
        return true;
    }
  };

  // Render den aktuellen Schritt-Titel
  const renderStepTitle = () => {
    switch (currentStep) {
      case "welcome":
        return "Willkommen";
      case "emotion-groups":
        return "Gefühlsbereiche";
      case "symptoms":
        return "Symptome";
      case "result":
        return "Deine Empfehlung";
      default:
        return "";
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        return (
          <div className="text-center space-y-6 p-8">
            <h2 className="text-2xl font-bold">
              Willkommen beim Bachblüten Finder
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dieser Wizard hilft dir dabei, die passenden Bachblüten für deine
              aktuelle Situation zu finden. Der Prozess besteht aus drei
              einfachen Schritten:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 bg-white rounded-lg shadow-sm border">
                <div className="mb-4">
                  <Badge className="bg-blue-100 text-blue-800 mb-2">
                    Schritt 1
                  </Badge>
                </div>
                <h3 className="font-semibold mb-2">Gefühlsbereiche</h3>
                <p className="text-sm text-gray-500">
                  Wähle die Gefühlsbereiche aus, die dich aktuell beschäftigen
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm border">
                <div className="mb-4">
                  <Badge className="bg-green-100 text-green-800 mb-2">
                    Schritt 2
                  </Badge>
                </div>
                <h3 className="font-semibold mb-2">Symptome</h3>
                <p className="text-sm text-gray-500">
                  Spezifiziere die konkreten Symptome in den ausgewählten
                  Bereichen
                </p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm border">
                <div className="mb-4">
                  <Badge className="bg-purple-100 text-purple-800 mb-2">
                    Schritt 3
                  </Badge>
                </div>
                <h3 className="font-semibold mb-2">Empfehlung</h3>
                <p className="text-sm text-gray-500">
                  Erhalte deine persönliche Bachblüten-Mischung
                </p>
              </div>
            </div>

            <div className="mt-8 text-gray-600">
              <p>
                Die Auswahl basiert auf der traditionellen Bachblüten-Therapie
                und berücksichtigt deine individuellen Bedürfnisse.
              </p>
            </div>
          </div>
        );
      case "emotion-groups":
        return <EmotionsAuswahl />;
      case "symptoms":
        return <SymptomeAuswahl />;
      case "flower-preview":
        return <BluetenVorschau />;
      case "result":
        return <div>Ergebnis</div>;
    }
  };

  const currentStepInfo = STEPS.find((step) => step.id === currentStep);

  return (
    <div className="space-y-8">
      {/* Progress and Step Indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{currentStepInfo?.title}</span>
          <span>
            Schritt {STEPS.findIndex((step) => step.id === currentStep) + 1} von{" "}
            {STEPS.length}
          </span>
        </div>
        <Progress value={progress()} className="h-2" />
      </div>

      {/* Content */}
      <div className="min-h-[400px]">{renderStep()}</div>

      {/* Navigation */}
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
      </div>

      {/* Step-specific Guidance */}
      {currentStep === "flower-preview" && selectedFlowers.length > 7 && (
        <div className="mt-2 text-sm text-red-600">
          Bitte wähle maximal 7 Blüten aus
        </div>
      )}
    </div>
  );
};
