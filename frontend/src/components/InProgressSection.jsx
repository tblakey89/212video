import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import VideoGrid from "./VideoGrid.jsx";

export default function InProgressSection({ items, onSelect, onReset, disabled, videoProgress }) {
  if (!items.length) {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Continue watching
        </Typography>
      </Stack>
      <VideoGrid
        items={items}
        onSelect={onSelect}
        onReset={onReset}
        disabled={disabled}
        videoProgress={videoProgress}
        minWidth={240}
        layout="wrap"
        showReset
      />
    </Box>
  );
}
