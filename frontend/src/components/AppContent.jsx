import React from "react";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import ChannelsView from "./ChannelsView.jsx";
import HeroHeader from "./HeroHeader.jsx";
import HomeView from "./HomeView.jsx";
import NavigationTabs from "./NavigationTabs.jsx";
import PlayerView from "./PlayerView.jsx";
import PlaylistsView from "./PlaylistsView.jsx";

export default function AppContent({
  remainingMinutes,
  statusMessage,
  showTimeUp,
  isLoading,
  page,
  view,
  onPageChange,
  activeVideo,
  playerRef,
  onBackFromPlayer,
  onResumePlayer,
  showPauseOverlay,
  showEndOverlay,
  homeProps,
  playlistsProps,
  channelsProps,
}) {
  if (showTimeUp) {
    return (
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0e0d0c",
          pointerEvents: "auto",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: "#f6f0e6",
            fontWeight: 800,
            textAlign: "center",
            fontSize: { xs: 40, md: 64 },
          }}
        >
          Time is up...
        </Typography>
      </Box>
    );
  }

  const showLoading = view !== "player" && isLoading;

  return (
    <>
      <HeroHeader remainingMinutes={remainingMinutes} statusMessage={statusMessage} />
      <Divider sx={{ my: 3, borderColor: "rgba(27,27,31,0.12)" }} />
      <NavigationTabs page={page} onChange={onPageChange} />
      {showLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}
      {!showLoading && view === "player" ? (
        <PlayerView
          activeVideo={activeVideo}
          onBack={onBackFromPlayer}
          playerRef={playerRef}
          onResume={onResumePlayer}
          showPauseOverlay={showPauseOverlay}
          showEndOverlay={showEndOverlay}
        />
      ) : !showLoading && page === "home" ? (
        <HomeView {...homeProps} />
      ) : !showLoading && page === "playlists" ? (
        <PlaylistsView view={view} {...playlistsProps} />
      ) : !showLoading ? (
        <ChannelsView view={view} {...channelsProps} />
      ) : null}
    </>
  );
}
