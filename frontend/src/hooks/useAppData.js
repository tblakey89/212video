import { useCallback, useEffect, useState } from "react";

export function useAppData(authFetch) {
  const [channels, setChannels] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [dailyLimitSeconds, setDailyLimitSeconds] = useState(1800);

  const loadData = useCallback(async () => {
    try {
      const [channelsRes, settingsRes, playlistsRes] = await Promise.all([
        authFetch("/api/channels"),
        authFetch("/api/settings"),
        authFetch("/api/playlists"),
      ]);

      if (channelsRes.ok) {
        const channelsData = await channelsRes.json();
        setChannels(channelsData.channels || []);
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setDailyLimitSeconds(settingsData.dailyLimitSeconds || 1800);
      }

      if (playlistsRes.ok) {
        const playlistsData = await playlistsRes.json();
        setPlaylists(playlistsData.playlists || []);
      } else {
        setPlaylists([]);
      }
    } catch (error) {
      // Ignore transient network errors.
    }
  }, [authFetch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    channels,
    playlists,
    dailyLimitSeconds,
    loadData,
    setDailyLimitSeconds,
  };
}
