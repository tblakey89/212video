import React from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { formatPublishDate } from "../utils/date.js";

export default function PlayerView({
  activeVideo,
  onBack,
  playerRef,
  onResume,
  showPauseOverlay,
  showEndOverlay,
}) {
  const showCover = showPauseOverlay || showEndOverlay;

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
      <Box sx={{ width: "100vw", ml: "calc(50% - 50vw)" }}>
        <Card
          sx={{
            bgcolor: "#1e1d1b",
            borderRadius: { xs: 0, md: 3 },
            overflow: "hidden",
            maxWidth: 1400,
            mx: "auto",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {activeVideo ? (
              <Box sx={{ position: "relative" }}>
                <Box
                  ref={playerRef}
                  sx={{
                    width: "min(95vw, calc(90vh * 16 / 9))",
                    height: "90vh",
                    margin: "0 auto",
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
                {showCover && (
                  <Box
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    sx={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(12,12,12,0.45)",
                    }}
                  >
                    {showPauseOverlay && (
                      <Button variant="contained" onClick={onResume}>
                        Resume
                      </Button>
                    )}
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ color: "#faf4e8", textAlign: "center", py: 6 }}>
                <Typography>Select a video to start.</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
