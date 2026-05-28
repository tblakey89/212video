const WATCHED_THRESHOLD = 0.9;

export function isWatched(watchedSeconds, durationSeconds) {
  if (!durationSeconds) {
    return false;
  }
  return watchedSeconds >= durationSeconds * WATCHED_THRESHOLD;
}

export function watchedFraction(watchedSeconds, durationSeconds) {
  if (!durationSeconds) {
    return 0;
  }
  return Math.max(0, Math.min(1, watchedSeconds / durationSeconds));
}
