import React from "react";
import { Box, Button, Typography } from "@mui/material";
import VideoGrid from "./VideoGrid.jsx";
import { getVideosForFilter } from "../utils/video.js";

function buildItems(channel, videos, filter) {
  if (filter === "shorts") {
    return videos.map((video) => ({ channel, video, isShort: true }));
  }
  if (filter === "full") {
    return videos.map((video) => ({ channel, video, isShort: false }));
  }
  const shortIds = new Set((channel.shorts || []).map((short) => short.id));
  return videos.map((video) => ({ channel, video, isShort: shortIds.has(video.id) }));
}

export default function ChannelPage({
  channel,
  filter,
  visibleCount,
  onBack,
  onSelect,
  sentinelRef,
  disabled,
  videoProgress,
}) {
  const filtered = getVideosForFilter(channel, filter);
  const visible = filtered.slice(0, visibleCount);

  return (
    <Box>
      <Button variant="outlined" sx={{ mb: 2 }} onClick={onBack}>
        Back to list
      </Button>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        {channel.name}
      </Typography>
      <VideoGrid
        items={buildItems(channel, visible, filter)}
        onSelect={onSelect}
        disabled={disabled}
        videoProgress={videoProgress}
      />
      {visibleCount < filtered.length && <Box ref={sentinelRef} sx={{ height: 1, mt: 2 }} />}
    </Box>
  );
}
