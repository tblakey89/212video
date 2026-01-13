import { useCallback, useEffect, useState } from "react";

export function useAppData(authFetch) {
  const [channels, setChannels] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [dailyLimitSeconds, setDailyLimitSeconds] = useState(1800);
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(19);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
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
        setStartHour(Number(settingsData.startHour ?? 9));
        setEndHour(Number(settingsData.endHour ?? 19));
      }

      if (playlistsRes.ok) {
        const playlistsData = await playlistsRes.json();
        setPlaylists(playlistsData.playlists || []);
      } else {
        setPlaylists([]);
      }
    } catch (error) {
      // Ignore transient network errors.
    } finally {
      setIsLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    channels,
    playlists,
    dailyLimitSeconds,
    startHour,
    endHour,
    isLoading,
    loadData,
    setDailyLimitSeconds,
  };
}
