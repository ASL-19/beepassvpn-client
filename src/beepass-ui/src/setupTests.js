import "regenerator-runtime/runtime";
import "@testing-library/jest-dom";
import "vitest-canvas-mock";

import { cleanup } from "@testing-library/react";
import { vi } from "vitest";

// Do not throw errors while testing.
vi.spyOn(console, "error").mockImplementation(() => {});
vi.spyOn(console, "info").mockImplementation(() => {});

vi.importActual("lottie-react")
  .then(() => {})
  .catch(() => {});

afterEach(() => {
  cleanup();
  localStorage.clear();
});
