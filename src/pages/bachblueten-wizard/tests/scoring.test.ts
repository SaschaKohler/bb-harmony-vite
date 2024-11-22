import { describe, it, expect } from "vitest";
import { calculateFlowerScores } from "../utils/flower-scoring";
import { mockFlowers, mockSymptoms } from "./test-data";

describe("Flower Suggestion Scoring", () => {
  describe("Edge Cases", () => {
    it("should handle empty selections", () => {
      const result = calculateFlowerScores(mockFlowers, mockSymptoms, [], []);

      expect(result.priorityGroups.highPriority).toHaveLength(0);
      expect(result.statistics.totalMatches).toBe(0);
    });

    it("should handle maximum selections", () => {
      const result = calculateFlowerScores(
        mockFlowers,
        mockSymptoms,
        ["Ängste", "Unsicherheit", "Realitätsferne"],
        ["vage_angst", "nervosität", "kontrollverlust"],
      );

      expect(result.statistics.totalMatches).toBeGreaterThan(0);
      expect(Object.keys(result.statistics.coveragePerGroup)).toHaveLength(3);
    });
  });
});

describe("Flower Suggestion Scoring", () => {
  // Test-Daten
  describe("Primary Symptom Scoring", () => {
    it("should give high priority to flowers matching primary symptoms", () => {
      const result = calculateFlowerScores(
        mockFlowers,
        mockSymptoms,
        ["Ängste"],
        ["vage_angst", "nervosität", "sorge_um_andere"],
      );
      console.log(result);
      expect(result.priorityGroups.highPriority).toHaveLength(1);

      //Prüfe erstes Element
      //
      const scoredFlowers = result.priorityGroups.highPriority[0];
      console.log(scoredFlowers);
      // expect(scoredFlowers).toEqual({
      //   flower: expect.objectContaining({
      //     name_german: "Aspen",
      //   }),
      // });
      // Prüfe das erste Element mit expect.objectContaining
      const flowerResult = result.priorityGroups.highPriority[0];
      expect(flowerResult).toMatchObject({
        flower: {
          id: "aspen",
          name_german: "Aspen",
          name_english: "Aspen",
          name_latin: null,
          affirmation: null,
          color: null,
          description: null,
          emotion_id: null,
          flower_symptom_relations: expect.arrayContaining([
            expect.objectContaining({
              flower_id: "aspen",
              is_primary: true,
              symptom_id: "vage_angst",
            }),
            expect.objectContaining({
              flower_id: "aspen",
              is_primary: true,
              symptom_id: "sorge_um_andere",
            }),
            expect.objectContaining({
              flower_id: "aspen",
              is_primary: false,
              symptom_id: "nervosität",
            }),
          ]),
        },
        scores: {
          primarySymptomMatch: 6.0,
          secondarySymptomMatch: expect.any(Number),
          emotionalGroupMatch: expect.any(Number),
          symptomGroupCoverage: expect.any(Number),
          total: expect.any(Number),
        },
        matchedSymptoms: {
          primary: expect.any(Array),
          secondary: expect.any(Array),
        },
      });
      // Prüfe Scoring für Hauptsymptome
    });

    it("should calculate secondary symptom correctly", () => {
      const result = calculateFlowerScores(
        mockFlowers,
        mockSymptoms,
        ["Ängste"],
        ["nervosität"],
      );

      console.log(result);

      const aspenScore = result.priorityGroups.additionalOptions.find(
        (f) => f.flower.name_german === "Aspen",
      );

      // Null-Check hinzufügen
      expect(aspenScore).toBeDefined();
      console.log(aspenScore);
      expect(aspenScore).toMatchObject({
        flower: {
          id: "aspen",
          name_german: "Aspen",
        },
        scores: {
          primarySymptomMatch: 0,
          secondarySymptomMatch: 0.6,
          emotionalGroupMatch: 2,
          symptomGroupCoverage: 1,
          total: 3.6,
        },
      });
    });
  });

  describe("Emotional Group Coverage", () => {
    it("should consider multiple emotion groups in scoring", () => {
      const result = calculateFlowerScores(
        mockFlowers,
        mockSymptoms,
        ["Ängste", "Unsicherheit"],
        ["vage_angst", "nervosität"],
      );

      expect(result.statistics.coveragePerGroup).toEqual({
        Ängste: expect.any(Number),
        Unsicherheit: expect.any(Number),
      });
    });
  });

  describe("Score Thresholds", () => {
    it("should correctly categorize flowers based on total score", () => {
      const result = calculateFlowerScores(
        mockFlowers,
        mockSymptoms,
        ["Ängste"],
        ["vage_angst", "nervosität"],
      );
      console.log(result);
      // High Priority: score >= 8 && primaryMatch > 0
      result.priorityGroups.highPriority.forEach((flower) => {
        expect(flower.scores.total).toBeGreaterThanOrEqual(8);
        expect(flower.scores.primarySymptomMatch).toBeGreaterThan(0);
      });

      // Medium Priority: 5 <= score < 8
      result.priorityGroups.mediumPriority.forEach((flower) => {
        expect(flower.scores.total).toBeGreaterThanOrEqual(5);
        expect(flower.scores.total).toBeLessThan(8);
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty selections", () => {
      const result = calculateFlowerScores(mockFlowers, mockSymptoms, [], []);

      expect(result.priorityGroups.highPriority).toHaveLength(0);
      expect(result.statistics.totalMatches).toBe(0);
    });

    it("should handle maximum selections", () => {
      const result = calculateFlowerScores(
        mockFlowers,
        mockSymptoms,
        ["Ängste", "Unsicherheit", "Realitätsferne"],
        ["vage_angst", "nervosität", "kontrollverlust"],
      );

      expect(result.statistics.totalMatches).toBeGreaterThan(0);
      expect(Object.keys(result.statistics.coveragePerGroup)).toHaveLength(3);
    });
  });
});
