// components/PreviewPane/utils.ts
export const rgbToHexLocal = (rgb: string) => {
  if (!rgb) return "";
  rgb = rgb.trim();
  if (rgb.startsWith("#")) return rgb;
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!m) return "";
  const r = parseInt(m[1], 10);
  const g = parseInt(m[2], 10);
  const b = parseInt(m[3], 10);
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const h = x.toString(16);
        return h.length === 1 ? "0" + h : h;
      })
      .join("")
  );
};
