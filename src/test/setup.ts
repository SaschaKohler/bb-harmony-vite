import "@testing-library/jest-dom";
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// RTL Matchers erweitern
expect.extend(matchers);

// Cleanup nach jedem Test
afterEach(() => {
  cleanup();
});
