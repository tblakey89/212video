import React from "react";
import { Box } from "@mui/material";
import VideoCard from "./VideoCard.jsx";

export default function VideoGrid({
  items,
  onSelect,
  onReset,
  disabled,
  videoProgress,
  minWidth = 200,
  layout = "grid",
  showReset = false,
}) {
  const containerStyles =
    layout === "row"
      ? {
          display: "flex",
          gap: 1.5,
          overflowX: "auto",
          paddingBottom: 1,
          scrollSnapType: "x mandatory",
        }
      : layout === "wrap"
      ? {
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          alignItems: "stretch",
        }
      : {
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))`,
          gap: 1.5,
        };

  const safeItems = items.filter((item) => item && item.video && item.video.id);

  return (
    <Box sx={containerStyles}>
      {safeItems.map(({ channel, video, isShort }) => (
        <Box
          key={`${channel.id}-${video.id}`}
          sx={
            layout === "row"
              ? { minWidth, scrollSnapAlign: "start" }
              : layout === "wrap"
              ? { width: minWidth, flexGrow: 1, maxWidth: 280 }
              : undefined
          }
        >
          <VideoCard
            video={video}
            channelName={channel.name}
            isShort={isShort}
            watchedSeconds={videoProgress[video.id] || 0}
            disabled={disabled}
            onReset={showReset ? onReset : undefined}
            onSelect={() => onSelect(channel, video)}
          />
        </Box>
      ))}
    </Box>
  );
}
