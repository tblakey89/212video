import React from "react";
import { Alert, Box, Button, Card, CardContent, TextField, Typography } from "@mui/material";

export default function LoginCard({
  loginUser,
  loginPass,
  loginError,
  onLoginUser,
  onLoginPass,
  onSubmit,
}) {
  return (
    <Box sx={{ maxWidth: 420, mx: "auto", mt: { xs: 6, md: 10 }, position: "relative", zIndex: 1 }}>
      <Card sx={{ borderRadius: 3, boxShadow: "0 18px 40px rgba(27,27,31,0.16)" }}>
        <CardContent>
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Bebas Neue", sans-serif',
              letterSpacing: "0.2em",
              fontSize: 42,
              mb: 1,
            }}
          >
            212video
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Enter the family passcode to continue.
          </Typography>
          <Box component="form" onSubmit={onSubmit} sx={{ display: "grid", gap: 2 }}>
            <TextField label="Username" value={loginUser} onChange={onLoginUser} />
            <TextField
              label="Password"
              type="password"
              value={loginPass}
              onChange={onLoginPass}
            />
            {loginError && <Alert severity="error">{loginError}</Alert>}
            <Button type="submit" variant="contained">
              Unlock
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
