// src/pages/bachblueten-wizard/constants/emotion-groups.ts

export const EMOTION_GROUPS = {
  Ängste: {
    description: "Verschiedene Arten von Ängsten und Befürchtungen",
    examples: ["Vage Ängste", "Bekannte Ängste", "Sorge um Andere"],
    color: "#FFB700",
    bgColor: "#FFF8E6",
    borderColor: "#FFB700",
    textColor: "#815B00",
  },
  Unsicherheit: {
    description: "Zweifel und mangelndes Vertrauen in sich selbst",
    examples: ["Entscheidungsschwierigkeiten", "Orientierungslosigkeit"],
    color: "#6B4EAF",
    bgColor: "#F3F0FF",
    borderColor: "#6B4EAF",
    textColor: "#432B93",
  },
  Realitätsferne: {
    description: "Mangelnde Präsenz im Hier und Jetzt",
    examples: ["Tagträumerei", "Desinteresse", "Gedankenkreisen"],
    color: "#0EA5E9",
    bgColor: "#F0F9FF",
    borderColor: "#0EA5E9",
    textColor: "#075985",
  },
  Einsamkeit: {
    description: "Gefühle von Isolation und mangelnder Verbindung",
    examples: ["Zurückgezogenheit", "Kontaktbedürfnis"],
    color: "#2563EB",
    bgColor: "#EFF6FF",
    borderColor: "#2563EB",
    textColor: "#1E40AF",
  },
  Übersensibilität: {
    description: "Starke Reaktionen auf äußere und innere Einflüsse",
    examples: ["Reizbarkeit", "Beeinflussbarkeit"],
    color: "#EC4899",
    bgColor: "#FDF2F8",
    borderColor: "#EC4899",
    textColor: "#BE185D",
  },
  "Mutlosigkeit & Verzweiflung": {
    description: "Gefühle von Hoffnungslosigkeit und Resignation",
    examples: ["Selbstzweifel", "Erschöpfung"],
    color: "#7C2D12",
    bgColor: "#FEF3C7",
    borderColor: "#7C2D12",
    textColor: "#78350F",
  },
  "Übermäßige Fürsorge": {
    description: "Übertriebene Sorge und Kontrolle gegenüber anderen",
    examples: ["Dominanz", "Besitzergreifende Liebe"],
    color: "#059669",
    bgColor: "#ECFDF5",
    borderColor: "#059669",
    textColor: "#047857",
  },
} as const;

export type EmotionGroupName = keyof typeof EMOTION_GROUPS;

export interface EmotionGroupInfo {
  description: string;
  examples: string[];
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}
