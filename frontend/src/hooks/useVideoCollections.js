import { useMemo } from "react";
import { toTimestamp } from "../utils/date.js";

function buildRecentItems(channels, key, isShort) {
  const items = [];
  channels.forEach((channel) => {
    (channel[key] || []).forEach((video) => {
      items.push({ channel, video, isShort });
    });
  });
  return items.sort((a, b) => toTimestamp(b.video.publishedAt) - toTimestamp(a.video.publishedAt));
}

export function useVideoCollections({ channels, homeFilter, videoProgress }) {
  const sortedChannels = useMemo(() => {
    return [...channels].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [channels]);

  const recentFullItems = useMemo(() => buildRecentItems(channels, "videos", false), [channels]);
  const recentShortItems = useMemo(() => buildRecentItems(channels, "shorts", true), [channels]);
  const homeItems = homeFilter === "shorts" ? recentShortItems : recentFullItems;

  const inProgressItems = useMemo(() => {
    const items = [];
    channels.forEach((channel) => {
      const allVideos = [...(channel.videos || []), ...(channel.shorts || [])];
      allVideos.forEach((video) => {
        const watched = videoProgress[video.id] || 0;
        if (!watched) {
          return;
        }
        const duration = video.durationSeconds || 0;
        if (duration && watched >= duration * 0.9) {
          return;
        }
        const isShort = (channel.shorts || []).some((short) => short.id === video.id);
        items.push({ channel, video, watched, isShort });
      });
    });
    return items.sort((a, b) => toTimestamp(b.video.publishedAt) - toTimestamp(a.video.publishedAt));
  }, [channels, videoProgress]);

  return { sortedChannels, homeItems, inProgressItems };
}
