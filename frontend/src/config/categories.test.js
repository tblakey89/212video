import { describe, it, expect } from "vitest";
import { CATEGORIES, resolveCategory } from "./categories.js";

describe("resolveCategory", () => {
  it("returns the category with color, soft tint, label and glyph", () => {
    const making = resolveCategory("making");
    expect(making.color).toBe("#F2683C");
    expect(making.soft).toBe("#FFE3D6");
    expect(making.label).toBe("Making");
    expect(making.glyph).toBe("spark");
  });

  it("falls back to science for unknown or missing categories", () => {
    expect(resolveCategory("nonsense").label).toBe("Science");
    expect(resolveCategory(undefined).label).toBe("Science");
  });

  it("exposes a glyph for every category", () => {
    Object.keys(CATEGORIES).forEach((key) => {
      expect(resolveCategory(key).glyph).toBeTruthy();
    });
  });
});
