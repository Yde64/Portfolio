import { describe, it, expect } from "vitest";
import { calculateTilt } from "../../src/components/ProjectCard";

describe("calculateTilt", () => {
  it("returns zero tilt at center", () => {
    const result = calculateTilt(150, 100, { width: 300, height: 200 });
    expect(result).toEqual({ x: 0, y: 0 });
  });

  it("tilts negative when mouse is top-left", () => {
    const result = calculateTilt(0, 0, { width: 300, height: 200 });
    expect(result.x).toBeGreaterThan(0);
    expect(result.y).toBeLessThan(0);
  });

  it("tilts positive when mouse is bottom-right", () => {
    const result = calculateTilt(300, 200, { width: 300, height: 200 });
    expect(result.x).toBeLessThan(0);
    expect(result.y).toBeGreaterThan(0);
  });
});
