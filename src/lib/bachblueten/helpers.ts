import { BachFlower } from "@/types/bachFlowerTypes";

interface BachFlowerLibraryProps {
  flowers: Array<{
    id: string;
    name_english: string;
    name_german: string;
    name_latin: string;
    affirmation: string;
    description: string;
    number: number;
    emotion: {
      id: string;
      name: string;
      description: string;
      color: string;
    };
    flower_symptom_relations: Array<{
      id: string;
      symptom_id: string;
      is_primary: boolean;
      symptom?: {
        name: string;
      };
    }>;
  }>;
}

export function getApplicationAreas(flower: BachFlowerLibraryProps): string[] {
  // Diese Funktion könnte die Anwendungsbereiche basierend auf den Symptomen
  // und der Gefühlsgruppe zusammenstellen
  const areas = new Set<string>();

  // Aus den primären Symptomen
  flower.flower_symptom_relations
    .filter((rel) => rel.is_primary && rel.symptom)
    .forEach((rel) => {
      if (rel.symptom?.description) {
        areas.add(rel.symptom.description);
      }
    });

  // Aus der Gefühlsgruppe
  if (flower.emotion?.description) {
    areas.add(flower.emotion.description);
  }

  return Array.from(areas);
}
