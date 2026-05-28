import React, { useState } from "react";
import Glyph from "./Glyph.jsx";
import { resolveCategory } from "../../config/categories.js";
import { tint } from "../../theme/colors.js";

// Tries the real YouTube thumbnail; on error (or when no id is known) it shows
// a calm category-colored poster. The fallback is on-brand: 212 = no clickbait
// thumbnails.
export default function PosterThumbnail({ video, rounded = 22 }) {
  const cat = resolveCategory(video.category);
  const [failed, setFailed] = useState(false);
  const showReal = Boolean(video.id) && !failed;

  return (
    <div style={{ position: "absolute", inset: 0, borderRadius: rounded, overflow: "hidden", background: cat.soft }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(120% 110% at 18% 0%, ${tint(cat.color, 0.16)} 0%, ${cat.soft} 58%, ${tint(cat.color, 0.08)} 100%)`,
        }}
      />
      <div style={{ position: "absolute", right: -14, bottom: -18, color: cat.color, opacity: 0.22 }}>
        <Glyph kind={cat.glyph} size={130} stroke={1.6} />
      </div>
      <div style={{ position: "absolute", left: 18, top: 16, color: cat.color, opacity: 0.9 }}>
        <Glyph kind={cat.glyph} size={26} stroke={2.6} />
      </div>
      {showReal && (
        <img
          src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
          alt=""
          onError={() => setFailed(true)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
    </div>
  );
}
