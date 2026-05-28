export function selectLockout({ remaining, currentHour, startHour, endHour, isTimeUp }) {
  if (isTimeUp || remaining <= 0) {
    return "timeup";
  }
  if (currentHour < startHour) {
    return "early";
  }
  if (currentHour >= endHour) {
    return "late";
  }
  return null;
}
