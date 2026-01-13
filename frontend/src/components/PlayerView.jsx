import React from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { formatPublishDate } from "../utils/date.js";

export default function PlayerView({ activeVideo, onBack, playerRef }) {
  return (
    <Box sx={{ position: "relative", zIndex: 1 }}>
      <Button variant="outlined" sx={{ mb: 2 }} onClick={onBack}>
        Back
      </Button>
      {activeVideo && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {activeVideo.title}
          </Typography>
          {formatPublishDate(activeVideo.publishedAt) && (
            <Typography variant="body2" color="text.secondary">
              Published {formatPublishDate(activeVideo.publishedAt)}
            </Typography>
          )}
        </Box>
      )}
      <Card sx={{ bgcolor: "#1e1d1b", borderRadius: 3 }}>
        <CardContent>
          {activeVideo ? (
            <Box sx={{ position: "relative" }}>
              <Box
                ref={playerRef}
                sx={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  "& iframe": { width: "100%", height: "100%" },
                }}
              />
              <Box
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                sx={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  width: 160,
                  height: 60,
                  zIndex: 2,
                  cursor: "default",
                  backgroundColor: "transparent",
                }}
              />
            </Box>
          ) : (
            <Box sx={{ color: "#faf4e8", textAlign: "center", py: 6 }}>
              <Typography>Select a video to start.</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
