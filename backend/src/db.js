const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const dataDir = path.join(__dirname, "..", "data");
const dbPath = path.join(dataDir, "watch.sqlite");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS watch_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    video_id TEXT NOT NULL,
    channel_id TEXT,
    title TEXT,
    seconds INTEGER NOT NULL,
    watched_at TEXT NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS channel_cache (
    channel_id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS videos (
    video_id TEXT NOT NULL,
    channel_key TEXT NOT NULL,
    channel_id TEXT,
    title TEXT,
    published_at TEXT,
    duration_seconds INTEGER,
    is_short INTEGER NOT NULL,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (video_id, channel_key)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS channel_refresh (
    channel_key TEXT PRIMARY KEY,
    refreshed_at TEXT NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS playlist_videos (
    playlist_key TEXT NOT NULL,
    video_id TEXT NOT NULL,
    title TEXT,
    published_at TEXT,
    duration_seconds INTEGER,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (playlist_key, video_id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS playlist_refresh (
    playlist_key TEXT PRIMARY KEY,
    refreshed_at TEXT NOT NULL
  );
`);

function ensureColumn(table, column, definition) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all();
  const hasColumn = columns.some((col) => col.name === column);
  if (!hasColumn) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

ensureColumn("watch_events", "user_id", "INTEGER");

const insertWatchEvent = db.prepare(`
  INSERT INTO watch_events (user_id, video_id, channel_id, title, seconds, watched_at)
  VALUES (@userId, @videoId, @channelId, @title, @seconds, @watchedAt)
`);

const summaryByDate = db.prepare(`
  SELECT COALESCE(SUM(seconds), 0) AS totalSeconds,
         COUNT(*) AS eventCount
  FROM watch_events
  WHERE substr(watched_at, 1, 10) = @date
`);

const recentEvents = db.prepare(`
  SELECT video_id AS videoId,
         channel_id AS channelId,
         title,
         seconds,
         watched_at AS watchedAt,
         user_id AS userId
  FROM watch_events
  ORDER BY watched_at DESC
  LIMIT @limit
`);

const videoProgressStmt = db.prepare(`
  SELECT video_id AS videoId,
         COALESCE(SUM(seconds), 0) AS totalSeconds
  FROM watch_events
  GROUP BY video_id
`);

const deleteVideoProgressStmt = db.prepare(`
  DELETE FROM watch_events
  WHERE video_id = @videoId
`);

const getChannelCacheStmt = db.prepare(`
  SELECT channel_id AS channelId,
         data,
         updated_at AS updatedAt
  FROM channel_cache
  WHERE channel_id = @channelId
`);

const upsertChannelCacheStmt = db.prepare(`
  INSERT INTO channel_cache (channel_id, data, updated_at)
  VALUES (@channelId, @data, @updatedAt)
  ON CONFLICT(channel_id) DO UPDATE SET
    data = excluded.data,
    updated_at = excluded.updated_at
`);
const clearChannelCacheStmt = db.prepare(`
  DELETE FROM channel_cache
`);

const upsertVideoStmt = db.prepare(`
  INSERT INTO videos (
    video_id,
    channel_key,
    channel_id,
    title,
    published_at,
    duration_seconds,
    is_short,
    updated_at
  )
  VALUES (
    @videoId,
    @channelKey,
    @channelId,
    @title,
    @publishedAt,
    @durationSeconds,
    @isShort,
    @updatedAt
  )
  ON CONFLICT(video_id, channel_key) DO UPDATE SET
    channel_id = excluded.channel_id,
    title = excluded.title,
    published_at = excluded.published_at,
    duration_seconds = excluded.duration_seconds,
    is_short = excluded.is_short,
    updated_at = excluded.updated_at
`);

const listVideosByChannelStmt = db.prepare(`
  SELECT video_id AS id,
         title,
         published_at AS publishedAt,
         duration_seconds AS durationSeconds,
         is_short AS isShort
  FROM videos
  WHERE channel_key = @channelKey
  ORDER BY published_at DESC
`);

const upsertPlaylistVideoStmt = db.prepare(`
  INSERT INTO playlist_videos (
    playlist_key,
    video_id,
    title,
    published_at,
    duration_seconds,
    updated_at
  )
  VALUES (
    @playlistKey,
    @videoId,
    @title,
    @publishedAt,
    @durationSeconds,
    @updatedAt
  )
  ON CONFLICT(playlist_key, video_id) DO UPDATE SET
    title = excluded.title,
    published_at = excluded.published_at,
    duration_seconds = excluded.duration_seconds,
    updated_at = excluded.updated_at
`);

const listVideosByPlaylistStmt = db.prepare(`
  SELECT video_id AS id,
         title,
         published_at AS publishedAt,
         duration_seconds AS durationSeconds
  FROM playlist_videos
  WHERE playlist_key = @playlistKey
  ORDER BY published_at DESC
`);

const upsertChannelRefreshStmt = db.prepare(`
  INSERT INTO channel_refresh (channel_key, refreshed_at)
  VALUES (@channelKey, @refreshedAt)
  ON CONFLICT(channel_key) DO UPDATE SET
    refreshed_at = excluded.refreshed_at
`);

const getChannelRefreshStmt = db.prepare(`
  SELECT refreshed_at AS refreshedAt
  FROM channel_refresh
  WHERE channel_key = @channelKey
`);

const upsertPlaylistRefreshStmt = db.prepare(`
  INSERT INTO playlist_refresh (playlist_key, refreshed_at)
  VALUES (@playlistKey, @refreshedAt)
  ON CONFLICT(playlist_key) DO UPDATE SET
    refreshed_at = excluded.refreshed_at
`);

const getPlaylistRefreshStmt = db.prepare(`
  SELECT refreshed_at AS refreshedAt
  FROM playlist_refresh
  WHERE playlist_key = @playlistKey
`);

function recordWatchEvent({ userId, videoId, channelId, title, seconds, watchedAt }) {
  insertWatchEvent.run({
    userId: userId || null,
    videoId,
    channelId,
    title,
    seconds,
    watchedAt,
  });
}

function getSummary(date) {
  return summaryByDate.get({ date });
}

function getRecent(limit = 50) {
  return recentEvents.all({ limit });
}

function getVideoProgress() {
  return videoProgressStmt.all();
}

function deleteVideoProgress(videoId) {
  deleteVideoProgressStmt.run({ videoId });
}

function getChannelCache(channelId) {
  return getChannelCacheStmt.get({ channelId });
}

function setChannelCache(channelId, data, updatedAt) {
  upsertChannelCacheStmt.run({ channelId, data, updatedAt });
}

function clearChannelCache() {
  clearChannelCacheStmt.run();
}

function upsertVideo({
  videoId,
  channelKey,
  channelId,
  title,
  publishedAt,
  durationSeconds,
  isShort,
  updatedAt,
}) {
  upsertVideoStmt.run({
    videoId,
    channelKey,
    channelId,
    title,
    publishedAt,
    durationSeconds,
    isShort,
    updatedAt,
  });
}

function listVideosByChannel(channelKey) {
  return listVideosByChannelStmt.all({ channelKey });
}

function upsertPlaylistVideo({ playlistKey, videoId, title, publishedAt, durationSeconds, updatedAt }) {
  upsertPlaylistVideoStmt.run({
    playlistKey,
    videoId,
    title,
    publishedAt,
    durationSeconds,
    updatedAt,
  });
}

function listVideosByPlaylist(playlistKey) {
  return listVideosByPlaylistStmt.all({ playlistKey });
}

function setChannelRefreshed(channelKey, refreshedAt) {
  upsertChannelRefreshStmt.run({ channelKey, refreshedAt });
}

function getChannelRefreshed(channelKey) {
  return getChannelRefreshStmt.get({ channelKey });
}

function setPlaylistRefreshed(playlistKey, refreshedAt) {
  upsertPlaylistRefreshStmt.run({ playlistKey, refreshedAt });
}

function getPlaylistRefreshed(playlistKey) {
  return getPlaylistRefreshStmt.get({ playlistKey });
}

module.exports = {
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
};
