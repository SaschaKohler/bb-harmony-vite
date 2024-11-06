// src/pages/bachblueten-wizard/tests/test-utils.ts
import { beforeEach, afterEach, vi } from "vitest";
import type { SpyInstance } from "vitest";

export function setupScoringTest() {
  let consoleSpy: SpyInstance;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });
}
