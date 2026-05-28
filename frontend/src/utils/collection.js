// A channel keeps separate `videos`/`shorts`; a playlist keeps a single
// `videos`. This flattens either into one list filtered by the full/shorts
// toggle.
export function collectionVideos(collection, filter) {
  const all = [...(collection.videos || []), ...(collection.shorts || [])];
  return all.filter((v) => (filter === "shorts" ? v.isShort : !v.isShort));
}

export function collectionTotal(collection) {
  return (collection.videos || []).length + (collection.shorts || []).length;
}
