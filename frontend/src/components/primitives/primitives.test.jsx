import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Glyph from "./Glyph.jsx";
import Pip from "./Pip.jsx";
import TimeRing from "./TimeRing.jsx";
import PosterThumbnail from "./PosterThumbnail.jsx";

describe("Glyph", () => {
  it("renders an svg for a known kind", () => {
    const { container } = render(<Glyph kind="atom" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
  it("renders an svg for an unknown kind (fallback)", () => {
    const { container } = render(<Glyph kind="nope" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

describe("Pip", () => {
  it("renders an svg mascot", () => {
    const { container } = render(<Pip mood="wave" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

describe("TimeRing", () => {
  it("shows remaining whole minutes", () => {
    render(<TimeRing remaining={1800} total={1800} />);
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("MIN")).toBeInTheDocument();
  });
  it("ceils partial minutes", () => {
    render(<TimeRing remaining={61} total={1800} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});

describe("PosterThumbnail", () => {
  it("loads the real YouTube thumbnail from the video id", () => {
    const { container } = render(
      <PosterThumbnail video={{ id: "abc123", category: "making" }} />
    );
    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "https://i.ytimg.com/vi/abc123/hqdefault.jpg"
    );
  });
  it("falls back to the poster when the image fails", () => {
    const { container } = render(
      <PosterThumbnail video={{ id: "abc123", category: "making" }} />
    );
    fireEvent.error(container.querySelector("img"));
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });
  it("shows only the poster when there is no id", () => {
    const { container } = render(
      <PosterThumbnail video={{ category: "making" }} />
    );
    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
