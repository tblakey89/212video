export function getVideosForFilter(channel, filter) {
  if (!channel) {
    return [];
  }
  if (filter === "shorts") {
    return channel.shorts || [];
  }
  if (filter === "full") {
    return channel.videos || [];
  }
  return [...(channel.videos || []), ...(channel.shorts || [])];
}
