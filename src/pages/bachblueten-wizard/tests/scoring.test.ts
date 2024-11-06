// src/pages/bachblueten-wizard/tests/scoring.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { useFlowerSuggestions } from "../hooks/use-flower-suggestions";
import type { BachFlower, Symptom } from "../types";
import { testData } from "./test-data";

describe("Flower Suggestion Scoring", () => {
  // Test Data Setup
  const mockFlowers: BachFlower[] = testData.flowers;
  const mockSymptoms: Symptom[] = testData.symptoms;

  describe("Primary Symptom Scoring", () => {
    it("should give high priority to flowers matching primary symptoms", () => {
      const result = useFlowerSuggestions(
        mockFlowers,
        mockSymptoms,
        ["Ängste"],
        ["vage_angst"],
      );

      // Prüfe Scoring für Hauptsymptome
      expect(result.priorityGroups.highPriority).toContainEqual(
        expect.objectContaining({
          flower: expect.objectContaining({ name_german: "Aspen" }),
          scores: expect.objectContaining({
            primarySymptomMatch: 3.0,
            total: expect.any(Number),
          }),
        }),
      );
    });

    it("should calculate secondary symptom weights correctly", () => {
      const result = useFlowerSuggestions(
        mockFlowers,
        mockSymptoms,
        ["Ängste"],
        ["nervosität"],
      );

      const aspenScore = result.priorityGroups.mediumPriority.find(
        (f) => f.flower.name_german === "Aspen",
      );

      expect(aspenScore?.scores.secondarySymptomMatch).toBeCloseTo(0.6);
    });
  });

  describe("Emotional Group Coverage", () => {
    it("should consider multiple emotion groups in scoring", () => {
      const result = useFlowerSuggestions(
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
      const result = useFlowerSuggestions(
        mockFlowers,
        mockSymptoms,
        ["Ängste"],
        ["vage_angst", "nervosität"],
      );

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
      const result = useFlowerSuggestions(mockFlowers, mockSymptoms, [], []);

      expect(result.priorityGroups.highPriority).toHaveLength(0);
      expect(result.statistics.totalMatches).toBe(0);
    });

    it("should handle maximum selections", () => {
      const result = useFlowerSuggestions(
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
