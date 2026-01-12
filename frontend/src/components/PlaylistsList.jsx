import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import VideoGrid from "./VideoGrid.jsx";

function buildItems(playlist, videos) {
  return videos.map((video) => ({ channel: playlist, video, isShort: Boolean(video.isShort) }));
}

export default function PlaylistsList({
  playlists,
  previewCount,
  onSelect,
  onSeeAll,
  disabled,
  videoProgress,
}) {
  return (
    <Stack spacing={3}>
      {playlists.map((playlist) => {
        const preview = (playlist.videos || []).slice(0, previewCount);
        return (
          <Box key={playlist.id}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {playlist.name}
              </Typography>
              {(playlist.videos || []).length > previewCount && (
                <Button size="small" onClick={() => onSeeAll(playlist)}>
                  See all
                </Button>
              )}
            </Stack>
            {playlist.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                {playlist.description}
              </Typography>
            )}
            <VideoGrid
              items={buildItems(playlist, preview)}
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
