import React from "react";
import VideoCard from "./VideoCard.jsx";

export default function VideoGrid({ videos, shorts, videoProgress, onSelect, onReset, showChannel = true, disabled }) {
  const min = shorts ? 200 : 300;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`, gap: 26, alignItems: "start" }}>
      {videos.map((v) => (
        <VideoCard
          key={v.id}
          video={v}
          watchedSeconds={videoProgress[v.id] || 0}
          onSelect={onSelect}
          onReset={onReset}
          showChannel={showChannel}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
