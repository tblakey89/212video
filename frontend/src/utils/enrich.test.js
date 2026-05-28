import { describe, it, expect } from "vitest";
import { enrichChannels, enrichPlaylists } from "./enrich.js";

describe("enrichChannels", () => {
  it("stamps category, channelName, channelId and isShort onto each video", () => {
    const [channel] = enrichChannels([
      {
        id: "mark-rober",
        name: "Mark Rober",
        category: "making",
        videos: [{ id: "v1", title: "A" }],
        shorts: [{ id: "s1", title: "B" }],
      },
    ]);
    expect(channel.videos[0]).toMatchObject({
      id: "v1",
      category: "making",
      channelName: "Mark Rober",
      channelId: "mark-rober",
      isShort: false,
    });
    expect(channel.shorts[0]).toMatchObject({ id: "s1", isShort: true });
  });

  it("tolerates missing video arrays", () => {
    const [channel] = enrichChannels([{ id: "x", name: "X", category: "science" }]);
    expect(channel.videos).toEqual([]);
    expect(channel.shorts).toEqual([]);
  });
});

describe("enrichPlaylists", () => {
  it("uses the playlist name and category for its videos", () => {
    const [pl] = enrichPlaylists([
      { id: "p1", name: "Chess 101", category: "chess", videos: [{ id: "v1", title: "A" }] },
    ]);
    expect(pl.videos[0]).toMatchObject({
      category: "chess",
      channelName: "Chess 101",
      channelId: "p1",
    });
  });
});
