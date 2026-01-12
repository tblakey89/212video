import { useEffect, useRef, useState } from "react";
import { getLocalDateString } from "../utils/date.js";

export function useWatchSummary(authFetch) {
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const [videoProgress, setVideoProgress] = useState({});
  const inflightRef = useRef(false);

  async function refreshSummary() {
    if (inflightRef.current) {
      return;
    }
    inflightRef.current = true;

    try {
      const date = getLocalDateString();
      const [summaryRes, progressRes] = await Promise.all([
        authFetch(`/api/watch-summary?date=${date}`),
        authFetch(`/api/video-progress`),
      ]);
      if (!summaryRes.ok || !progressRes.ok) {
        return;
      }
      const summaryData = await summaryRes.json();
      const progressData = await progressRes.json();
      const progressMap = {};
      (progressData.progress || []).forEach((entry) => {
        progressMap[entry.videoId] = Number(entry.totalSeconds || 0);
      });
      setWatchedSeconds(Number(summaryData.totalSeconds || 0));
      setVideoProgress(progressMap);
    } catch (error) {
      // Ignore transient network errors.
    } finally {
      inflightRef.current = false;
    }
  }

  useEffect(() => {
    refreshSummary();
  }, [authFetch]);

  return { watchedSeconds, setWatchedSeconds, videoProgress, setVideoProgress, refreshSummary };
}
