// src/pages/bachblueten-wizard/constants/emotion-groups.ts

export const EMOTION_GROUPS = {
  Ängste: {
    description: "Verschiedene Arten von Ängsten und Befürchtungen",
    examples: ["Vage Ängste", "Bekannte Ängste", "Sorge um Andere"],
    color: "hsl(271, 81%, 53%)", // Hauptfarbe
    bgColor: "hsl(271, 81%, 97%)", // Hellerer Hintergrund
    borderColor: "hsl(271, 81%, 53%)", // Gleich wie Hauptfarbe
    textColor: "hsl(271, 81%, 30%)", // Dunklere Textfarbe
  },
  Unsicherheit: {
    description: "Zweifel und mangelndes Vertrauen in sich selbst",
    examples: ["Entscheidungsschwierigkeiten", "Orientierungslosigkeit"],
    color: "hsl(225, 73%, 57%)",
    bgColor: "hsl(225, 73%, 97%)",
    borderColor: "hsl(225, 73%, 57%)",
    textColor: "hsl(225, 73%, 30%)",
  },
  Realitätsferne: {
    description: "Mangelnde Präsenz im Hier und Jetzt",
    examples: ["Tagträumerei", "Desinteresse", "Gedankenkreisen"],
    color: "hsl(61, 100%, 50%)", // Gegenwart
    bgColor: "hsl(61, 100%, 97%)",
    borderColor: "hsl(61, 100%, 50%)",
    textColor: "hsl(61, 100%, 25%)",
  },
  Einsamkeit: {
    description: "Gefühle von Isolation und mangelnder Verbindung",
    examples: ["Zurückgezogenheit", "Kontaktbedürfnis"],
    color: "hsl(147, 50%, 36%)",
    bgColor: "hsl(147, 50%, 97%)",
    borderColor: "hsl(147, 50%, 36%)",
    textColor: "hsl(147, 50%, 20%)",
  },
  Übersensibilität: {
    description: "Starke Reaktionen auf äußere und innere Einflüsse",
    examples: ["Reizbarkeit", "Beeinflussbarkeit"],
    color: "hsl(39, 100%, 50%)", // Sensibilität
    bgColor: "hsl(39, 100%, 97%)",
    borderColor: "hsl(39, 100%, 50%)",
    textColor: "hsl(39, 100%, 30%)",
  },
  "Mutlosigkeit & Verzweiflung": {
    description: "Gefühle von Hoffnungslosigkeit und Resignation",
    examples: ["Selbstzweifel", "Erschöpfung"],
    color: "hsl(348, 83%, 47%)",
    bgColor: "hsl(348, 83%, 97%)",
    borderColor: "hsl(348, 83%, 47%)",
    textColor: "hsl(348, 83%, 30%)",
  },
  "Übermäßige Fürsorge": {
    description: "Übertriebene Sorge und Kontrolle gegenüber anderen",
    examples: ["Dominanz", "Besitzergreifende Liebe"],
    color: "hsl(181, 71%, 56%)",
    bgColor: "hsl(181, 71%, 97%)",
    borderColor: "hsl(181, 71%, 56%)",
    textColor: "hsl(181, 71%, 30%)",
  },
} as const;

// Hilfs-Funktionen für Farbmanipulation
export const getColorVariants = (hsl: string) => {
  const [h, s, l] = hsl.match(/\d+/g)?.map(Number) || [];
  return {
    base: `hsl(${h}, ${s}%, ${l}%)`,
    light: `hsl(${h}, ${s}%, 97%)`,
    dark: `hsl(${h}, ${s}%, 30%)`,
    hover: `hsl(${h}, ${s}%, ${l + 5}%)`,
    pressed: `hsl(${h}, ${s}%, ${l - 5}%)`,
    border: `hsl(${h}, ${s}%, ${l}%)`,
  };
};

export type EmotionGroupName = keyof typeof EMOTION_GROUPS;

export interface EmotionGroupInfo {
  description: string;
  examples: string[];
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}
