async function fetchJson(url, attempts = 3) {
  let lastError;
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`YouTube API error ${res.status}: ${text}`);
      }
      return res.json();
    } catch (error) {
      lastError = error;
      const delayMs = 250 * Math.pow(2, i);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw lastError;
}

async function getUploadsPlaylistId(channelId, apiKey) {
  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "contentDetails");
  url.searchParams.set("id", channelId);
  url.searchParams.set("key", apiKey);

  const data = await fetchJson(url.toString());
  const item = data.items && data.items[0];
  const uploads = item && item.contentDetails && item.contentDetails.relatedPlaylists;
  return uploads ? uploads.uploads : null;
}

async function getUploadsPlaylistIdForHandle(handle, apiKey) {
  const normalized = handle.replace(/^@/, "");
  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "contentDetails");
  url.searchParams.set("forHandle", normalized);
  url.searchParams.set("key", apiKey);

  const data = await fetchJson(url.toString());
  const item = data.items && data.items[0];
  const uploads = item && item.contentDetails && item.contentDetails.relatedPlaylists;
  return {
    uploadsPlaylistId: uploads ? uploads.uploads : null,
    channelId: item ? item.id : null,
  };
}

async function fetchPlaylistVideos(playlistId, apiKey, maxVideos) {
  const videos = [];
  let pageToken = "";

  while (videos.length < maxVideos) {
    const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("playlistId", playlistId);
    url.searchParams.set("maxResults", "50");
    url.searchParams.set("key", apiKey);
    if (pageToken) {
      url.searchParams.set("pageToken", pageToken);
    }

    const data = await fetchJson(url.toString());
    const items = data.items || [];

    for (const item of items) {
      const snippet = item.snippet;
      if (!snippet || !snippet.resourceId) {
        continue;
      }
      const videoId = snippet.resourceId.videoId;
      const title = snippet.title;
      const publishedAt = snippet.publishedAt || null;
      if (!videoId || title === "Private video" || title === "Deleted video") {
        continue;
      }
      videos.push({ id: videoId, title, publishedAt });
      if (videos.length >= maxVideos) {
        break;
      }
    }

    if (!data.nextPageToken) {
      break;
    }
    pageToken = data.nextPageToken;
  }

  const durations = await fetchVideoDurations(
    videos.map((video) => video.id),
    apiKey
  );

  return videos.map((video) => ({
    ...video,
    durationSeconds: durations[video.id] || null,
  }));
}

async function fetchVideoDurations(videoIds, apiKey) {
  const result = {};
  const chunkSize = 50;
  for (let i = 0; i < videoIds.length; i += chunkSize) {
    const chunk = videoIds.slice(i, i + chunkSize);
    if (chunk.length === 0) {
      continue;
    }
    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("part", "contentDetails");
    url.searchParams.set("id", chunk.join(","));
    url.searchParams.set("key", apiKey);

    const data = await fetchJson(url.toString());
    const items = data.items || [];
    for (const item of items) {
      const duration = item.contentDetails && item.contentDetails.duration;
      result[item.id] = duration ? parseDuration(duration) : null;
    }
  }
  return result;
}

function parseDuration(value) {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(value);
  if (!match) {
    return null;
  }
  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  return hours * 3600 + minutes * 60 + seconds;
}

function getShortsPlaylistId(channelId) {
  if (!channelId || !channelId.startsWith("UC")) {
    return null;
  }
  return `UUSH${channelId.slice(2)}`;
}

async function fetchChannelVideos({ channelId, handle }, apiKey, maxVideos) {
  if (channelId) {
    const uploadsPlaylistId = await getUploadsPlaylistId(channelId, apiKey);
    if (!uploadsPlaylistId) {
      return { videos: [], shorts: [], channelId };
    }
    const [videos, shorts] = await Promise.all([
      fetchPlaylistVideos(uploadsPlaylistId, apiKey, maxVideos),
      fetchShortsForChannel(channelId, apiKey, maxVideos),
    ]);
    const shortsSet = new Set(shorts.map((video) => video.id));
    const filteredVideos = videos.filter((video) => !shortsSet.has(video.id));
    return { videos: filteredVideos, shorts, channelId };
  }

  if (handle) {
    const { uploadsPlaylistId, channelId: resolvedId } = await getUploadsPlaylistIdForHandle(
      handle,
      apiKey
    );
    if (!uploadsPlaylistId) {
      return { videos: [], shorts: [], channelId: resolvedId || null };
    }
    const [videos, shorts] = await Promise.all([
      fetchPlaylistVideos(uploadsPlaylistId, apiKey, maxVideos),
      fetchShortsForChannel(resolvedId, apiKey, maxVideos),
    ]);
    const shortsSet = new Set(shorts.map((video) => video.id));
    const filteredVideos = videos.filter((video) => !shortsSet.has(video.id));
    return { videos: filteredVideos, shorts, channelId: resolvedId || null };
  }

  return { videos: [], shorts: [], channelId: null };
}

async function fetchShortsForChannel(channelId, apiKey, maxVideos) {
  const shortsPlaylistId = getShortsPlaylistId(channelId);
  if (!shortsPlaylistId) {
    return [];
  }
  try {
    return await fetchPlaylistVideos(shortsPlaylistId, apiKey, maxVideos);
  } catch (error) {
    const message = error && error.message ? error.message : "";
    if (message.includes("playlistNotFound") || message.includes("YouTube API error 404")) {
      return [];
    }
    throw error;
  }
}

module.exports = {
  fetchChannelVideos,
  fetchPlaylistVideos,
};
