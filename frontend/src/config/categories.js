// Operator-curated category metadata. Each channel/playlist carries a
// `category` key (set in backend/data/*.json); the color lets pre-readers
// navigate by sight and the glyph drives the poster fallback art.
export const CATEGORIES = {
  making: { label: "Making", color: "#F2683C", soft: "#FFE3D6", glyph: "spark" },
  science: { label: "Science", color: "#1C9B8E", soft: "#D2EEEA", glyph: "atom" },
  chess: { label: "Chess", color: "#4D6FE0", soft: "#DCE3FB", glyph: "knight" },
  pokemon: { label: "Pokémon", color: "#D6478C", soft: "#FBD9E8", glyph: "ball" },
  building: { label: "Building", color: "#E8A12A", soft: "#FBEAC6", glyph: "brick" },
  history: { label: "History", color: "#8E5BC9", soft: "#EADCF7", glyph: "scroll" },
  gaming: { label: "Gaming", color: "#3AA76A", soft: "#D6EEDE", glyph: "pad" },
};

const FALLBACK = "science";

export function resolveCategory(key) {
  return CATEGORIES[key] || CATEGORIES[FALLBACK];
}
