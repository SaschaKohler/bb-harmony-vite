// src/pages/bachblueten-wizard/tests/run-tests.ts
import { ParameterTester } from "./parameter-tester";

async function optimizeParameters() {
  const tester = new ParameterTester();

  // Test verschiedene Parameter-Sets
  const parameterSets = [
    {
      // Original
      primaryWeight: 3.0,
      secondaryWeight: 0.6,
      emotionalGroupWeight: 2.0,
      coverageWeight: 1.0,
    },
    {
      // Alternative 1
      primaryWeight: 4.0,
      secondaryWeight: 0.5,
      emotionalGroupWeight: 1.8,
      coverageWeight: 1.0,
    },
    // Weitere Parameter-Sets...
  ];

  const results = await Promise.all(
    parameterSets.map((params) => tester.testParameters(params)),
  );

  // Analyse und Logging
  console.table(
    results.map((result, index) => ({
      parameterSet: `Set ${index + 1}`,
      accuracy: result.metrics.accuracy.toFixed(2),
      coverage: result.metrics.coverage.toFixed(2),
      balance: result.metrics.balance.toFixed(2),
    })),
  );
}

// Führe die Tests aus
optimizeParameters().catch(console.error);
