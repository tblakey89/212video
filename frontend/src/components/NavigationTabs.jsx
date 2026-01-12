import React from "react";
import { Tab, Tabs } from "@mui/material";

export default function NavigationTabs({ page, onChange }) {
  return (
    <Tabs value={page} onChange={onChange} sx={{ mb: 3 }}>
      <Tab label="Home" value="home" />
      <Tab label="Channels" value="channels" />
      <Tab label="Playlists" value="playlists" />
    </Tabs>
  );
}
