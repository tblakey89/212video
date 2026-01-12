import React from "react";
import { Alert, Box, Stack, Typography } from "@mui/material";
export default function HeroHeader({
  remainingMinutes,
  statusMessage,
}) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={3}
      alignItems={{ xs: "stretch", md: "flex-start" }}
      justifyContent="space-between"
      sx={{ position: "relative", zIndex: 1, animation: "fadeUp 0.6s ease both" }}
    >
      <Box>
        <Typography
          variant="h2"
          sx={{
            letterSpacing: "0.18em",
            fontFamily: '"Bebas Neue", sans-serif',
            fontWeight: 600,
            fontSize: { xs: 36, md: 48 },
          }}
        >
          212video
        </Typography>
        <Typography variant="h3" sx={{ mt: 1, fontWeight: 700, fontSize: { xs: 28, md: 36 } }}>
          Curated learning, no clickbait.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, maxWidth: 520, fontSize: 18 }}>
          Pick from the trusted list below.
        </Typography>
        {statusMessage && (
          <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
            {statusMessage}
          </Alert>
        )}
      </Box>
      <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.5 }}>
        <Typography
          sx={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: { xs: 40, md: 52 },
            letterSpacing: "0.08em",
          }}
        >
          {remainingMinutes}
        </Typography>
        <Box>
          <Typography variant="subtitle2" sx={{ textTransform: "uppercase", letterSpacing: "0.2em" }}>
            Minutes
          </Typography>
          <Typography variant="caption" color="text.secondary">
            time left today
          </Typography>
        </Box>
      </Box>
    </Stack>
  );
}
