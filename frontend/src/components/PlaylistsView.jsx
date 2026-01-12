import React from "react";
import PlaylistPage from "./PlaylistPage.jsx";
import PlaylistsList from "./PlaylistsList.jsx";
import ViewContainer from "./ViewContainer.jsx";

export default function PlaylistsView({
  view,
  selectedPlaylist,
  playlists,
  visibleCount,
  sentinelRef,
  disabled,
  videoProgress,
  onSelectPreview,
  onSelectPlaylistVideo,
  onSeeAll,
  previewCount,
  onBack,
}) {
  return (
    <ViewContainer>
      {view === "playlist" && selectedPlaylist ? (
        <PlaylistPage
          playlist={selectedPlaylist}
          visibleCount={visibleCount}
          sentinelRef={sentinelRef}
          disabled={disabled}
          videoProgress={videoProgress}
          onBack={onBack}
          onSelect={onSelectPlaylistVideo}
        />
      ) : (
        <PlaylistsList
          playlists={playlists}
          previewCount={previewCount}
          disabled={disabled}
          videoProgress={videoProgress}
          onSelect={onSelectPreview}
          onSeeAll={onSeeAll}
        />
      )}
    </ViewContainer>
  );
}
