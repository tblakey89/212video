import React from "react";
import SectionTitle from "./shell/SectionTitle.jsx";
import FilterToggle from "./shell/FilterToggle.jsx";
import Row from "./Row.jsx";
import VideoCard from "./VideoCard.jsx";
import Glyph from "./primitives/Glyph.jsx";
import { resolveCategory } from "../config/categories.js";
import { collectionVideos } from "../utils/collection.js";

function PreviewBlock({ coll, filter, videoProgress, onSelect, onSeeAll, disabled }) {
  const cat = resolveCategory(coll.category);
  const vids = collectionVideos(coll, filter);
  if (vids.length === 0) return null;
  return (
    <section style={{ marginBottom: 38 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, margin: "4px 2px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ width: 46, height: 46, borderRadius: 14, background: cat.soft, color: cat.color, display: "grid", placeItems: "center", flex: "none" }}>
            <Glyph kind={cat.glyph} size={26} />
          </span>
          <div>
            <h3 style={{ margin: 0, fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 24, color: "#2A2018" }}>{coll.name}</h3>
            <div style={{ fontFamily: "Nunito, sans-serif", fontSize: 14.5, fontWeight: 700, color: "#A89684" }}>{vids.length} videos</div>
          </div>
        </div>
        <button onClick={() => onSeeAll(coll)} style={{ border: "none", cursor: "pointer", fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 17, color: cat.color, background: cat.soft, padding: "10px 20px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 6 }}>
          See all <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
      <Row>
        {vids.slice(0, 10).map((v) => (
          <VideoCard key={v.id} video={v} width={v.isShort ? 190 : 320} watchedSeconds={videoProgress[v.id] || 0} onSelect={onSelect} showChannel={false} disabled={disabled} />
        ))}
      </Row>
    </section>
  );
}

export default function BrowseScreen({ kind, collections, filter, onFilterChange, videoProgress, onSelect, onSeeAll, onRefresh, refreshing, disabled }) {
  const label = kind === "channels" ? "Channels" : "Playlists";
  const sub = kind === "channels" ? "Grown-up–approved channels" : "Learn something step by step";
  return (
    <div>
      <SectionTitle
        sub={sub}
        action={
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <FilterToggle value={filter} onChange={onFilterChange} />
            <button onClick={onRefresh} title="Get the newest videos" aria-label="Refresh"
              style={{ border: "none", cursor: "pointer", width: 48, height: 48, borderRadius: 999, background: "#fff", boxShadow: "0 3px 10px rgba(60,38,20,.12)", display: "grid", placeItems: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5a4a3a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{ animation: refreshing ? "spin 0.8s linear infinite" : "none" }}><path d="M3 12a9 9 0 1 0 3-6.7M3 4v4h4" /></svg>
            </button>
          </div>
        }
      >
        {label}
      </SectionTitle>
      {collections.map((c) => (
        <PreviewBlock key={c.id} coll={c} filter={filter} videoProgress={videoProgress} onSelect={onSelect} onSeeAll={onSeeAll} disabled={disabled} />
      ))}
    </div>
  );
}
