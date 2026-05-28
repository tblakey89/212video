import React from "react";

const OPTIONS = [
  { id: "full", label: "Videos" },
  { id: "shorts", label: "Shorts" },
];

export default function FilterToggle({ value, onChange }) {
  return (
    <div style={{ display: "inline-flex", gap: 6, background: "rgba(42,32,24,.05)", padding: 5, borderRadius: 999 }}>
      {OPTIONS.map((o) => {
        const active = value === o.id;
        return (
          <button key={o.id} onClick={() => onChange(o.id)}
            style={{ border: "none", cursor: "pointer", fontFamily: "'Baloo 2', sans-serif", fontWeight: 600, fontSize: 17, padding: "9px 22px", borderRadius: 999, color: active ? "#2A2018" : "#8A7A6A", background: active ? "#fff" : "transparent", boxShadow: active ? "0 3px 10px rgba(60,38,20,.12)" : "none", transition: "all .2s ease" }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
