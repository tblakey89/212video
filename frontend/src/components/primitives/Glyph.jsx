import React from "react";

// Simple geometric category glyphs. Stroke uses currentColor so the parent
// sets the category color.
export default function Glyph({ kind, size = 28, stroke = 2.4 }) {
  const p = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  const map = {
    spark: (
      <g {...p}>
        <path d="M12 3 L13.8 9.4 L20 11 L13.8 12.6 L12 19 L10.2 12.6 L4 11 L10.2 9.4 Z" />
      </g>
    ),
    atom: (
      <g {...p}>
        <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        <ellipse cx="12" cy="12" rx="9" ry="3.6" />
        <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
      </g>
    ),
    knight: (
      <g {...p}>
        <path d="M7 20 H17 M7 20 c0-5 1-7 3-9 l-1.6-1.2 2-1.4 1 1.3 c2 .6 3.5 2.4 3.5 5.3 V20" />
      </g>
    ),
    ball: (
      <g {...p}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12 H9 M15 12 H20.5" />
        <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
      </g>
    ),
    brick: (
      <g {...p}>
        <rect x="4.5" y="9.5" width="15" height="9" rx="1.5" />
        <path d="M8 9.5 V7.5 a1.5 1.5 0 0 1 3 0 V9.5 M13 9.5 V7.5 a1.5 1.5 0 0 1 3 0 V9.5" />
      </g>
    ),
    scroll: (
      <g {...p}>
        <path d="M6 5 h9 a2 2 0 0 1 2 2 v10 a2 2 0 0 0 2 2 H8 a2 2 0 0 1-2-2 Z" />
        <path d="M9 9 h5 M9 12 h5" />
      </g>
    ),
    pad: (
      <g {...p}>
        <rect x="3" y="8" width="18" height="8.5" rx="4.2" />
        <path d="M7.5 11 v3 M6 12.5 h3" />
        <circle cx="15.5" cy="11.8" r="1" fill="currentColor" stroke="none" />
        <circle cx="17.5" cy="13.6" r="1" fill="currentColor" stroke="none" />
      </g>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: "block" }}>
      {map[kind] || map.spark}
    </svg>
  );
}
