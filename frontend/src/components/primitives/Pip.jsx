import React from "react";
import { tint } from "../../theme/colors.js";

// Pip, the friendly mascot. moods: happy | wave | sleepy | yawn
export default function Pip({ size = 64, mood = "happy", color = "#F2683C", bob = true }) {
  const eye = (cx) =>
    mood === "sleepy" ? (
      <path
        d={`M${cx - 4} 0 q4 4 8 0`}
        fill="none"
        stroke="#2A2018"
        strokeWidth="3.4"
        strokeLinecap="round"
        transform="translate(0,2)"
      />
    ) : (
      <g>
        <circle cx={cx} cy="1" r="4.6" fill="#2A2018" />
        <circle cx={cx + 1.6} cy="-0.8" r="1.5" fill="#fff" />
      </g>
    );
  const mouth = {
    happy: <path d="M-7 11 q7 8 14 0" fill="none" stroke="#2A2018" strokeWidth="3.4" strokeLinecap="round" />,
    wave: <path d="M-7 11 q7 9 14 0" fill="none" stroke="#2A2018" strokeWidth="3.4" strokeLinecap="round" />,
    sleepy: <path d="M-4 12 q4 4 8 0" fill="none" stroke="#2A2018" strokeWidth="3.2" strokeLinecap="round" />,
    yawn: <ellipse cx="0" cy="13" rx="5.5" ry="7" fill="#2A2018" />,
  }[mood];
  const gid = `pipg-${color.replace("#", "")}`;

  return (
    <div className={bob ? "pip-bob" : ""} style={{ width: size, height: size, position: "relative", display: "inline-block" }}>
      <svg viewBox="-50 -52 100 104" width={size} height={size} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="-50" x2="0" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={tint(color, 0.18)} />
            <stop offset="1" stopColor={color} />
          </linearGradient>
        </defs>
        <rect x="-40" y="-42" width="80" height="84" rx="38" ry="40" fill={`url(#${gid})`} />
        <circle cx="-26" cy="-44" r="9" fill={color} />
        <circle cx="26" cy="-44" r="9" fill={color} />
        <circle cx="-22" cy="6" r="7" fill="#fff" opacity="0.28" />
        <circle cx="22" cy="6" r="7" fill="#fff" opacity="0.28" />
        <g transform="translate(0,-6)">
          {eye(-13)}
          {eye(13)}
          {mouth}
        </g>
        {mood === "wave" && (
          <g className="pip-wave" style={{ transformOrigin: "40px 6px" }}>
            <rect x="34" y="-2" width="13" height="26" rx="6.5" fill={color} />
          </g>
        )}
        {mood === "sleepy" && (
          <g fill="#2A2018" opacity="0.55" className="pip-z">
            <text x="34" y="-30" fontFamily="'Baloo 2', sans-serif" fontSize="18" fontWeight="700">z</text>
            <text x="46" y="-42" fontFamily="'Baloo 2', sans-serif" fontSize="13" fontWeight="700">z</text>
          </g>
        )}
      </svg>
    </div>
  );
}
