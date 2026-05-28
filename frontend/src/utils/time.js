const TEAL = "#1C9B8E";
const AMBER = "#E8A12A";
const ORANGE = "#E0673C";

export function timeRingFraction(remaining, total) {
  if (!total) {
    return 0;
  }
  return Math.max(0, Math.min(1, remaining / total));
}

export function timeRingColor(remaining, total) {
  const frac = timeRingFraction(remaining, total);
  if (frac <= 0.2) {
    return ORANGE;
  }
  if (frac <= 0.45) {
    return AMBER;
  }
  return TEAL;
}

export function remainingMinutes(remainingSeconds) {
  return Math.max(0, Math.ceil(remainingSeconds / 60));
}
