import { useEffect, useRef } from "react";

export function useYouTubePlayer({
  apiReady,
  containerRef,
  activeVideo,
  startSeconds,
  playerInstanceRef,
  onPlay,
  onPause,
  onEnd,
  onNearEnd,
}) {
  const lastVideoIdRef = useRef(null);
  const endCheckRef = useRef(null);

  useEffect(() => {
    if (!apiReady || !activeVideo) {
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
        playerInstanceRef.current = null;
      }
      lastVideoIdRef.current = null;
      return;
    }

    if (lastVideoIdRef.current === activeVideo.id) {
      return;
    }

    lastVideoIdRef.current = activeVideo.id;

    if (playerInstanceRef.current) {
      playerInstanceRef.current.destroy();
      playerInstanceRef.current = null;
    }
    if (endCheckRef.current) {
      clearInterval(endCheckRef.current);
      endCheckRef.current = null;
    }

    playerInstanceRef.current = new window.YT.Player(containerRef.current, {
      videoId: activeVideo.id,
      host: "https://www.youtube-nocookie.com",
      playerVars: {
        rel: 0,
        modestbranding: 1,
        autoplay: 1,
        start: startSeconds || 0,
        fs: 0,
        playsinline: 1,
        disablekb: 1,
        iv_load_policy: 3,
      },
      events: {
        onReady: (event) => {
          if (startSeconds > 0) {
            event.target.seekTo(startSeconds, true);
          }
        },
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            onPlay();
            if (!endCheckRef.current) {
              endCheckRef.current = setInterval(() => {
                const player = playerInstanceRef.current;
                if (!player || typeof player.getDuration !== "function") {
                  return;
                }
                const duration = Number(player.getDuration() || 0);
                const current = Number(player.getCurrentTime() || 0);
                if (duration > 0 && duration - current <= 2) {
                  onNearEnd();
                  clearInterval(endCheckRef.current);
                  endCheckRef.current = null;
                }
              }, 500);
            }
          }

          if (event.data === window.YT.PlayerState.PAUSED) {
            onPause();
          }

          if (event.data === window.YT.PlayerState.ENDED) {
            onEnd();
            if (endCheckRef.current) {
              clearInterval(endCheckRef.current);
              endCheckRef.current = null;
            }
          }
        },
      },
    });
  }, [
    apiReady,
    activeVideo,
    startSeconds,
    containerRef,
    playerInstanceRef,
    onPlay,
    onPause,
    onEnd,
    onNearEnd,
  ]);
}
