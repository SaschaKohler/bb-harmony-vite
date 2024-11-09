import {
  ScoringParameters,
  SuggestionResult,
  FlowerScore,
} from "@/types/bachblueten";
import { calculateFlowerScores } from "../utils/flower-scoring";
import { mockFlowers, mockSymptoms, TEST_SCENARIOS } from "./test-data";

export class ParameterTester {
  constructor(
    private readonly baseParams: ScoringParameters = {
      primaryWeight: 3.0,
      secondaryWeight: 0.6,
      emotionalGroupWeight: 2.0,
      coverageWeight: 1.0,
    },
  ) {}

  async testParameters(params: ScoringParameters) {
    const results = Object.entries(TEST_SCENARIOS).map(([key, scenario]) => {
      const result = calculateFlowerScores(
        mockFlowers,
        mockSymptoms,
        scenario.selectedEmotionGroups,
        scenario.selectedSymptoms,
        params,
      );

      return {
        scenario: key,
        name: scenario.name,
        passed: this.validateScenario(result, scenario.expected),
        metrics: this.calculateMetrics(result, scenario.expected),
      };
    });

    return this.analyzeResults(results);
  }

  private validateScenario(result: SuggestionResult, expected: any): boolean {
    // Prüfe HighPriority
    if (expected.highPriority) {
      const highPriorityMatch = this.validatePriorityGroup(
        result.priorityGroups.highPriority,
        expected.highPriority,
      );
      if (!highPriorityMatch) return false;
    }

    // Prüfe MediumPriority
    if (expected.mediumPriority) {
      const mediumPriorityMatch = this.validatePriorityGroup(
        result.priorityGroups.mediumPriority,
        expected.mediumPriority,
      );
      if (!mediumPriorityMatch) return false;
    }

    // Prüfe AdditionalOptions
    if (expected.additionalOptions) {
      const additionalOptionsMatch = this.validatePriorityGroup(
        result.priorityGroups.additionalOptions,
        expected.additionalOptions,
      );
      if (!additionalOptionsMatch) return false;
    }

    return true;
  }

  private validatePriorityGroup(
    actual: FlowerScore[],
    expected: any[],
  ): boolean {
    if (actual.length !== expected.length) return false;

    return expected.every((expectedFlower) => {
      const actualFlower = actual.find(
        (f) => f.flower.id === expectedFlower.flowerId,
      );
      if (!actualFlower) return false;

      return this.validateScores(actualFlower.scores, expectedFlower.scores);
    });
  }

  private validateScores(actual: any, expected: any): boolean {
    return Object.entries(expected).every(([key, value]) => {
      return Math.abs(actual[key] - value) < 0.01;
    });
  }

  private calculateMetrics(result: SuggestionResult, expected: any) {
    return {
      accuracy: this.calculateAccuracy(result, expected),
      coverage: this.calculateCoverage(result),
      balance: this.calculateDistribution(result),
    };
  }

  private calculateAccuracy(result: SuggestionResult, expected: any) {
    let correctPlacements = 0;
    let totalPlacements = 0;

    ["highPriority", "mediumPriority", "additionalOptions"].forEach((group) => {
      if (expected[group]) {
        totalPlacements += expected[group].length;
        correctPlacements += this.countCorrectPlacements(
          result.priorityGroups[group],
          expected[group],
        );
      }
    });

    return totalPlacements > 0 ? correctPlacements / totalPlacements : 1;
  }

  private countCorrectPlacements(
    actual: FlowerScore[],
    expected: any[],
  ): number {
    return expected.filter((exp) =>
      actual.some(
        (act) =>
          act.flower.id === exp.flowerId &&
          this.validateScores(act.scores, exp.scores),
      ),
    ).length;
  }

  private calculateCoverage(result: SuggestionResult) {
    return Object.values(result.statistics.coveragePerGroup).filter(
      (count) => count > 0,
    ).length;
  }

  private calculateDistribution(result: SuggestionResult) {
    const total =
      result.priorityGroups.highPriority.length +
      result.priorityGroups.mediumPriority.length +
      result.priorityGroups.additionalOptions.length;

    if (total === 0) return 1;

    const distribution = {
      high: result.priorityGroups.highPriority.length / total,
      medium: result.priorityGroups.mediumPriority.length / total,
      low: result.priorityGroups.additionalOptions.length / total,
    };

    const ideal = { high: 0.4, medium: 0.3, low: 0.3 };

    return (
      1 -
      (Math.abs(distribution.high - ideal.high) +
        Math.abs(distribution.medium - ideal.medium) +
        Math.abs(distribution.low - ideal.low)) /
        2
    );
  }

  private analyzeResults(results: any[]) {
    const summary = {
      totalScenarios: results.length,
      passedScenarios: results.filter((r) => r.passed).length,
      averageAccuracy:
        results.reduce((sum, r) => sum + r.metrics.accuracy, 0) /
        results.length,
      averageCoverage:
        results.reduce((sum, r) => sum + r.metrics.coverage, 0) /
        results.length,
      averageBalance:
        results.reduce((sum, r) => sum + r.metrics.balance, 0) / results.length,
      failedScenarios: results.filter((r) => !r.passed).map((r) => r.name),
    };

    return {
      results,
      summary,
    };
  }
}
