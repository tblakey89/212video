import React, { useCallback, useEffect, useRef, useState } from "react";
import AppShell from "./components/AppShell.jsx";
import AppContent from "./components/AppContent.jsx";
import { useAppData } from "./hooks/useAppData.js";
import { useAuthFetch } from "./hooks/useAuthFetch.js";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll.js";
import { useVideoCollections } from "./hooks/useVideoCollections.js";
import { useWatchReporter } from "./hooks/useWatchReporter.js";
import { useWatchSummary } from "./hooks/useWatchSummary.js";
import { useYouTubeApiReady } from "./hooks/useYouTubeApiReady.js";
import { useYouTubePlayer } from "./hooks/useYouTubePlayer.js";
import { selectLockout } from "./utils/lockout.js";
import { collectionVideos } from "./utils/collection.js";

const HOME_PAGE_SIZE = 12;
const DETAIL_PAGE_SIZE = 15;

export default function App() {
  const authFetch = useAuthFetch();
  const apiReady = useYouTubeApiReady();

  const [tab, setTab] = useState("home");
  const [detail, setDetail] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeStartSeconds, setActiveStartSeconds] = useState(0);
  const [homeFilter, setHomeFilter] = useState("full");
  const [browseFilter, setBrowseFilter] = useState("full");
  const [refreshing, setRefreshing] = useState(false);
  const [isPlayerPaused, setIsPlayerPaused] = useState(false);
  const [isEndingSoon, setIsEndingSoon] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  const playerRef = useRef(null);
  const playerInstanceRef = useRef(null);
  const watchedRef = useRef(0);
  const limitRef = useRef(0);

  const { channels, playlists, dailyLimitSeconds, startHour, endHour, isLoading, loadData } = useAppData(authFetch);
  const { watchedSeconds, setWatchedSeconds, videoProgress, setVideoProgress, refreshSummary } = useWatchSummary(authFetch);

  const { startReporting, stopReporting } = useWatchReporter({
    authFetch,
    setWatchedSeconds,
    setVideoProgress,
    limitRef,
    watchedRef,
    playerInstanceRef,
    onLimitReached: () => {
      setIsTimeUp(true);
      setActiveVideo(null);
      setActiveStartSeconds(0);
    },
  });

  const remainingSeconds = Math.max(0, dailyLimitSeconds - watchedSeconds);
  const disablePlayback = remainingSeconds <= 0;
  const lockout = selectLockout({ remaining: remainingSeconds, currentHour, startHour, endHour, isTimeUp });

  const { sortedChannels, homeItems, inProgressItems } = useVideoCollections({ channels, homeFilter, videoProgress });

  const homeScroll = useInfiniteScroll({ itemsLength: homeItems.length, pageSize: HOME_PAGE_SIZE });
  const detailItems = detail ? collectionVideos(detail, browseFilter) : [];
  const detailScroll = useInfiniteScroll({ itemsLength: detailItems.length, pageSize: DETAIL_PAGE_SIZE });

  useEffect(() => { watchedRef.current = watchedSeconds; }, [watchedSeconds]);
  useEffect(() => { limitRef.current = dailyLimitSeconds; }, [dailyLimitSeconds]);

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentHour(new Date().getHours()), 30000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const refreshId = setInterval(() => refreshSummary(), 30000);
    return () => clearInterval(refreshId);
  }, [refreshSummary]);

  useEffect(() => {
    // Block browser shortcuts that can escape the kiosk (F1 help, reload,
    // print, find, etc.). Browser-reserved combos like Ctrl+T/N/W can't be
    // caught here, and key events inside the player iframe never reach us —
    // OS-level key remapping is the real lockdown. See raspberry-pi/README.md.
    const blockKeys = (event) => {
      const isFunctionKey = /^F\d+$/.test(event.key);
      const key = event.key.toLowerCase();
      const isComboEscape =
        (event.ctrlKey || event.metaKey) &&
        ["r", "l", "p", "s", "o", "j", "h", "d", "f", "g", "u", "k", "e"].includes(key);
      if (isFunctionKey || isComboEscape) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("keydown", blockKeys, true);
    return () => window.removeEventListener("keydown", blockKeys, true);
  }, []);

  const handleEnd = useCallback(() => {
    stopReporting();
    setActiveVideo(null);
    setActiveStartSeconds(0);
    setIsPlayerPaused(false);
    setIsEndingSoon(false);
    setIsTimeUp(false);
  }, [stopReporting]);

  const handlePlay = useCallback(() => {
    startReporting(activeVideo);
    setIsPlayerPaused(false);
    setIsEndingSoon(false);
    setIsTimeUp(false);
  }, [startReporting, activeVideo]);

  const handlePause = useCallback(() => {
    stopReporting();
    setIsPlayerPaused(true);
  }, [stopReporting]);

  const handleNearEnd = useCallback(() => setIsEndingSoon(true), []);

  useYouTubePlayer({
    apiReady,
    containerRef: playerRef,
    activeVideo,
    startSeconds: activeStartSeconds,
    playerInstanceRef,
    onPlay: handlePlay,
    onPause: handlePause,
    onEnd: handleEnd,
    onNearEnd: handleNearEnd,
  });

  useEffect(() => {
    return () => {
      stopReporting();
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
        playerInstanceRef.current = null;
      }
    };
  }, [stopReporting]);

  function openVideo(video) {
    if (remainingSeconds <= 0) {
      setIsTimeUp(true);
      return;
    }
    const totalWatched = videoProgress[video.id] || 0;
    const resumeAt = totalWatched >= 5 ? Math.floor(totalWatched) : 0;
    setActiveStartSeconds(resumeAt);
    setActiveVideo(video);
  }

  function closePlayer() {
    stopReporting();
    if (playerInstanceRef.current) {
      playerInstanceRef.current.stopVideo();
    }
    setActiveVideo(null);
    setActiveStartSeconds(0);
    setIsPlayerPaused(false);
    setIsEndingSoon(false);
  }

  function changeTab(nextTab) {
    setTab(nextTab);
    setDetail(null);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await authFetch("/api/channels/refresh", { method: "POST" });
    await loadData();
    setRefreshing(false);
  }

  async function handleResetProgress(videoId) {
    await authFetch(`/api/video-progress/${videoId}`, { method: "DELETE" });
    refreshSummary();
  }

  return (
    <AppShell>
      <AppContent
        lockout={lockout}
        settings={{ startHour, endHour }}
        isLoading={isLoading}
        tab={tab}
        detail={detail}
        onTabChange={changeTab}
        onHome={() => changeTab("home")}
        remaining={remainingSeconds}
        total={dailyLimitSeconds}
        activeVideo={activeVideo}
        playerRef={playerRef}
        playerInstanceRef={playerInstanceRef}
        isPlayerPaused={isPlayerPaused}
        isEndingSoon={isEndingSoon}
        onBackFromPlayer={closePlayer}
        disablePlayback={disablePlayback}
        videoProgress={videoProgress}
        onSelectVideo={openVideo}
        onResetProgress={handleResetProgress}
        homeProps={{
          inProgressItems,
          homeItems,
          homeFilter,
          onFilterChange: setHomeFilter,
          visibleCount: homeScroll.visibleCount,
          sentinelRef: homeScroll.sentinelRef,
        }}
        browseProps={{
          channels: sortedChannels,
          playlists,
          filter: browseFilter,
          onFilterChange: setBrowseFilter,
          onSeeAll: setDetail,
          onRefresh: handleRefresh,
          refreshing,
        }}
        detailProps={{
          filter: browseFilter,
          onFilterChange: setBrowseFilter,
          onBack: () => setDetail(null),
          visibleCount: detailScroll.visibleCount,
          sentinelRef: detailScroll.sentinelRef,
        }}
      />
    </AppShell>
  );
}
