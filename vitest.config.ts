import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/components/**/*.test.{ts,tsx}"],
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
  },
});
