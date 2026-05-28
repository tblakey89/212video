import { describe, it, expect } from "vitest";
import { formatDuration, formatHour } from "./format.js";

describe("formatDuration", () => {
  it("formats zero", () => {
    expect(formatDuration(0)).toBe("0:00");
  });
  it("pads seconds", () => {
    expect(formatDuration(5)).toBe("0:05");
  });
  it("formats minutes and seconds", () => {
    expect(formatDuration(65)).toBe("1:05");
    expect(formatDuration(600)).toBe("10:00");
  });
  it("allows minutes above 60", () => {
    expect(formatDuration(3661)).toBe("61:01");
  });
  it("floors fractional seconds", () => {
    expect(formatDuration(65.9)).toBe("1:05");
  });
});

describe("formatHour", () => {
  it("formats morning hours", () => {
    expect(formatHour(9)).toBe("9 am");
  });
  it("formats evening hours", () => {
    expect(formatHour(19)).toBe("7 pm");
  });
  it("formats midnight and noon", () => {
    expect(formatHour(0)).toBe("12 am");
    expect(formatHour(12)).toBe("12 pm");
  });
});
