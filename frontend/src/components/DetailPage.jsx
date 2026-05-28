import React from "react";
import FilterToggle from "./shell/FilterToggle.jsx";
import VideoGrid from "./VideoGrid.jsx";
import Glyph from "./primitives/Glyph.jsx";
import { resolveCategory } from "../config/categories.js";
import { collectionVideos, collectionTotal } from "../utils/collection.js";

export default function DetailPage({ coll, filter, onFilterChange, videoProgress, onSelect, onReset, onBack, disabled, visibleCount, sentinelRef }) {
  const cat = resolveCategory(coll.category);
  const all = collectionVideos(coll, filter);
  const shown = all.slice(0, visibleCount);
  return (
    <div>
      <button onClick={onBack}
        style={{ border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", boxShadow: "0 3px 10px rgba(60,38,20,.1)", padding: "11px 20px 11px 14px", borderRadius: 999, fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 17, color: "#5a4a3a", marginBottom: 22 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
        Back
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22 }}>
        <span style={{ width: 72, height: 72, borderRadius: 22, background: cat.soft, color: cat.color, display: "grid", placeItems: "center", flex: "none" }}>
          <Glyph kind={cat.glyph} size={40} />
        </span>
        <div>
          <h1 style={{ margin: 0, fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: "clamp(30px,4vw,46px)", color: "#2A2018", letterSpacing: "-.02em" }}>{coll.name}</h1>
          <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: 16, color: "#A89684" }}>{collectionTotal(coll)} videos · approved for you</div>
        </div>
        <div style={{ marginLeft: "auto" }}><FilterToggle value={filter} onChange={onFilterChange} /></div>
      </div>
      <VideoGrid videos={shown} shorts={filter === "shorts"} videoProgress={videoProgress} onSelect={onSelect} onReset={onReset} showChannel={false} disabled={disabled} />
      <div ref={sentinelRef} style={{ height: 1 }} />
    </div>
  );
}
