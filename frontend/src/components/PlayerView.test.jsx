import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createRef } from "react";
import PlayerView from "./PlayerView.jsx";

const video = { id: "abc", title: "Test Video", channelName: "Tester", category: "making", durationSeconds: 300 };

function renderPlayer(props = {}) {
  return render(
    <PlayerView
      video={video}
      playerRef={createRef()}
      playerInstanceRef={{ current: null }}
      remaining={600}
      total={1800}
      isPaused={false}
      isEndingSoon={false}
      onBack={() => {}}
      {...props}
    />
  );
}

describe("PlayerView safety barriers", () => {
  it("covers the whole video with a click-blocker (no YouTube hotspot is reachable)", () => {
    renderPlayer();
    expect(screen.getByTestId("safezone-full")).toBeInTheDocument();
  });

  it("the barrier swallows clicks (stop propagation)", () => {
    renderPlayer();
    const barrier = screen.getByTestId("safezone-full");
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    const stop = vi.spyOn(event, "stopPropagation");
    barrier.dispatchEvent(event);
    expect(stop).toHaveBeenCalled();
  });

  it("tapping the video pauses while playing", () => {
    const pauseVideo = vi.fn();
    const playVideo = vi.fn();
    renderPlayer({ playerInstanceRef: { current: { pauseVideo, playVideo } }, isPaused: false });
    fireEvent.click(screen.getByTestId("safezone-full"));
    expect(pauseVideo).toHaveBeenCalled();
    expect(playVideo).not.toHaveBeenCalled();
  });

  it("tapping the paused video resumes", () => {
    const playVideo = vi.fn();
    renderPlayer({ playerInstanceRef: { current: { playVideo } }, isPaused: true });
    fireEvent.click(screen.getByTestId("pause-cover"));
    expect(playVideo).toHaveBeenCalled();
  });

  it("shows the pause cover with a resume button when paused", () => {
    renderPlayer({ isPaused: true });
    expect(screen.getByTestId("pause-cover")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /keep watching/i })).toBeInTheDocument();
  });

  it("shows the near-end cover that blocks end-screen cards", () => {
    renderPlayer({ isEndingSoon: true });
    expect(screen.getByTestId("nearend-cover")).toBeInTheDocument();
    expect(screen.getByText(/all done with this one/i)).toBeInTheDocument();
  });

  it("near-end cover wins over the pause cover", () => {
    renderPlayer({ isPaused: true, isEndingSoon: true });
    expect(screen.getByTestId("nearend-cover")).toBeInTheDocument();
    expect(screen.queryByTestId("pause-cover")).not.toBeInTheDocument();
  });

  it("renders a Back control", () => {
    renderPlayer();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });
});
