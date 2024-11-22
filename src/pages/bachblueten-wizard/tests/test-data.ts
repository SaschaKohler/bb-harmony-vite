// src/pages/bachblueten-wizard/tests/test-data.ts
import type { BachFlower, Symptom } from "@/types/bachblueten";

export const TEST_SCENARIOS = {
  ASPEN_PRIMARY: {
    name: "Aspen Primary Symptoms",
    selectedEmotionGroups: ["Ängste"],
    selectedSymptoms: ["vage_angst"],
    expected: {
      highPriority: [
        {
          flowerId: "aspen",
          scores: {
            primarySymptomMatch: 3.0,
            total: 6.0, // 3 (primary) + 2 (emotional) + 1 (coverage)
          },
        },
      ],
    },
  },
  ASPEN_SECONDARY: {
    name: "Aspen Secondary Symptoms",
    selectedEmotionGroups: ["Ängste"],
    selectedSymptoms: ["nervosität"],
    expected: {
      additionalOptions: [
        {
          flowerId: "aspen",
          scores: {
            secondarySymptomMatch: 0.6,
            total: 3.6, // 0.6 (secondary) + 2 (emotional) + 1 (coverage)
          },
        },
      ],
    },
  },
  ASPEN_MIXED: {
    name: "Aspen Mixed Symptoms",
    selectedEmotionGroups: ["Ängste"],
    selectedSymptoms: ["vage_angst", "nervosität"],
    expected: {
      highPriority: [
        {
          flowerId: "aspen",
          scores: {
            primarySymptomMatch: 3.0,
            secondarySymptomMatch: 0.6,
            total: 6.6, // 3 (primary) + 0.6 (secondary) + 2 (emotional) + 1 (coverage)
          },
        },
      ],
    },
  },
};

// Helper-Funktion für Mock-Symptome
function createMockSymptom(overrides: Partial<Symptom> = {}): Symptom {
  return {
    id: "mock-symptom",
    name: "Mock Symptom",
    description: null,
    group_id: null, // Required field hinzugefügt
    emotion_category: "Ängste",
    indication_type: "primary",
    secondary_symptoms: [], // Optional, aber gut für Tests
    ...overrides,
  };
}

// Helper-Funktion für Mock-Blüten
function createMockFlower(overrides: Partial<BachFlower> = {}): BachFlower {
  return {
    id: "mock-flower",
    name_german: "Mock Flower",
    name_english: "Mock Flower",
    name_latin: null,
    affirmation: null,
    color: null,
    description: null,
    emotion_id: null,
    number: null,
    created_at: null,
    updated_at: null,
    flower_symptom_relations: [],
    ...overrides,
  };
}

// Mock-Daten mit Helper-Funktionen
export const mockSymptoms: Symptom[] = [
  createMockSymptom({
    id: "vage_angst",
    name: "Vage Ängste",
    emotion_category: "Ängste",
    description: "Unbegründete Befürchtungen",
    group_id: "angst-gruppe", // Required field
    indication_type: "primary",
  }),
  createMockSymptom({
    id: "nervosität",
    name: "Nervosität",
    emotion_category: "Ängste",
    description: "Innere Unruhe",
    group_id: "angst-gruppe", // Required field
    indication_type: "secondary",
  }),
  createMockSymptom({
    id: "sorge_um_andere",
    name: "Sorge um Andere",
    emotion_category: "Ängste",
    description: "Innere Unruhe",
    group_id: "angst-gruppe", // Required field
    indication_type: "primary",
  }),
];

export const mockFlowers: BachFlower[] = [
  createMockFlower({
    id: "aspen",
    name_german: "Aspen",
    name_english: "Aspen",
    flower_symptom_relations: [
      {
        symptom_id: "vage_angst",
        is_primary: true,
        flower_id: "aspen",
        created_at: null,
        id: "vage_angst",
      },
      {
        symptom_id: "sorge_um_andere",
        is_primary: true,
        flower_id: "aspen",
        created_at: null,
        id: "sorge_um_andere",
      },
      {
        symptom_id: "nervosität",
        is_primary: false,
        flower_id: "aspen",
        created_at: null,
        id: "nervosität",
      },
    ],
  }),
];
