"use client";
import { useRef } from "react";
import type { useEditorState as UE } from "./useEditorState";
import { rgbToHexLocal } from "./utils/utils";

type EditorState = ReturnType<typeof UE>;

/** Ensure a value is a valid CSS pixel number */
function sanitize(value: string | number): number {
  const n = typeof value === "number" ? value : parseInt(String(value).replace(/px/g, ""), 10);
  return isNaN(n) ? 0 : n;
}

export function useElementInspector(editor: EditorState) {
  const selectedElRef = useRef<HTMLElement | null>(null);

  /** Compute a unique selector path for the element */
  const computePath = (el: Element | null) => {
    if (!el) return "";
    const parts: string[] = [];
    let node: Element | null = el;
    while (node && node.tagName.toLowerCase() !== "html") {
      let part = node.tagName.toLowerCase();
      const id = (node as HTMLElement).id;
      if (id) part += `#${id}`;
      else if (node.classList.length) part += "." + Array.from(node.classList).join(".");
      parts.unshift(part);
      node = node.parentElement;
    }
    return parts.join(" > ");
  };

  /** Apply CSS styles to the selected element */
  const applyStyles = (styles: Partial<CSSStyleDeclaration>) => {
    const el = selectedElRef.current;
    if (!el) return;
    Object.entries(styles).forEach(([key, value]) => {
      (el.style as any)[key] = value ?? "";
    });
  };

  /** Detect and set all relevant properties of the selected element */
  const detectRelevantGroups = (el: HTMLElement | null) => {
    if (!el) {
      editor.setContentHTML("");
      editor.setTypography({ fontSize: "", fontWeight: "", lineHeight: "", color: "", fontFamily: "" });
      editor.setColors({ background: "", borderColor: "" });
      editor.setLayout({ display: "", flexDirection: "", justifyContent: "", alignItems: "", width: "", height: "", gridTemplateColumns: "", gridTemplateRows: "", gap: "" });
      editor.setMargin({ top: "", right: "", bottom: "", left: "" });
      editor.setPadding({ top: "", right: "", bottom: "", left: "" });
      editor.setBorders({ width: "", style: "", radius: "" });
      editor.setImgProps({ src: "", width: "", height: "", alt: "" });
      editor.setLinkProps({ href: "", targetBlank: false });
      editor.setSelectedSummary(null);
      return;
    }

    const cs = editor.frameRef.current?.contentWindow?.getComputedStyle(el);

    editor.setContentHTML(el.innerHTML);

    // Typography
    editor.setTypography({
      fontSize: cs?.getPropertyValue("font-size") ?? "",
      fontWeight: cs?.getPropertyValue("font-weight") ?? "",
      lineHeight: cs?.getPropertyValue("line-height") ?? "",
      color: rgbToHexLocal(cs?.getPropertyValue("color") ?? "") || "",
      fontFamily: cs?.getPropertyValue("font-family") ?? "",
    });

    // Colors
    editor.setColors({
      background: rgbToHexLocal(cs?.getPropertyValue("background-color") ?? "") || "",
      borderColor: rgbToHexLocal(cs?.getPropertyValue("border-color") ?? "") || "",
    });

    // Layout
    editor.setLayout({
      display: cs?.getPropertyValue("display") ?? "",
      flexDirection: cs?.getPropertyValue("flex-direction") ?? "",
      justifyContent: cs?.getPropertyValue("justify-content") ?? "",
      alignItems: cs?.getPropertyValue("align-items") ?? "",
      width: cs?.getPropertyValue("width") ?? "",
      height: cs?.getPropertyValue("height") ?? "",
      gridTemplateColumns: cs?.getPropertyValue("grid-template-columns") ?? "",
      gridTemplateRows: cs?.getPropertyValue("grid-template-rows") ?? "",
      gap: cs?.getPropertyValue("gap") ?? "",
    });

    // Margin & Padding
    editor.setMargin({
      top: cs?.getPropertyValue("margin-top") ?? "",
      right: cs?.getPropertyValue("margin-right") ?? "",
      bottom: cs?.getPropertyValue("margin-bottom") ?? "",
      left: cs?.getPropertyValue("margin-left") ?? "",
    });
    editor.setPadding({
      top: cs?.getPropertyValue("padding-top") ?? "",
      right: cs?.getPropertyValue("padding-right") ?? "",
      bottom: cs?.getPropertyValue("padding-bottom") ?? "",
      left: cs?.getPropertyValue("padding-left") ?? "",
    });

    // Borders
    editor.setBorders({
      width: cs?.getPropertyValue("border-width") ?? "",
      style: cs?.getPropertyValue("border-style") ?? "",
      radius: cs?.getPropertyValue("border-radius") ?? "",
    });

    // Image properties
    if (el.tagName.toLowerCase() === "img") {
      const img = el as HTMLImageElement;
      const cs = editor.frameRef.current?.contentWindow?.getComputedStyle(img);

      editor.setImgProps({
        src: img.src || "",
        width: cs?.getPropertyValue("width") ?? "",
        height: cs?.getPropertyValue("height") ?? "",
        alt: img.alt || "",
        objectFit: cs?.getPropertyValue("object-fit") || "contain",
      });
    } else {
      editor.setImgProps({ src: "", width: "", height: "", alt: "", objectFit: "" });
    }

    // Link properties
    const link = el.tagName.toLowerCase() === "a" ? (el as HTMLAnchorElement) : el.closest("a");
    editor.setLinkProps({ href: link?.getAttribute("href") ?? "", targetBlank: link?.getAttribute("target") === "_blank" });

    editor.setSelectedSummary(`${el.tagName.toLowerCase()} — ${computePath(el)}`);
  };

  /** Select element in iframe */
  const selectElementInFrame = (el: HTMLElement | null) => {
    selectedElRef.current = el;
    detectRelevantGroups(el);
  };

  /** General update helper: updates editor state + element styles */
  const updateStyles = (updates: Partial<CSSStyleDeclaration>, layoutOnly = false) => {
    const el = selectedElRef.current;
    if (!el) return;

    if (!layoutOnly) detectRelevantGroups(el); // refresh editor state for other panels

    applyStyles(updates);

    // Update layout state if relevant
    const layoutKeys = ["display", "flexDirection", "justifyContent", "alignItems", "gridTemplateColumns", "gridTemplateRows", "gap", "width", "height"];
    const newLayout = { ...editor.layout };
    for (const key of layoutKeys) {
      if (updates[key as keyof CSSStyleDeclaration] !== undefined) {
        (newLayout as any)[key] = updates[key as keyof CSSStyleDeclaration];
      }
    }
    editor.setLayout(newLayout);
  };

  /** ---------------- CONTENT ---------------- */
  const setContentOfSelected = (content: string) => {
    const el = selectedElRef.current;
    if (!el) return;
    el.innerHTML = content;
    detectRelevantGroups(el);
  }


  /** ---------------- MARGIN / PADDING ---------------- */
  const updateMarginVertical = (v: string | number) => {
    const px = `${sanitize(v)}px`;
    editor.setMargin({ ...editor.margin, top: px, bottom: px });
    updateStyles({ marginTop: px, marginBottom: px }, true);
  };
  const updateMarginHorizontal = (v: string | number) => {
    const px = `${sanitize(v)}px`;
    editor.setMargin({ ...editor.margin, left: px, right: px });
    updateStyles({ marginLeft: px, marginRight: px }, true);
  };
  const updatePaddingVertical = (v: string | number) => {
    const px = `${sanitize(v)}px`;
    editor.setPadding({ ...editor.padding, top: px, bottom: px });
    updateStyles({ paddingTop: px, paddingBottom: px }, true);
  };
  const updatePaddingHorizontal = (v: string | number) => {
    const px = `${sanitize(v)}px`;
    editor.setPadding({ ...editor.padding, left: px, right: px });
    updateStyles({ paddingLeft: px, paddingRight: px }, true);
  };


  /** ---------------- BORDER ---------------- */


  const setBorders = (borders: { width?: string; style?: string; radius?: string }) => {
    const newBorders = { ...editor.borders, ...borders };
    editor.setBorders(newBorders);
    updateStyles({
      borderWidth: borders.width,
      borderStyle: borders.style,
      borderRadius: borders.radius,
    }, true);
  };




  /** ---------------- TYPOGRAPHY ---------------- */
  const setTypography = (typography: Partial<CSSStyleDeclaration>) => updateStyles(typography);


  /** ---------------- IMAGE ---------------- */
  const setImgProps = (imgProps: {
    src?: string;
    width?: string;
    height?: string;
    alt?: string;
    objectFit?: string;
  }) => {
    const el = selectedElRef.current as HTMLImageElement | null;
    if (!el || el.tagName.toLowerCase() !== "img") return;

    if (imgProps.src !== undefined) el.src = imgProps.src;
    if (imgProps.width !== undefined) el.style.width = imgProps.width;
    if (imgProps.height !== undefined) el.style.height = imgProps.height;
    if (imgProps.alt !== undefined) el.alt = imgProps.alt;
    if (imgProps.objectFit !== undefined) el.style.objectFit = imgProps.objectFit;

    detectRelevantGroups(el);
  };



  /** ---------------- LINK ---------------- */
  const setLinkProps = (linkProps: { href?: string; targetBlank?: boolean }) => {
    const el = selectedElRef.current;
    if (!el) return;
    let linkEl: HTMLAnchorElement | null = null;
    if (el.tagName.toLowerCase() === "a") {
      linkEl = el as HTMLAnchorElement;
    } else {
      linkEl = el.closest("a");
    }
    if (!linkEl) return;

    if (linkProps.href !== undefined) linkEl.setAttribute("href", linkProps.href);
    if (linkProps.targetBlank !== undefined) {
      if (linkProps.targetBlank) {
        linkEl.setAttribute("target", "_blank");
      } else {
        linkEl.removeAttribute("target");
      }
    }

    detectRelevantGroups(el);
  };

  return {
    selectElementInFrame,
    getSelected: () => selectedElRef.current,
    updateStyles,
    setContentOfSelected,
    setBorders,
    setTypography,
    updateMarginVertical,
    updateMarginHorizontal,
    updatePaddingVertical,
    updatePaddingHorizontal,
    setImgProps,
    setLinkProps,
  };
}
