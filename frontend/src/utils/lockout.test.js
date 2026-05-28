import { describe, it, expect } from "vitest";
import { selectLockout } from "./lockout.js";

const base = { remaining: 600, currentHour: 12, startHour: 9, endHour: 19, isTimeUp: false };

describe("selectLockout", () => {
  it("returns null inside the allowed window with time left", () => {
    expect(selectLockout(base)).toBe(null);
  });
  it("returns timeup when no time remains", () => {
    expect(selectLockout({ ...base, remaining: 0 })).toBe("timeup");
  });
  it("returns timeup when the limit was reached this session", () => {
    expect(selectLockout({ ...base, isTimeUp: true })).toBe("timeup");
  });
  it("returns early before the start hour", () => {
    expect(selectLockout({ ...base, currentHour: 7 })).toBe("early");
  });
  it("returns late at or after the end hour", () => {
    expect(selectLockout({ ...base, currentHour: 19 })).toBe("late");
  });
  it("prioritises timeup over time-of-day windows", () => {
    expect(selectLockout({ ...base, remaining: 0, currentHour: 7 })).toBe("timeup");
  });
});
