import React from "react";
import { Box, CircularProgress } from "@mui/material";
import Header from "./shell/Header.jsx";
import HomeView from "./HomeView.jsx";
import BrowseScreen from "./BrowseScreen.jsx";
import DetailPage from "./DetailPage.jsx";
import PlayerView from "./PlayerView.jsx";
import Lockout from "./Lockout.jsx";

export default function AppContent({
  lockout,
  settings,
  isLoading,
  tab,
  detail,
  onTabChange,
  onHome,
  remaining,
  total,
  activeVideo,
  playerRef,
  playerInstanceRef,
  isPlayerPaused,
  isEndingSoon,
  onBackFromPlayer,
  disablePlayback,
  videoProgress,
  onSelectVideo,
  onResetProgress,
  homeProps,
  browseProps,
  detailProps,
}) {
  if (lockout) {
    return <Lockout kind={lockout} settings={settings} />;
  }

  if (activeVideo) {
    return (
      <PlayerView
        video={activeVideo}
        playerRef={playerRef}
        playerInstanceRef={playerInstanceRef}
        remaining={remaining}
        total={total}
        isPaused={isPlayerPaused}
        isEndingSoon={isEndingSoon}
        onBack={onBackFromPlayer}
      />
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "#FBF3E7" }}>
      <Header tab={tab} setTab={onTabChange} remaining={remaining} total={total} onHome={onHome} />
      <main style={{ maxWidth: 1640, margin: "0 auto", padding: "30px clamp(20px,4vw,64px) 90px" }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : detail ? (
          <DetailPage
            coll={detail}
            videoProgress={videoProgress}
            onSelect={onSelectVideo}
            onReset={onResetProgress}
            disabled={disablePlayback}
            {...detailProps}
          />
        ) : tab === "home" ? (
          <HomeView
            videoProgress={videoProgress}
            onSelectVideo={onSelectVideo}
            onResetProgress={onResetProgress}
            disabled={disablePlayback}
            {...homeProps}
          />
        ) : (
          <BrowseScreen
            kind={tab}
            collections={tab === "channels" ? browseProps.channels : browseProps.playlists}
            videoProgress={videoProgress}
            onSelect={onSelectVideo}
            disabled={disablePlayback}
            filter={browseProps.filter}
            onFilterChange={browseProps.onFilterChange}
            onSeeAll={browseProps.onSeeAll}
            onRefresh={browseProps.onRefresh}
            refreshing={browseProps.refreshing}
          />
        )}
      </main>
    </Box>
  );
}
