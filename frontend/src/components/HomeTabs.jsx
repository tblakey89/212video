import React from "react";
import { Tab, Tabs } from "@mui/material";

export default function HomeTabs({ value, onChange }) {
  return (
    <Tabs value={value} onChange={onChange} sx={{ mb: 3 }}>
      <Tab label="Full videos" value="full" />
      <Tab label="Shorts" value="shorts" />
    </Tabs>
  );
}
