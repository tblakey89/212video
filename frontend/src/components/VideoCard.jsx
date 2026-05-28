import React, { useState } from "react";
import PosterThumbnail from "./primitives/PosterThumbnail.jsx";
import { resolveCategory } from "../config/categories.js";
import { formatDuration } from "../utils/format.js";
import { isWatched, watchedFraction } from "../utils/progress.js";

function CatDot({ category }) {
  const cat = resolveCategory(category);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 10, height: 10, borderRadius: 5, background: cat.color, flex: "none" }} />
      <span style={{ color: "#8A7A6A", fontWeight: 700 }}>{cat.label}</span>
    </span>
  );
}

export default function VideoCard({ video, watchedSeconds = 0, onSelect, onReset, showChannel = true, width, disabled }) {
  const [hover, setHover] = useState(false);
  const cat = resolveCategory(video.category);
  const watched = isWatched(watchedSeconds, video.durationSeconds);
  const inProgress = watchedSeconds > 0 && !watched;
  const frac = watchedFraction(watchedSeconds, video.durationSeconds);
  const ar = video.isShort ? "9 / 16" : "16 / 9";

  return (
    <div
      data-testid="video-card"
      role="button"
      tabIndex={0}
      aria-disabled={disabled}
      onClick={() => !disabled && onSelect(video)}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled) {
          e.preventDefault();
          onSelect(video);
        }
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: width || "100%",
        textAlign: "left",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.55 : 1,
        display: "block",
        outline: "none",
        transform: hover && !disabled ? "translateY(-6px)" : "none",
        transition: "transform .22s cubic-bezier(.2,.8,.2,1)",
      }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: ar,
          borderRadius: 22,
          overflow: "hidden",
          boxShadow: hover ? "0 18px 40px rgba(60,38,20,.22)" : "0 6px 18px rgba(60,38,20,.10)",
          transition: "box-shadow .22s ease",
          outline: hover ? `3px solid ${cat.color}` : "3px solid transparent",
          outlineOffset: 2,
        }}
      >
        <PosterThumbnail video={video} />
        <span style={{ position: "absolute", right: 10, bottom: 10, background: "rgba(28,20,12,.78)", color: "#fff", fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: 15, padding: "3px 10px", borderRadius: 999 }}>
          {video.isShort ? "Short" : formatDuration(video.durationSeconds)}
        </span>

        {watched && (
          <span style={{ position: "absolute", left: 10, bottom: 10, width: 34, height: 34, borderRadius: 17, background: "#1C9B8E", display: "grid", placeItems: "center", boxShadow: "0 3px 8px rgba(0,0,0,.25)" }} aria-label="watched">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
          </span>
        )}

        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", opacity: hover && !disabled ? 1 : 0, transition: "opacity .2s ease", background: hover && !disabled ? "rgba(28,20,12,.18)" : "transparent" }}>
          <span style={{ width: 64, height: 64, borderRadius: 32, background: "rgba(255,255,255,.95)", display: "grid", placeItems: "center", boxShadow: "0 8px 22px rgba(0,0,0,.3)", transform: hover ? "scale(1)" : "scale(.8)", transition: "transform .2s ease" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill={cat.color}><path d="M8 5v14l11-7z" /></svg>
          </span>
        </div>

        {inProgress && (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 7, background: "rgba(28,20,12,.25)" }}>
            <div style={{ height: "100%", width: `${frac * 100}%`, background: cat.color }} />
          </div>
        )}

        {onReset && (
          <button onClick={(e) => { e.stopPropagation(); onReset(video.id); }} title="Start over" aria-label="Start over"
            style={{ position: "absolute", top: 10, right: 10, width: 34, height: 34, borderRadius: 17, border: "none", cursor: "pointer", background: "rgba(255,255,255,.92)", display: "grid", placeItems: "center", opacity: hover ? 1 : 0, transition: "opacity .2s ease", boxShadow: "0 3px 8px rgba(0,0,0,.2)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5a4a3a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v4h4" /></svg>
          </button>
        )}
      </div>

      <div style={{ padding: "12px 4px 4px" }}>
        <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 19, lineHeight: 1.18, color: "#2A2018", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {video.title}
        </div>
        <div style={{ marginTop: 7, fontFamily: "Nunito, sans-serif", fontSize: 14.5, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {showChannel && <span style={{ color: "#8A7A6A", fontWeight: 700 }}>{video.channelName}</span>}
          {showChannel && <span style={{ color: "#D8C9B8" }}>•</span>}
          <CatDot category={video.category} />
        </div>
      </div>
    </div>
  );
}
