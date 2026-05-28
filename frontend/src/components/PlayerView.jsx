import React, { useEffect, useState } from "react";
import TimeRing from "./primitives/TimeRing.jsx";
import Pip from "./primitives/Pip.jsx";
import PlayerControls from "./PlayerControls.jsx";
import { resolveCategory } from "../config/categories.js";

// A full transparent barrier over the whole cross-origin iframe. YouTube
// renders clickable links (title bar, logo, "More videos", end-cards) that
// escape to the open web; covering the entire frame makes none of them
// reachable. All playback happens through 212's own control bar below the
// stage. DO NOT remove.
function SafeZone({ style, testId, onActivate }) {
  return (
    <div
      data-testid={testId}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onActivate && onActivate();
      }}
      style={{ position: "absolute", zIndex: 6, cursor: "pointer", background: "transparent", ...style }}
    />
  );
}

export default function PlayerView({ video, playerRef, playerInstanceRef, remaining, total, isPaused, isEndingSoon, onBack }) {
  const cat = resolveCategory(video?.category);
  const dur = video?.durationSeconds || 0;
  const [pos, setPos] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      const p = playerInstanceRef?.current;
      if (p && typeof p.getCurrentTime === "function") {
        setPos(Number(p.getCurrentTime() || 0));
      }
    }, 500);
    return () => clearInterval(id);
  }, [playerInstanceRef]);

  const play = () => playerInstanceRef?.current?.playVideo?.();
  const pause = () => playerInstanceRef?.current?.pauseVideo?.();
  const seekTo = (s) => playerInstanceRef?.current?.seekTo?.(s, true);
  const replay = () => { seekTo(0); play(); };
  const toggle = () => (isPaused ? play() : pause());

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 40, background: "#1A130D", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px clamp(16px,3vw,40px)", flex: "none" }}>
        <button onClick={onBack} aria-label="Back" style={{ border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.12)", color: "#fff", padding: "12px 22px 12px 16px", borderRadius: 999, fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 18 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
          Back
        </button>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 22, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{video?.title}</div>
          <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: 14, color: "rgba(255,255,255,.55)" }}>{video?.channelName}</div>
        </div>
        <div style={{ marginLeft: "auto", flex: "none" }}>
          <div style={{ background: "rgba(255,255,255,.1)", borderRadius: 999, padding: 6 }}><TimeRing remaining={remaining} total={total} size={50} dark /></div>
        </div>
      </div>

      <div style={{ flex: 1, display: "grid", placeItems: "center", padding: "0 clamp(12px,3vw,48px) 8px", minHeight: 0 }}>
        <div style={{ position: "relative", aspectRatio: video?.isShort ? "9/16" : "16/9", maxWidth: video?.isShort ? "min(46vh, 480px)" : "min(100%, calc((100vh - 240px) * 16 / 9))", maxHeight: "calc(100vh - 220px)", width: video?.isShort ? "auto" : "100%", height: video?.isShort ? "calc(100vh - 220px)" : "auto", borderRadius: 20, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.5)", background: "#000" }}>
          <div className="player-mount" style={{ position: "absolute", inset: 0 }}>
            <div ref={playerRef} />
          </div>

          <SafeZone testId="safezone-full" style={{ inset: 0 }} onActivate={toggle} />

          {isPaused && !isEndingSoon && (
            <div data-testid="pause-cover" onClick={play} style={{ position: "absolute", inset: 0, zIndex: 8, background: "rgba(20,14,9,.62)", backdropFilter: "blur(3px)", display: "grid", placeItems: "center", cursor: "pointer" }}>
              <div style={{ textAlign: "center" }}>
                <Pip size={96} mood="happy" color={cat.color} />
                <button onClick={play} className="resume-btn" style={{ marginTop: 18, border: "none", cursor: "pointer", background: cat.color, color: "#fff", fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 26, padding: "18px 46px 18px 38px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 14, boxShadow: "0 12px 30px rgba(0,0,0,.35)" }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
                  Keep watching
                </button>
              </div>
            </div>
          )}

          {isEndingSoon && (
            <div data-testid="nearend-cover" style={{ position: "absolute", inset: 0, zIndex: 9, background: "rgba(20,14,9,.82)", backdropFilter: "blur(4px)", display: "grid", placeItems: "center", textAlign: "center" }}>
              <div>
                <Pip size={104} mood="wave" color={cat.color} />
                <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: 36, color: "#fff", margin: "14px 0 6px" }}>All done with this one!</h2>
                <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600, fontSize: 19, color: "rgba(255,255,255,.7)", margin: "0 0 26px" }}>Nice watching. What would you like next?</p>
                <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={replay} style={{ border: "none", cursor: "pointer", background: "rgba(255,255,255,.16)", color: "#fff", fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 20, padding: "15px 30px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 10 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v4h4" /></svg>
                    Watch again
                  </button>
                  <button onClick={onBack} style={{ border: "none", cursor: "pointer", background: cat.color, color: "#fff", fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 20, padding: "15px 34px", borderRadius: 999, boxShadow: "0 10px 24px rgba(0,0,0,.3)" }}>
                    Pick another
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <PlayerControls color={cat.color} isPaused={isPaused} pos={pos} dur={dur} onPlay={play} onPause={pause} onSeek={seekTo} />
    </div>
  );
}
