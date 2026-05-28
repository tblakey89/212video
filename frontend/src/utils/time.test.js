import { describe, it, expect } from "vitest";
import { timeRingColor, remainingMinutes, timeRingFraction } from "./time.js";

describe("timeRingColor", () => {
  it("is teal above 45%", () => {
    expect(timeRingColor(1000, 1000)).toBe("#1C9B8E");
    expect(timeRingColor(460, 1000)).toBe("#1C9B8E");
  });
  it("is amber at or below 45% and above 20%", () => {
    expect(timeRingColor(450, 1000)).toBe("#E8A12A");
    expect(timeRingColor(210, 1000)).toBe("#E8A12A");
  });
  it("is orange at or below 20%", () => {
    expect(timeRingColor(200, 1000)).toBe("#E0673C");
    expect(timeRingColor(0, 1000)).toBe("#E0673C");
  });
});

describe("remainingMinutes", () => {
  it("ceils to whole minutes and never goes negative", () => {
    expect(remainingMinutes(0)).toBe(0);
    expect(remainingMinutes(1)).toBe(1);
    expect(remainingMinutes(60)).toBe(1);
    expect(remainingMinutes(61)).toBe(2);
    expect(remainingMinutes(-5)).toBe(0);
  });
});

describe("timeRingFraction", () => {
  it("clamps between 0 and 1", () => {
    expect(timeRingFraction(500, 1000)).toBe(0.5);
    expect(timeRingFraction(1500, 1000)).toBe(1);
    expect(timeRingFraction(-5, 1000)).toBe(0);
    expect(timeRingFraction(5, 0)).toBe(0);
  });
});
