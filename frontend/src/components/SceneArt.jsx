import React from "react";

// Ambient backdrop for the lockout takeovers: sun/dawn with hills + clouds, or
// a starry night.
export default function SceneArt({ art }) {
  if (art === "sun" || art === "dawn") {
    const top = art === "dawn";
    return (
      <div style={{ position: "absolute", inset: 0, zIndex: 1, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: top ? "62%" : "12%", transform: "translateX(-50%)", width: 220, height: 220, borderRadius: "50%", background: top ? "radial-gradient(circle,#FFE8A8,#FFD27A)" : "radial-gradient(circle,#FFF1C2,#FFD06A)", boxShadow: "0 0 90px 30px rgba(255,210,120,.5)" }} />
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "38%" }}>
          <path fill={top ? "#9DBE86" : "#8FB877"} d="M0 220 Q360 120 720 200 T1440 180 V320 H0 Z" opacity="0.9" />
          <path fill={top ? "#86AC72" : "#7AA866"} d="M0 260 Q420 200 840 250 T1440 240 V320 H0 Z" />
        </svg>
        {[[14, 18, 1], [70, 26, 0.8], [40, 12, 0.6]].map(([l, t, o], i) => (
          <div key={i} className="cloud-float" style={{ position: "absolute", left: `${l}%`, top: `${t}%`, opacity: o, animationDelay: `${i * 1.5}s` }}>
            <div style={{ width: 120, height: 38, borderRadius: 999, background: "rgba(255,255,255,.85)", boxShadow: "30px -14px 0 -4px rgba(255,255,255,.85), -28px -10px 0 -6px rgba(255,255,255,.85)" }} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1, overflow: "hidden" }}>
      <div style={{ position: "absolute", right: "16%", top: "14%", width: 130, height: 130, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%,#FBF3E7,#E6DCC8)", boxShadow: "0 0 70px 18px rgba(240,230,200,.35)" }} />
      {Array.from({ length: 40 }).map((_, i) => {
        const x = (i * 97) % 100;
        const y = (i * 53) % 70;
        const sz = 1 + ((i * 7) % 3);
        return <div key={i} className="twinkle" style={{ position: "absolute", left: `${x}%`, top: `${y}%`, width: sz, height: sz, borderRadius: "50%", background: "#fff", opacity: 0.5 + (i % 5) / 10, animationDelay: `${(i % 7) * 0.4}s` }} />;
      })}
      <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "34%" }}>
        <path fill="#241D44" d="M0 230 Q360 150 720 210 T1440 190 V320 H0 Z" />
      </svg>
    </div>
  );
}
