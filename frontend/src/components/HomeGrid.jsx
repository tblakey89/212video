import React from "react";
import { Box } from "@mui/material";
import VideoGrid from "./VideoGrid.jsx";

export default function HomeGrid({
  items,
  onSelect,
  disabled,
  videoProgress,
  visibleCount,
  sentinelRef,
}) {
  const visibleItems = items.slice(0, visibleCount);
  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        animation: "fadeUp 0.6s ease both",
        animationDelay: "0.08s",
      }}
    >
      <VideoGrid
        items={visibleItems}
        onSelect={onSelect}
        disabled={disabled}
        videoProgress={videoProgress}
        minWidth={240}
        layout="wrap"
      />
      {visibleCount < items.length && <Box ref={sentinelRef} sx={{ height: 1, mt: 2 }} />}
    </Box>
  );
}
