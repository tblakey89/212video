import React from "react";
import TimeRing from "../primitives/TimeRing.jsx";
import { remainingMinutes, timeRingFraction } from "../../utils/time.js";

function Logo({ onClick }) {
  return (
    <button onClick={onClick} style={{ border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, padding: 0 }}>
      <span style={{ position: "relative", width: 52, height: 52, flex: "none" }}>
        <span style={{ position: "absolute", inset: 0, borderRadius: 16, background: "linear-gradient(150deg,#F2683C,#E0673C)", boxShadow: "0 6px 16px rgba(224,103,60,.35)", transform: "rotate(-6deg)" }} />
        <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "#fff", fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: 22, transform: "rotate(-6deg)" }}>212</span>
      </span>
      <span style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 26, color: "#2A2018", letterSpacing: "-.01em" }}>two-one-two</span>
    </button>
  );
}

function NavTabs({ tab, setTab }) {
  const tabs = [
    { id: "home", label: "Home" },
    { id: "channels", label: "Channels" },
    { id: "playlists", label: "Playlists" },
  ];
  return (
    <nav style={{ display: "flex", gap: 8, background: "rgba(42,32,24,.05)", padding: 6, borderRadius: 999 }}>
      {tabs.map((t) => {
        const active = tab === t.id;
        return (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ border: "none", cursor: "pointer", fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 20, padding: "12px 28px", borderRadius: 999, color: active ? "#2A2018" : "#8A7A6A", background: active ? "#fff" : "transparent", boxShadow: active ? "0 4px 14px rgba(60,38,20,.14)" : "none", transition: "all .2s ease" }}>
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}

export default function Header({ tab, setTab, remaining, total, onHome }) {
  const mins = remainingMinutes(remaining);
  const low = timeRingFraction(remaining, total) <= 0.2;
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, padding: "18px clamp(20px,4vw,64px)", background: "rgba(255,255,255,.72)", backdropFilter: "blur(14px) saturate(1.4)", borderBottom: "1px solid rgba(42,32,24,.06)" }}>
      <Logo onClick={onHome} />
      <NavTabs tab={tab} setTab={setTab} />
      <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 150, justifyContent: "flex-end" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 8px 8px 18px", borderRadius: 999, background: low ? "#FCEAE2" : "rgba(255,255,255,.7)", boxShadow: "0 3px 10px rgba(60,38,20,.08)", transition: "all .3s ease" }}>
          <div style={{ textAlign: "right", lineHeight: 1.1 }}>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: ".08em", color: "#A89684" }}>{low ? "ALMOST DONE" : "PLAY TIME LEFT"}</div>
            <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 18, color: low ? "#E0673C" : "#2A2018" }}>{mins} min</div>
          </div>
          <TimeRing remaining={remaining} total={total} size={56} />
        </div>
      </div>
    </header>
  );
}
