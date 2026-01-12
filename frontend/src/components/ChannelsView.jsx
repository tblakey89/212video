import React from "react";
import ChannelsList from "./ChannelsList.jsx";
import ChannelsTabs from "./ChannelsTabs.jsx";
import ChannelPage from "./ChannelPage.jsx";
import ViewContainer from "./ViewContainer.jsx";

export default function ChannelsView({
  view,
  selectedChannel,
  channels,
  filter,
  onFilterChange,
  onRefresh,
  visibleCount,
  sentinelRef,
  disabled,
  videoProgress,
  onSelectPreview,
  onSelectChannelVideo,
  onSeeAll,
  previewCount,
  onBack,
}) {
  return (
    <>
      {view !== "player" && (
        <ChannelsTabs value={filter} onChange={onFilterChange} onRefresh={onRefresh} />
      )}
      <ViewContainer>
        {view === "channel" && selectedChannel ? (
          <ChannelPage
            channel={selectedChannel}
            filter={filter}
            visibleCount={visibleCount}
            sentinelRef={sentinelRef}
            disabled={disabled}
            videoProgress={videoProgress}
            onBack={onBack}
            onSelect={onSelectChannelVideo}
          />
        ) : (
          <ChannelsList
            channels={channels}
            filter={filter}
            previewCount={previewCount}
            disabled={disabled}
            videoProgress={videoProgress}
            onSelect={onSelectPreview}
            onSeeAll={onSeeAll}
          />
        )}
      </ViewContainer>
    </>
  );
}
