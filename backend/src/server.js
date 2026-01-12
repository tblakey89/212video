const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const {
  getChannelCache,
  setChannelCache,
  clearChannelCache,
  upsertVideo,
  listVideosByChannel,
  upsertPlaylistVideo,
  listVideosByPlaylist,
  setChannelRefreshed,
  getChannelRefreshed,
  setPlaylistRefreshed,
  getPlaylistRefreshed,
  recordWatchEvent,
  getSummary,
  getRecent,
  getVideoProgress,
  deleteVideoProgress,
} = require("./db");
const { fetchChannelVideos, fetchPlaylistVideos } = require("./youtube");

const app = express();
const port = process.env.PORT || 4000;
let forceRefresh = false;

const dataDir = path.join(__dirname, "..", "data");
const channelsPath = path.join(dataDir, "channels.json");
const playlistsPath = path.join(dataDir, "playlists.json");
const settingsPath = path.join(dataDir, "settings.json");
const apiKey = process.env.YOUTUBE_API_KEY;
const hasApiKey = Boolean(apiKey);

app.use(cors());
app.use(express.json());

function readJson(filePath, fallback) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/channels", async (req, res) => {
  const data = readJson(channelsPath, { channels: [] });
  const settings = readJson(settingsPath, { dailyLimitSeconds: 1800, timezone: "Europe/London" });
  const maxVideos = Math.max(1, Number(settings.maxVideosPerChannel || 200));
  const today = new Date().toISOString().slice(0, 10);

  const channels = await Promise.all(
    (data.channels || []).map(async (channel) => {
      const channelKey = channel.youtubeChannelId
        ? `id:${channel.youtubeChannelId}`
        : channel.youtubeHandle
        ? `handle:${channel.youtubeHandle}`
        : null;

      if (!channelKey) {
        return channel;
      }

      const refreshMeta = getChannelRefreshed(channelKey);
      const refreshedAt = refreshMeta ? refreshMeta.refreshedAt.slice(0, 10) : null;
      const shouldRefresh = forceRefresh || refreshedAt !== today;

      if (apiKey && shouldRefresh) {
        try {
          const { videos, shorts, channelId } = await fetchChannelVideos(
            { channelId: channel.youtubeChannelId, handle: channel.youtubeHandle },
            apiKey,
            maxVideos
          );
          const updatedAt = new Date().toISOString();
          videos.forEach((video) =>
            upsertVideo({
              videoId: video.id,
              channelKey,
              channelId: channelId || channel.youtubeChannelId || null,
              title: video.title || null,
              publishedAt: video.publishedAt || null,
              durationSeconds: video.durationSeconds || null,
              isShort: 0,
              updatedAt,
            })
          );
          shorts.forEach((video) =>
            upsertVideo({
              videoId: video.id,
              channelKey,
              channelId: channelId || channel.youtubeChannelId || null,
              title: video.title || null,
              publishedAt: video.publishedAt || null,
              durationSeconds: video.durationSeconds || null,
              isShort: 1,
              updatedAt,
            })
          );
          setChannelRefreshed(channelKey, updatedAt);
        } catch (error) {
          const label = channel.youtubeHandle || channel.youtubeChannelId || channel.name;
          console.error(`YouTube fetch failed for ${label}: ${error.message}`);
        }
      }

      const stored = listVideosByChannel(channelKey);
      const videos = stored.filter((video) => !video.isShort);
      const shorts = stored.filter((video) => video.isShort);
      return {
        ...channel,
        videos,
        shorts,
      };
    })
  );

  forceRefresh = false;
  res.json({ channels });
});

app.get("/api/playlists", async (req, res) => {
  const data = readJson(playlistsPath, { playlists: [] });
  const settings = readJson(settingsPath, { dailyLimitSeconds: 1800, timezone: "Europe/London" });
  const maxVideos = Math.max(
    1,
    Number(settings.maxVideosPerPlaylist || settings.maxVideosPerChannel || 200)
  );
  const today = new Date().toISOString().slice(0, 10);

  const playlists = await Promise.all(
    (data.playlists || []).map(async (playlist) => {
      const playlistId = playlist.youtubePlaylistId;
      const resolvedId = playlist.id || playlistId || playlist.name;
      const playlistKey = playlistId ? `id:${playlistId}` : `slug:${resolvedId}`;
      const refreshMeta = getPlaylistRefreshed(playlistKey);
      const refreshedAt = refreshMeta ? refreshMeta.refreshedAt.slice(0, 10) : null;
      const shouldRefresh = refreshedAt !== today;
      const inlineVideos = Array.isArray(playlist.videos) ? playlist.videos : [];

      if (playlistId && apiKey && shouldRefresh) {
        try {
          const videos = await fetchPlaylistVideos(playlistId, apiKey, maxVideos);
          const updatedAt = new Date().toISOString();
          videos.forEach((video) =>
            upsertPlaylistVideo({
              playlistKey,
              videoId: video.id,
              title: video.title || null,
              publishedAt: video.publishedAt || null,
              durationSeconds: video.durationSeconds || null,
              updatedAt,
            })
          );
          setPlaylistRefreshed(playlistKey, updatedAt);
        } catch (error) {
          const label = playlist.name || playlistId || playlist.id;
          console.error(`YouTube playlist fetch failed for ${label}: ${error.message}`);
        }
      }

      const stored = playlistId ? listVideosByPlaylist(playlistKey) : [];
      const videos = stored.length > 0 ? stored : inlineVideos;
      return {
        ...playlist,
        id: resolvedId,
        videos,
      };
    })
  );

  res.json({ playlists });
});

app.post("/api/channels/refresh", (req, res) => {
  forceRefresh = true;
  res.json({ ok: true });
});

app.get("/api/settings", (req, res) => {
  const data = readJson(settingsPath, {
    dailyLimitSeconds: 1800,
    timezone: "Europe/London",
    maxVideosPerChannel: 200,
    channelCacheMinutes: 720,
  });
  res.json(data);
});

app.get("/api/watch-summary", (req, res) => {
  const date = req.query.date;
  if (!date) {
    res.status(400).json({ error: "date is required (YYYY-MM-DD)" });
    return;
  }

  const summary = getSummary(date);
  res.json(summary);
});

app.get("/api/watched", (req, res) => {
  const limit = Number(req.query.limit || 50);
  const events = getRecent(limit);
  res.json({ events });
});

app.get("/api/video-progress", (req, res) => {
  const progress = getVideoProgress();
  res.json({ progress });
});

app.delete("/api/video-progress/:videoId", (req, res) => {
  const videoId = req.params.videoId;
  if (!videoId) {
    res.status(400).json({ error: "videoId is required" });
    return;
  }
  deleteVideoProgress(videoId);
  res.json({ ok: true });
});

app.post("/api/watch-events", (req, res) => {
  const { videoId, channelId, title, seconds } = req.body || {};
  if (!videoId || !seconds || Number.isNaN(Number(seconds))) {
    res.status(400).json({ error: "videoId and seconds are required" });
    return;
  }

  recordWatchEvent({
    userId: null,
    videoId,
    channelId: channelId || null,
    title: title || null,
    seconds: Number(seconds),
    watchedAt: new Date().toISOString(),
  });

  res.status(201).json({ ok: true });
});

app.listen(port, () => {
  console.log(`212video backend listening on ${port}`);
  console.log(`YouTube API key loaded: ${hasApiKey ? "yes" : "no"}`);
});
