import React from "react";
import { timeRingColor, timeRingFraction, remainingMinutes } from "../../utils/time.js";

// Depleting ring showing remaining play-time minutes.
export default function TimeRing({ remaining, total, size = 60, dark = false }) {
  const frac = timeRingFraction(remaining, total);
  const mins = remainingMinutes(remaining);
  const R = size / 2 - 5;
  const C = 2 * Math.PI * R;
  const col = timeRingColor(remaining, total);
  return (
    <div style={{ position: "relative", width: size, height: size, flex: "none" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={R}
          fill="none"
          stroke={dark ? "rgba(255,255,255,0.18)" : "rgba(42,32,24,0.10)"}
          strokeWidth="6"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={R}
          fill="none"
          stroke={col}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - frac)}
          style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.6s ease" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", lineHeight: 1 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: size * 0.34, color: dark ? "#fff" : "#2A2018" }}>
            {mins}
          </div>
          <div
            style={{
              fontFamily: "Nunito, sans-serif",
              fontWeight: 700,
              fontSize: size * 0.13,
              color: dark ? "rgba(255,255,255,0.6)" : "#8A7A6A",
              marginTop: -2,
              letterSpacing: ".06em",
            }}
          >
            MIN
          </div>
        </div>
      </div>
    </div>
  );
}
