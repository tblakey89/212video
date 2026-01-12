import React from "react";
import { Box } from "@mui/material";

export default function ViewContainer({ children }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 3,
        position: "relative",
        zIndex: 1,
        animation: "fadeUp 0.6s ease both",
        animationDelay: "0.08s",
      }}
    >
      {children}
    </Box>
  );
}
