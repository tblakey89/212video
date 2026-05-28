import { describe, it, expect } from "vitest";
import { isWatched, watchedFraction } from "./progress.js";

describe("isWatched", () => {
  it("is false below 90%", () => {
    expect(isWatched(0, 100)).toBe(false);
    expect(isWatched(89, 100)).toBe(false);
  });
  it("is true at or above 90%", () => {
    expect(isWatched(90, 100)).toBe(true);
    expect(isWatched(100, 100)).toBe(true);
  });
  it("is false without a known duration", () => {
    expect(isWatched(50, 0)).toBe(false);
    expect(isWatched(50, undefined)).toBe(false);
  });
});

describe("watchedFraction", () => {
  it("returns a clamped 0..1 fraction", () => {
    expect(watchedFraction(50, 100)).toBe(0.5);
    expect(watchedFraction(200, 100)).toBe(1);
    expect(watchedFraction(50, 0)).toBe(0);
  });
});
