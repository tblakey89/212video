import React, { useCallback, useEffect, useRef, useState } from "react";
import AppShell from "./components/AppShell.jsx";
import AppContent from "./components/AppContent.jsx";
import { useAppData } from "./hooks/useAppData.js";
import { useAuthFetch } from "./hooks/useAuthFetch.js";
import { useChannelScroll } from "./hooks/useChannelScroll.js";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll.js";
import { useVideoCollections } from "./hooks/useVideoCollections.js";
import { useWatchReporter } from "./hooks/useWatchReporter.js";
import { useWatchSummary } from "./hooks/useWatchSummary.js";
import { useYouTubeApiReady } from "./hooks/useYouTubeApiReady.js";
import { useYouTubePlayer } from "./hooks/useYouTubePlayer.js";

const PREVIEW_VIDEOS_PER_CHANNEL = 10;
const CHANNEL_PAGE_SIZE = 10;

export default function App() {
  const authFetch = useAuthFetch();
  const apiReady = useYouTubeApiReady();

  const [activeVideo, setActiveVideo] = useState(null);
  const [activeStartSeconds, setActiveStartSeconds] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [page, setPage] = useState("home");
  const [view, setView] = useState("list");
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playerOrigin, setPlayerOrigin] = useState({ page: "home", view: "list" });
  const [videoFilter, setVideoFilter] = useState("full");
  const [homeFilter, setHomeFilter] = useState("full");
  const [isPlayerPaused, setIsPlayerPaused] = useState(false);
  const [isEndingSoon, setIsEndingSoon] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const playerRef = useRef(null);
  const playerInstanceRef = useRef(null);
  const watchedRef = useRef(0);
  const limitRef = useRef(0);

  const {
    channels,
    playlists,
    dailyLimitSeconds,
    isLoading,
    loadData,
  } = useAppData(authFetch);

  const {
    watchedSeconds,
    setWatchedSeconds,
    videoProgress,
    setVideoProgress,
    refreshSummary,
  } = useWatchSummary(authFetch);

  const { visibleCount, sentinelRef } = useChannelScroll({
    view,
    selectedChannel,
    filter: videoFilter,
    pageSize: CHANNEL_PAGE_SIZE,
  });

  const { startReporting, stopReporting } = useWatchReporter({
    authFetch,
    setWatchedSeconds,
    setVideoProgress,
    limitRef,
    watchedRef,
    playerInstanceRef,
    onLimitReached: () => {
      setStatusMessage("Time is up...");
      setIsTimeUp(true);
      setActiveVideo(null);
      setActiveStartSeconds(0);
    },
  });

  const remainingSeconds = Math.max(0, dailyLimitSeconds - watchedSeconds);

  const { sortedChannels, homeItems, inProgressItems } = useVideoCollections({
    channels,
    homeFilter,
    videoProgress,
  });
  const homeScroll = useInfiniteScroll({ itemsLength: homeItems.length, pageSize: 30 });
  const playlistScroll = useInfiniteScroll({
    itemsLength: selectedPlaylist ? (selectedPlaylist.videos || []).length : 0,
    pageSize: 20,
  });
  const disablePlayback = remainingSeconds <= 0;
  const showTimeUp = isTimeUp || remainingSeconds <= 0;

  useEffect(() => {
    watchedRef.current = watchedSeconds;
  }, [watchedSeconds]);

  useEffect(() => {
    limitRef.current = dailyLimitSeconds;
  }, [dailyLimitSeconds]);

  const handleEnd = useCallback(() => {
    stopReporting();
    setStatusMessage("Nice one! Pick another video.");
    setActiveVideo(null);
    setActiveStartSeconds(0);
    setIsPlayerPaused(false);
    setIsEndingSoon(false);
    setIsTimeUp(false);
    setPage(playerOrigin.page);
    setView(playerOrigin.view);
  }, [playerOrigin, stopReporting]);

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

  const handleNearEnd = useCallback(() => {
    setIsEndingSoon(true);
  }, []);

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

  function startVideo(channel, video, originPage, originView) {
    if (remainingSeconds <= 0) {
      setStatusMessage("Daily limit reached. Come back tomorrow.");
      setIsTimeUp(true);
      return;
    }

    setStatusMessage("");
    setIsTimeUp(false);
    const totalWatched = videoProgress[video.id] || 0;
    const resumeAt = totalWatched >= 5 ? Math.floor(totalWatched) : 0;
    setActiveStartSeconds(resumeAt);
    setActiveVideo({
      ...video,
      channelId: channel.id,
    });
    setSelectedChannel(channel);
    setPlayerOrigin({ page: originPage, view: originView });
    setPage(originPage);
    setView("player");
  }

  function handleViewChannel(channel) {
    setSelectedChannel(channel);
    setPage("channels");
    setView("channel");
  }

  function handleViewPlaylist(playlist) {
    setSelectedPlaylist(playlist);
    setPage("playlists");
    setView("playlist");
  }

  function handleBackFromPlayer() {
    setPage(playerOrigin.page);
    setView(playerOrigin.view);
  }

  function handlePageChange(nextPage) {
    if (view === "player") {
      stopReporting();
      if (playerInstanceRef.current) {
        playerInstanceRef.current.stopVideo();
      }
      setActiveVideo(null);
      setActiveStartSeconds(0);
      setIsPlayerPaused(false);
      setIsEndingSoon(false);
      setIsTimeUp(false);
    }
    setPage(nextPage);
    setView("list");
    setSelectedChannel(null);
    setSelectedPlaylist(null);
  }

  async function handleResetProgress(videoId) {
    await authFetch(`/api/video-progress/${videoId}`, { method: "DELETE" });
    refreshSummary();
  }

  return (
    <AppShell>
      <AppContent
        remainingMinutes={Math.ceil(remainingSeconds / 60)}
        statusMessage={statusMessage}
        showTimeUp={showTimeUp}
        isLoading={isLoading}
        page={page}
        view={view}
        onPageChange={(_, value) => handlePageChange(value)}
        activeVideo={activeVideo}
        playerRef={playerRef}
        onBackFromPlayer={handleBackFromPlayer}
        onResumePlayer={() => playerInstanceRef.current?.playVideo()}
        showPauseOverlay={isPlayerPaused}
        showEndOverlay={isEndingSoon}
        homeProps={{
          inProgressItems,
          homeItems,
          homeFilter,
          onFilterChange: (_, value) => setHomeFilter(value),
          onSelectVideo: (channel, video) => startVideo(channel, video, "home", "list"),
          onResetProgress: handleResetProgress,
          disabled: disablePlayback,
          videoProgress,
          visibleCount: homeScroll.visibleCount,
          sentinelRef: homeScroll.sentinelRef,
        }}
        playlistsProps={{
          selectedPlaylist,
          playlists,
          visibleCount: playlistScroll.visibleCount,
          sentinelRef: playlistScroll.sentinelRef,
          disabled: disablePlayback,
          videoProgress,
          onSelectPreview: (playlist, video) => startVideo(playlist, video, "playlists", "list"),
          onSelectPlaylistVideo: (playlist, video) => startVideo(playlist, video, "playlists", "playlist"),
          onSeeAll: handleViewPlaylist,
          previewCount: PREVIEW_VIDEOS_PER_CHANNEL,
          onBack: () => setView("list"),
        }}
        channelsProps={{
          selectedChannel,
          channels: sortedChannels,
          filter: videoFilter,
          onFilterChange: (_, value) => setVideoFilter(value),
          onRefresh: async () => {
            await authFetch("/api/channels/refresh", { method: "POST" });
            loadData();
          },
          visibleCount,
          sentinelRef,
          disabled: disablePlayback,
          videoProgress,
          onSelectPreview: (channel, video) => startVideo(channel, video, "channels", "list"),
          onSelectChannelVideo: (channel, video) => startVideo(channel, video, "channels", "channel"),
          onSeeAll: handleViewChannel,
          previewCount: PREVIEW_VIDEOS_PER_CHANNEL,
          onBack: () => setView("list"),
        }}
      />
    </AppShell>
  );
}
