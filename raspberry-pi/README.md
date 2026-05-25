# Raspberry Pi launcher

Use these files to create a desktop launcher that starts 212video in Chromium app mode.

## 1) Create a launch script

Create a script at the path referenced by the `.desktop` file (default shown below):

`/home/pi/212video/scripts/launch-212video.sh`

Example contents:

```bash
#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/home/pi/212video"
FRONTEND_PORT="5173"
BACKEND_PORT="4000"
URL="http://localhost:${FRONTEND_PORT}"

cd "${APP_DIR}"

# Start backend (adjust if you use a different command)
npm --workspace backend run start >/tmp/212video-backend.log 2>&1 &

# Start frontend (dev server; swap for a production server if you build)
npm --workspace frontend run dev -- --host 0.0.0.0 --port "${FRONTEND_PORT}" \
  >/tmp/212video-frontend.log 2>&1 &

sleep 3

# Launch Chromium locked down in kiosk mode.
# --kiosk hides all browser UI; the extra flags close common escape hatches
# (new tabs/windows, crash/restore bubbles, pinch-zoom, translate popups).
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --disable-pinch \
  --disable-features=TranslateUI \
  --disable-session-crashed-bubble \
  --overscroll-history-navigation=0 \
  --autoplay-policy=no-user-gesture-required \
  "${URL}"
```

## Disabling keyboard shortcuts (the F1/F-key escape)

`--kiosk` removes the browser chrome, but Chromium still honours keyboard
shortcuts like **F1** (opens Help in a new window — a full-web escape),
F3, Ctrl+T/N/L, etc. There is no Chromium flag to disable these, so block
them at the OS level with a tiny key remapper that runs alongside the kiosk.

Install `xbindkeys` (X11 desktop, the default Raspberry Pi OS):

```bash
sudo apt-get install -y xbindkeys
```

Create `/home/pi/.xbindkeysrc` that swallows the dangerous keys by binding
them to a no-op:

```
# F1 help, F3 search, plus other function keys -> do nothing
"true"
  F1
"true"
  F3
"true"
  F11
"true"
  F12
```

Then start it from the launch script *before* Chromium:

```bash
pkill xbindkeys 2>/dev/null || true
xbindkeys
```

For a Wayland-based image (`labwc`/`wayfire`) the equivalent is to remove
or override those keybinds in the compositor config instead.

Make it executable:

```bash
chmod +x /home/pi/212video/scripts/launch-212video.sh
```

## 2) Install the desktop entry

Copy the example file and update the paths:

```bash
cp /home/pi/212video/raspberry-pi/212video.desktop.example \
  /home/pi/.local/share/applications/212video.desktop
```

Edit the file to match your install paths:

- `Exec=` points to the launch script.
- `Icon=` points to a PNG.

## 3) Optional auto-start on boot

Copy the `.desktop` file to autostart:

```bash
mkdir -p /home/pi/.config/autostart
cp /home/pi/.local/share/applications/212video.desktop \
  /home/pi/.config/autostart/212video.desktop
```

## Notes

- For production, consider serving the frontend build with a static server instead of `vite dev`.
- Logs are written to `/tmp/212video-backend.log` and `/tmp/212video-frontend.log`.
