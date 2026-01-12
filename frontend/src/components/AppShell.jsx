import React from "react";
import { Box, CssBaseline, GlobalStyles, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1b1b1f" },
    secondary: { main: "#cb7b4f" },
    background: { default: "#f6f0e6" },
  },
  typography: {
    fontFamily: '"Source Serif 4", "Avenir", serif',
  },
  shape: {
    borderRadius: 14,
  },
});

export default function AppShell({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            background:
              "radial-gradient(circle at 10% 10%, #fff8e8 0%, #f6f0e6 45%, #efe5d6 100%)",
            color: "#1b1b1f",
          },
          "@keyframes floaty": {
            "0%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-12px)" },
            "100%": { transform: "translateY(0px)" },
          },
          "@keyframes fadeUp": {
            "0%": { opacity: 0, transform: "translateY(16px)" },
            "100%": { opacity: 1, transform: "translateY(0px)" },
          },
        }}
      />
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <Box
          sx={{
            position: "absolute",
            top: -120,
            left: -120,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(203,123,79,0.35), rgba(203,123,79,0))",
            animation: "floaty 10s ease-in-out infinite",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -140,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(27,27,31,0.25), rgba(27,27,31,0))",
            animation: "floaty 12s ease-in-out infinite",
            zIndex: 0,
          }}
        />
        <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 }, maxWidth: 1200, mx: "auto" }}>
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
