"use client";
export const loadGoogleFontToDocument = (font: string) => {
  if (!font) return;

  const clean = font.replace(/['"]/g, "").trim();
  const id = `google-font-preview-${clean.replace(/\s+/g, "-")}`;

  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${clean.replace(
    /\s+/g,
    "+"
  )}&display=swap`;

  document.head.appendChild(link);
};
