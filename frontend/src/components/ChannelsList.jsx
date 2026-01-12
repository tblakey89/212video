import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
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

export default function ChannelsList({
  channels,
  filter,
  previewCount,
  onSelect,
  onSeeAll,
  disabled,
  videoProgress,
}) {
  return (
    <Stack spacing={3}>
      {channels.map((channel) => {
        const filtered = getVideosForFilter(channel, filter);
        const preview = filtered.slice(0, previewCount);
        return (
          <Box key={channel.id}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {channel.name}
              </Typography>
              {filtered.length > previewCount && (
                <Button size="small" onClick={() => onSeeAll(channel)}>
                  See all
                </Button>
              )}
            </Stack>
            <VideoGrid
              items={buildItems(channel, preview, filter)}
              onSelect={onSelect}
              disabled={disabled}
              videoProgress={videoProgress}
            />
          </Box>
        );
      })}
    </Stack>
  );
}
