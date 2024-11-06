// src/pages/bachblueten-wizard/tests/test-data.ts
export const testData = {
  flowers: [
    {
      id: "aspen",
      name_german: "Aspen",
      name_english: "Aspen",
      flower_symptom_relations: [
        { symptom_id: "vage_angst", is_primary: true },
        { symptom_id: "nervosität", is_primary: false },
      ],
    },
    // Weitere Testblüten...
  ],
  symptoms: [
    {
      id: "vage_angst",
      name: "Vage Ängste",
      emotion_category: "Ängste",
      description: "Unbegründete Befürchtungen",
    },
    // Weitere Testsymptome...
  ],
};
