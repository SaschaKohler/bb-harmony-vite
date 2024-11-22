// src/scripts/test-scoring-parameters.ts
import { ParameterTester } from "../pages/bachblueten-wizard/tests/parameter-tester";

async function runParameterTests() {
  const tester = new ParameterTester();

  // Test verschiedene Parameter-Kombinationen
  const parameterSets = [
    {
      name: "Default",
      params: {
        primaryWeight: 3.0,
        secondaryWeight: 0.6,
        emotionalGroupWeight: 2.0,
        coverageWeight: 1.0,
      },
    },
    {
      name: "Balanced",
      params: {
        primaryWeight: 2.5,
        secondaryWeight: 0.8,
        emotionalGroupWeight: 2.0,
        coverageWeight: 1.2,
      },
    },
    // Weitere Parameter-Sets...
  ];

  console.log("Starting Parameter Tests...\n");

  for (const set of parameterSets) {
    console.log(`Testing ${set.name} Parameters:`);
    const results = await tester.testParameters(set.params);

    console.log(`\nResults for ${set.name}:`);
    console.log("=".repeat(50));
    console.log(
      `Passed: ${results.summary.passedScenarios}/${results.summary.totalScenarios} scenarios`,
    );
    console.log(
      `Average Accuracy: ${(results.summary.averageAccuracy * 100).toFixed(1)}%`,
    );
    console.log(
      `Average Coverage: ${(results.summary.averageCoverage * 100).toFixed(1)}%`,
    );
    console.log(
      `Balance Score: ${(results.summary.averageBalance * 100).toFixed(1)}%`,
    );

    if (results.summary.failedScenarios.length > 0) {
      console.log("\nFailed Scenarios:");
      results.summary.failedScenarios.forEach((scenario) => {
        console.log(`- ${scenario}`);
      });
    }
    console.log("\n");
  }
}

// Führe die Tests aus
runParameterTests().catch(console.error);
