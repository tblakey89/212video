import React from "react";
import { Box, Button, Typography } from "@mui/material";
import VideoGrid from "./VideoGrid.jsx";

function buildItems(playlist, videos) {
  return videos.map((video) => ({ channel: playlist, video, isShort: Boolean(video.isShort) }));
}

export default function PlaylistPage({
  playlist,
  visibleCount,
  onBack,
  onSelect,
  sentinelRef,
  disabled,
  videoProgress,
}) {
  const allVideos = playlist.videos || [];
  const visible = allVideos.slice(0, visibleCount);

  return (
    <Box>
      <Button variant="outlined" sx={{ mb: 2 }} onClick={onBack}>
        Back to playlists
      </Button>
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
        {playlist.name}
      </Typography>
      {playlist.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {playlist.description}
        </Typography>
      )}
      <VideoGrid
        items={buildItems(playlist, visible)}
        onSelect={onSelect}
        disabled={disabled}
        videoProgress={videoProgress}
      />
      {visibleCount < allVideos.length && <Box ref={sentinelRef} sx={{ height: 1, mt: 2 }} />}
    </Box>
  );
}
