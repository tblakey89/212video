import React from "react";
import { Box, Card, CardActionArea, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { formatPublishDate } from "../utils/date.js";

function isWatched(watchedSeconds, durationSeconds) {
  if (!durationSeconds) {
    return false;
  }
  return watchedSeconds >= durationSeconds * 0.9;
}

export default function VideoCard({
  video,
  channelName,
  isShort,
  onSelect,
  onReset,
  disabled,
  watchedSeconds,
}) {
  const watched = isWatched(watchedSeconds, video.durationSeconds || 0);
  const aspectRatio = isShort ? "9 / 16" : "16 / 9";

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        borderColor: "rgba(27,27,31,0.12)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        height: "100%",
        position: "relative",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 14px 30px rgba(27,27,31,0.18)",
        },
        "&:hover .reset-progress": {
          opacity: 1,
          pointerEvents: "auto",
        },
      }}
    >
      {onReset && (
        <IconButton
          aria-label="Reset progress"
          size="small"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onReset(video.id);
          }}
          className="reset-progress"
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
            zIndex: 2,
            background: "rgba(255,255,255,0.9)",
            opacity: 0,
            pointerEvents: "none",
            transition: "opacity 0.2s ease",
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
      <CardActionArea onClick={onSelect} disabled={disabled} sx={{ height: "100%" }}>
        <CardMedia
          component="img"
          image={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
          alt={video.title}
          sx={{ aspectRatio, objectFit: "cover" }}
        />
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 0.5, height: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {video.title}
            </Typography>
            {watched && (
              <Typography component="span" sx={{ fontSize: 18 }} aria-label="watched">
                ✅
              </Typography>
            )}
          </Box>
          {formatPublishDate(video.publishedAt) && (
            <Typography variant="caption" color="text.secondary" display="block">
              Published {formatPublishDate(video.publishedAt)}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            {watchedSeconds ? "Continue watching" : "Play video"}
          </Typography>
          {channelName && (
            <Typography variant="caption" color="text.secondary" display="block">
              {channelName}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
