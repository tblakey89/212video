import React, { useRef } from "react";

// Horizontal scrolling row with large nudge arrows for remote/trackpad.
export default function Row({ children }) {
  const ref = useRef(null);
  const nudge = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 720), behavior: "smooth" });
  };
  return (
    <div style={{ position: "relative" }}>
      <div ref={ref} className="row-scroll" style={{ display: "flex", gap: 22, overflowX: "auto", padding: "6px 2px 14px", scrollSnapType: "x proximity" }}>
        {React.Children.map(children, (ch) => (
          <div style={{ scrollSnapAlign: "start", flex: "none" }}>{ch}</div>
        ))}
      </div>
      {["left", "right"].map((side) => (
        <button key={side} onClick={() => nudge(side === "left" ? -1 : 1)} aria-label={side}
          style={{ position: "absolute", top: "calc(50% - 30px)", [side]: -6, transform: "translateY(-50%)", width: 52, height: 52, borderRadius: 26, border: "none", cursor: "pointer", background: "#fff", boxShadow: "0 6px 18px rgba(60,38,20,.18)", display: "grid", placeItems: "center", zIndex: 3 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5a4a3a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: side === "left" ? "rotate(180deg)" : "none" }}><path d="M9 6l6 6-6 6" /></svg>
        </button>
      ))}
    </div>
  );
}
