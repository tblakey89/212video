import React from "react";
import { Box, Button, Tab, Tabs } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function ChannelsTabs({ value, onChange, onRefresh }) {
  return (
    <>
      <Tabs value={value} onChange={onChange} sx={{ mb: 3 }}>
        <Tab label="Shorts" value="shorts" />
        <Tab label="Full videos" value="full" />
      </Tabs>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="text"
          size="small"
          startIcon={<RefreshIcon fontSize="small" />}
          onClick={onRefresh}
          sx={{
            opacity: 0.45,
            fontSize: 12,
            textTransform: "none",
            "&:hover": { opacity: 0.9 },
          }}
        >
          Refresh
        </Button>
      </Box>
    </>
  );
}
