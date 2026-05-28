import { describe, it, expect } from "vitest";
import { tint, shade } from "./colors.js";

describe("tint", () => {
  it("mixes a color toward white", () => {
    expect(tint("#000000", 0.5)).toBe("rgb(128,128,128)");
    expect(tint("#ffffff", 0.5)).toBe("rgb(255,255,255)");
    expect(tint("#000000", 0)).toBe("rgb(0,0,0)");
  });
});

describe("shade", () => {
  it("mixes a color toward black", () => {
    expect(shade("#ffffff", 0.5)).toBe("rgb(128,128,128)");
    expect(shade("#000000", 0.5)).toBe("rgb(0,0,0)");
    expect(shade("#ffffff", 0)).toBe("rgb(255,255,255)");
  });
});
