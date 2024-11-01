import React from "react";
import { Card } from "@/components/ui/card";
import { WizardProvider } from "./context/wizard-context";
import { WizardContent } from "./components/wizard-content";

const BachbluetenWizardPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Bachblüten Finder</h1>
        <p className="text-gray-600 mt-2">
          Finde die passenden Bachblüten für deine aktuelle Situation
        </p>
      </header>

      <WizardProvider>
        <Card className="max-w-4xl mx-auto">
          <div className="p-6">
            <WizardContent />
          </div>
        </Card>
      </WizardProvider>
    </div>
  );
};

// Exportiere die Komponente als default
export default BachbluetenWizardPage;

// Exportiere auch den Komponenten-Namen für besseres Debugging
BachbluetenWizardPage.displayName = "BachbluetenWizardPage";
