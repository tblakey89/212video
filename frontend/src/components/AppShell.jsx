import React from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { CREAM, INK, MUTED_INK, PRIMARY } from "../theme/colors.js";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: PRIMARY },
    secondary: { main: "#1C9B8E" },
    background: { default: CREAM },
    text: { primary: INK, secondary: MUTED_INK },
  },
  typography: {
    fontFamily: '"Nunito", sans-serif',
    h1: { fontFamily: '"Baloo 2", sans-serif' },
    h2: { fontFamily: '"Baloo 2", sans-serif' },
    h3: { fontFamily: '"Baloo 2", sans-serif' },
    button: { fontFamily: '"Baloo 2", sans-serif', textTransform: "none" },
  },
  shape: { borderRadius: 22 },
});

export default function AppShell({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
