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

const refreshingChannels = new Set();

async function refreshChannel(channel, channelKey, maxVideos, { incremental = false } = {}) {
  try {
    // Incremental top-up: tell the fetch which videos we already have so it can
    // stop once it reaches them. A full backfill (or manual refresh) passes no
    // known set and re-scans the whole window.
    const knownIds = incremental
      ? new Set(listVideosByChannel(channelKey).map((video) => video.id))
      : null;
    const { videos, shorts, channelId } = await fetchChannelVideos(
      { channelId: channel.youtubeChannelId, handle: channel.youtubeHandle },
      apiKey,
      maxVideos,
      { knownIds }
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
  } catch (error) {
    const label = channel.youtubeHandle || channel.youtubeChannelId || channel.name;
    console.error(`YouTube fetch failed for ${label}: ${error.message}`);
  } finally {
    // Always stamp the refresh time — even on failure — so a broken/empty
    // channel (e.g. a bad handle) isn't re-attempted on every request; it
    // retries on the next daily cycle or via the manual Refresh button.
    setChannelRefreshed(channelKey, new Date().toISOString());
    refreshingChannels.delete(channelKey);
  }
}

function channelResponse(channel, channelKey) {
  const stored = listVideosByChannel(channelKey);
  return {
    ...channel,
    videos: stored.filter((video) => !video.isShort),
    shorts: stored.filter((video) => video.isShort),
  };
}

app.get("/api/channels", async (req, res) => {
  const data = readJson(channelsPath, { channels: [] });
  const settings = readJson(settingsPath, { dailyLimitSeconds: 1800, timezone: "Europe/London" });
  const maxVideos = Math.max(1, Number(settings.maxVideosPerChannel || 200));
  const today = new Date().toISOString().slice(0, 10);
  const manualRefresh = forceRefresh;
  forceRefresh = false;

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
      const neverRefreshed = !refreshMeta;
      const isStale = refreshedAt !== today;
      const hasData = listVideosByChannel(channelKey).length > 0;

      if (apiKey && manualRefresh) {
        // Manual "Refresh" button: full re-scan now, return fresh data.
        await refreshChannel(channel, channelKey, maxVideos, { incremental: false });
      } else if (apiKey && neverRefreshed) {
        // True first run on this machine (never fetched): full backfill,
        // blocking, so the first page load comes back already populated. Runs
        // once ever per channel — after this the channel always has a refresh
        // stamp and only refreshes in the background.
        await refreshChannel(channel, channelKey, maxVideos, { incremental: false });
      } else if (apiKey && isStale && !refreshingChannels.has(channelKey)) {
        // Daily top-up: refresh in the background so the load stays instant.
        // Incremental when we already have videos (stop at the first known one);
        // a full scan if the channel is somehow empty, to try to populate it.
        refreshingChannels.add(channelKey);
        refreshChannel(channel, channelKey, maxVideos, { incremental: hasData });
      }

      return channelResponse(channel, channelKey);
    })
  );

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
