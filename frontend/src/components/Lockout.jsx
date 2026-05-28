import React from "react";
import Pip from "./primitives/Pip.jsx";
import SceneArt from "./SceneArt.jsx";
import { formatHour } from "../utils/format.js";

// Full-screen, non-dismissible takeovers. Calm and final, never an error — a
// child should understand "not now, come back later" and not be able to argue.
function scenes(startHour) {
  const open = formatHour(startHour);
  return {
    timeup: {
      bg: "linear-gradient(180deg,#FFE9C7 0%,#FFD7B0 55%,#FFC79A 100%)",
      mood: "wave", color: "#F2683C",
      title: "That's all for today!",
      body: "You've watched all your play time. Come back tomorrow for more.",
      foot: `See you at ${open} tomorrow`,
      art: "sun",
    },
    early: {
      bg: "linear-gradient(180deg,#DCEAF7 0%,#C9DDF2 50%,#FBE3C9 100%)",
      mood: "yawn", color: "#4D6FE0",
      title: "It's a little early!",
      body: `212 wakes up at ${open}. Have some breakfast and come back soon.`,
      foot: `Opens at ${open}`,
      art: "dawn",
    },
    late: {
      bg: "linear-gradient(180deg,#2B2350 0%,#3A2F5E 50%,#5A4A6E 100%)",
      mood: "sleepy", color: "#8E5BC9",
      title: "Time for bed!",
      body: "212 is asleep for the night. Sweet dreams — see you in the morning.",
      foot: `Opens at ${open} tomorrow`,
      art: "night", dark: true,
    },
  };
}

export default function Lockout({ kind, settings }) {
  const s = scenes(settings.startHour)[kind];
  const dark = s.dark;
  const ink = dark ? "#fff" : "#2A2018";
  const sub = dark ? "rgba(255,255,255,.72)" : "rgba(42,32,24,.6)";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, background: s.bg, display: "grid", placeItems: "center", overflow: "hidden", textAlign: "center" }}>
      <SceneArt art={s.art} />
      <div style={{ position: "relative", zIndex: 2, padding: 30, maxWidth: 640 }}>
        <div style={{ display: "inline-block", filter: "drop-shadow(0 14px 24px rgba(0,0,0,.18))" }}>
          <Pip size={150} mood={s.mood} color={s.color} bob={kind !== "late"} />
        </div>
        <h1 style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: "clamp(36px,5vw,56px)", color: ink, margin: "20px 0 10px", letterSpacing: "-.02em" }}>{s.title}</h1>
        <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600, fontSize: "clamp(18px,2.2vw,23px)", color: sub, lineHeight: 1.45, margin: "0 auto 28px", maxWidth: 480 }}>{s.body}</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: dark ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.65)", color: dark ? "#fff" : "#5a4a3a", fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 19, padding: "13px 26px", borderRadius: 999, boxShadow: dark ? "none" : "0 6px 18px rgba(60,38,20,.12)" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
          {s.foot}
        </div>
      </div>
    </div>
  );
}
