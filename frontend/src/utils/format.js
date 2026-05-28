export function formatDuration(seconds) {
  const total = Math.max(0, Math.floor(seconds || 0));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatHour(hour) {
  const am = hour < 12;
  const hr = hour % 12 === 0 ? 12 : hour % 12;
  return `${hr} ${am ? "am" : "pm"}`;
}
