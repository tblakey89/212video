function enrichVideo(video, collection, isShort) {
  return {
    ...video,
    category: collection.category,
    channelName: collection.name,
    channelId: collection.id,
    isShort,
  };
}

export function enrichChannels(channels) {
  return channels.map((channel) => ({
    ...channel,
    videos: (channel.videos || []).map((v) => enrichVideo(v, channel, false)),
    shorts: (channel.shorts || []).map((v) => enrichVideo(v, channel, true)),
  }));
}

export function enrichPlaylists(playlists) {
  return playlists.map((playlist) => ({
    ...playlist,
    videos: (playlist.videos || []).map((v) =>
      enrichVideo(v, playlist, Boolean(v.isShort))
    ),
  }));
}
