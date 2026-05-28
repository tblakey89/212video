export const INK = "#2A2018";
export const MUTED_INK = "#8A7A6A";
export const FAINT_INK = "#A89684";
export const SURFACE = "#FFFFFF";
export const CREAM = "#FBF3E7";
export const PRIMARY = "#F2683C";
export const PRIMARY_DEEP = "#E0673C";

export function tint(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const mix = (c) => Math.round(c + (255 - c) * amt);
  return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
}

export function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const mix = (c) => Math.round(c * (1 - amt));
  return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
}
