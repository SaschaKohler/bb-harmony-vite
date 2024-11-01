// hooks/useWizardContext.ts
import { useContext } from "react";
import { WizardContext } from "../context/wizard-context";
import type { WizardContextType } from "../types";

export function useWizardContext(): WizardContextType {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error("useWizardContext must be used within a WizardProvider");
  }
  return context;
}
