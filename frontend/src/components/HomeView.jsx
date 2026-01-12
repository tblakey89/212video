import React from "react";
import InProgressSection from "./InProgressSection.jsx";
import HomeGrid from "./HomeGrid.jsx";
import HomeTabs from "./HomeTabs.jsx";

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
  return (
    <>
      <InProgressSection
        items={inProgressItems}
        onSelect={onSelectVideo}
        onReset={onResetProgress}
        disabled={disabled}
        videoProgress={videoProgress}
      />
      <HomeTabs value={homeFilter} onChange={onFilterChange} />
      <HomeGrid
        items={homeItems}
        onSelect={onSelectVideo}
        disabled={disabled}
        videoProgress={videoProgress}
        visibleCount={visibleCount}
        sentinelRef={sentinelRef}
      />
    </>
  );
}
