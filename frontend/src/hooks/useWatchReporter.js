import { useCallback, useRef } from "react";

const REPORT_INTERVAL_SECONDS = 10;
const GRACE_SECONDS = 300;

export function useWatchReporter({
  authFetch,
  setWatchedSeconds,
  setVideoProgress,
  limitRef,
  watchedRef,
  playerInstanceRef,
  onLimitReached,
}) {
  const intervalRef = useRef(null);

  const reportWatch = useCallback(
    async (seconds, video) => {
      const payload = {
        videoId: video.id,
        channelId: video.channelId,
        title: video.title,
        seconds,
      };

      const res = await authFetch("/api/watch-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setWatchedSeconds((prev) => prev + seconds);
        setVideoProgress((prev) => ({
          ...prev,
          [video.id]: (prev[video.id] || 0) + seconds,
        }));
      }
    },
    [authFetch, setWatchedSeconds, setVideoProgress]
  );

  const stopReporting = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startReporting = useCallback(
    (video) => {
      if (!video || intervalRef.current) {
        return;
      }

      intervalRef.current = setInterval(() => {
        const totalRemaining = limitRef.current + GRACE_SECONDS - watchedRef.current;
        const chunk = Math.min(REPORT_INTERVAL_SECONDS, Math.max(0, totalRemaining));

        if (chunk <= 0) {
          stopReporting();
          onLimitReached();
          if (playerInstanceRef.current) {
            playerInstanceRef.current.stopVideo();
          }
          return;
        }

        reportWatch(chunk, video);
      }, REPORT_INTERVAL_SECONDS * 1000);
    },
    [limitRef, watchedRef, playerInstanceRef, reportWatch, stopReporting, onLimitReached]
  );

  return { startReporting, stopReporting };
}
