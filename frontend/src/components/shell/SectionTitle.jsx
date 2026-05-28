import React from "react";

export default function SectionTitle({ children, sub, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, margin: "8px 2px 14px", flexWrap: "wrap" }}>
      <div style={{ minWidth: 0 }}>
        <h2 style={{ margin: 0, fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: "clamp(24px,3vw,32px)", color: "#2A2018", letterSpacing: "-.01em", lineHeight: 1.1 }}>
          {children}
        </h2>
        {sub && (
          <p style={{ margin: "4px 0 0", fontFamily: "Nunito, sans-serif", fontSize: 16, color: "#8A7A6A", fontWeight: 600 }}>
            {sub}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
