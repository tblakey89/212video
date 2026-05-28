import React from "react";
import SectionTitle from "./shell/SectionTitle.jsx";
import FilterToggle from "./shell/FilterToggle.jsx";
import Row from "./Row.jsx";
import VideoCard from "./VideoCard.jsx";
import VideoGrid from "./VideoGrid.jsx";

export default function HomeView({
  inProgressItems,
  homeItems,
  homeFilter,
  onFilterChange,
  onSelectVideo,
  onResetProgress,
  disabled,
  videoProgress,
  visibleCount,
  sentinelRef,
}) {
  const shown = homeItems.slice(0, visibleCount).map((item) => item.video);

  return (
    <div>
      {inProgressItems.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <SectionTitle sub="Pick up where you left off">Keep watching</SectionTitle>
          <Row>
            {inProgressItems.map((item) => (
              <VideoCard
                key={item.video.id}
                video={item.video}
                width={340}
                watchedSeconds={item.watched}
                onSelect={onSelectVideo}
                onReset={onResetProgress}
                disabled={disabled}
              />
            ))}
          </Row>
        </section>
      )}

      <SectionTitle
        sub="A hand-picked mix, just for you"
        action={<FilterToggle value={homeFilter} onChange={onFilterChange} />}
      >
        For you
      </SectionTitle>
      <VideoGrid
        videos={shown}
        shorts={homeFilter === "shorts"}
        videoProgress={videoProgress}
        onSelect={onSelectVideo}
        onReset={onResetProgress}
        disabled={disabled}
      />
      <div ref={sentinelRef} style={{ height: 1 }} />
    </div>
  );
}
