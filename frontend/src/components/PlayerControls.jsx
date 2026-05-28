import React from "react";
import { formatDuration } from "../utils/format.js";

// 212's own control bar, kept OUTSIDE the YouTube iframe so we never depend on
// YouTube's chrome (which we block). Drives the real player via callbacks.
export default function PlayerControls({ color, isPaused, pos, dur, onPlay, onPause, onSeek }) {
  const frac = dur > 0 ? Math.min(1, pos / dur) : 0;

  const scrub = (e) => {
    if (!dur) return;
    const r = e.currentTarget.getBoundingClientRect();
    const f = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    onSeek(Math.floor(f * dur));
  };

  return (
    <div style={{ flex: "none", padding: "0 clamp(16px,4vw,56px) 26px", display: "flex", alignItems: "center", gap: 20 }}>
      <button onClick={isPaused ? onPlay : onPause} aria-label={isPaused ? "play" : "pause"}
        style={{ flex: "none", width: 66, height: 66, borderRadius: 33, border: "none", cursor: "pointer", background: color, color: "#fff", display: "grid", placeItems: "center", boxShadow: `0 8px 22px ${color}66` }}>
        {isPaused ? (
          <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="5" width="4" height="14" rx="1.5" /><rect x="14" y="5" width="4" height="14" rx="1.5" /></svg>
        )}
      </button>
      <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: 16, color: "rgba(255,255,255,.85)", flex: "none", width: 52 }}>{formatDuration(pos)}</span>
      <div onClick={scrub} style={{ flex: 1, height: 14, borderRadius: 7, background: "rgba(255,255,255,.16)", cursor: "pointer", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${frac * 100}%`, background: color, borderRadius: 7 }} />
        <div style={{ position: "absolute", left: `calc(${frac * 100}% - 11px)`, top: -4, width: 22, height: 22, borderRadius: 11, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,.4)" }} />
      </div>
      <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: 16, color: "rgba(255,255,255,.55)", flex: "none", width: 52 }}>{formatDuration(dur)}</span>
    </div>
  );
}
