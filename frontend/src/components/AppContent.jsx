import React from "react";
import { Divider } from "@mui/material";
import ChannelsView from "./ChannelsView.jsx";
import HeroHeader from "./HeroHeader.jsx";
import HomeView from "./HomeView.jsx";
import NavigationTabs from "./NavigationTabs.jsx";
import PlayerView from "./PlayerView.jsx";
import PlaylistsView from "./PlaylistsView.jsx";

export default function AppContent({
  remainingMinutes,
  statusMessage,
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
  return (
    <>
      <HeroHeader remainingMinutes={remainingMinutes} statusMessage={statusMessage} />
      <Divider sx={{ my: 3, borderColor: "rgba(27,27,31,0.12)" }} />
      <NavigationTabs page={page} onChange={onPageChange} />
      {view === "player" ? (
        <PlayerView
          activeVideo={activeVideo}
          onBack={onBackFromPlayer}
          playerRef={playerRef}
          onResume={onResumePlayer}
          showPauseOverlay={showPauseOverlay}
          showEndOverlay={showEndOverlay}
        />
      ) : page === "home" ? (
        <HomeView {...homeProps} />
      ) : page === "playlists" ? (
        <PlaylistsView view={view} {...playlistsProps} />
      ) : (
        <ChannelsView view={view} {...channelsProps} />
      )}
    </>
  );
}
