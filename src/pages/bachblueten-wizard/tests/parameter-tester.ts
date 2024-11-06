import { useFlowerSuggestions } from "../hooks/use-flower-suggestions";
import { testData } from "./test-data";

// src/pages/bachblueten-wizard/tests/parameter-tester.ts
interface ScoringParameters {
  primaryWeight: number;
  secondaryWeight: number;
  emotionalGroupWeight: number;
  coverageWeight: number;
}

export class ParameterTester {
  private baseParams: ScoringParameters = {
    primaryWeight: 3.0,
    secondaryWeight: 0.6,
    emotionalGroupWeight: 2.0,
    coverageWeight: 1.0,
  };

  async testParameters(params: ScoringParameters) {
    const testCases = this.generateTestCases();
    const results = [];

    for (const testCase of testCases) {
      const result = useFlowerSuggestions(
        testCase.flowers,
        testCase.symptoms,
        testCase.selectedEmotionGroups,
        testCase.selectedSymptoms,
        params,
      );

      results.push({
        testCase,
        result,
        metrics: this.calculateMetrics(result, testCase.expected),
      });
    }

    return this.analyzeResults(results);
  }

  private generateTestCases() {
    return [
      {
        name: "Angst-Szenario",
        flowers: testData.flowers,
        symptoms: testData.symptoms,
        selectedEmotionGroups: ["Ängste"],
        selectedSymptoms: ["vage_angst", "nervosität"],
        expected: {
          topFlower: "aspen",
          minScore: 5,
          maxScore: 12,
        },
      },
      // Weitere Test-Szenarien...
    ];
  }

  private calculateMetrics(result: any, expected: any) {
    return {
      accuracy: this.calculateAccuracy(result, expected),
      coverage: this.calculateCoverage(result),
      balance: this.calculateBalance(result),
    };
  }
}
