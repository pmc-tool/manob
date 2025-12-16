"use client";
import { ClearOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { SplinePointer, TriangleAlert } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  srcDoc: string;
  designMode: boolean;
  setDesignMode: (v: boolean) => void;
  onFrameReady: (iframe: HTMLIFrameElement | null) => void;
  onElementSelect: (el: HTMLElement | null) => void;
  onSnapshot: (html: string) => void;
};

const PreviewFrame: React.FC<Props> = ({
  srcDoc,
  designMode,
  setDesignMode,
  onFrameReady,
  onElementSelect,
  onSnapshot,
}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [selectedEl, setSelectedEl] = useState<HTMLElement | null>(null);

  // -----------------------------
  // Update tooltip position continuously
  // -----------------------------
  useEffect(() => {
    let animationFrameId: number;

    const updateTooltipPosition = () => {
      if (!selectedEl || !tooltipRef.current) return;

      const rect = selectedEl.getBoundingClientRect();

      tooltipRef.current.style.top = `${rect.top + window.scrollY - 24}px`; // 24px above
      tooltipRef.current.style.left = `${rect.left + window.scrollX}px`;
      tooltipRef.current.style.display = "block";

      // <<< Add this line to show tag name
      tooltipRef.current.textContent = selectedEl.tagName.toLowerCase();

      animationFrameId = requestAnimationFrame(updateTooltipPosition);
    };

    if (selectedEl) {
      updateTooltipPosition();
    } else if (tooltipRef.current) {
      tooltipRef.current.style.display = "none";
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedEl]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
      const doc = iframe.contentDocument!;
      if (!doc) return;

      let lastHoverEl: HTMLElement | null = null;

      // -----------------------------
      // CLICK = SELECT ONLY THIS ELEMENT
      // -----------------------------
      const clickHandler = (e: MouseEvent) => {
        if (!designMode) return;
        e.preventDefault();
        e.stopPropagation();

        const el = e.target as HTMLElement;
        if (!el) return;

        // Remove previous selection
        doc.querySelectorAll("*").forEach((n) => {
          (n as HTMLElement).style.outline = "";
        });

        // Set new selection
        setSelectedEl(el);
        el.style.outline = "2px solid orange";
        onElementSelect(el);
      };

      // -----------------------------
      // DOUBLE CLICK = EDIT TEXT
      // -----------------------------
      const dblHandler = (e: MouseEvent) => {
        if (!designMode) return;
        e.preventDefault();
        e.stopPropagation();

        const el = e.target as HTMLElement;
        if (!el) return;

        el.setAttribute(
          "data-prev-editable",
          (el as any).contentEditable ?? "false"
        );
        (el as any).contentEditable = "true";
        el.focus();

        const blur = () => {
          (el as any).contentEditable =
            el.getAttribute("data-prev-editable") ?? "false";
          el.removeAttribute("data-prev-editable");
          onElementSelect(el);
          el.removeEventListener("blur", blur);
        };

        el.addEventListener("blur", blur);
      };

      // -----------------------------
      // HOVER (BLUE OUTLINE) - TEMPORARY
      // -----------------------------
      const mouseOverHandler = (e: MouseEvent) => {
        if (!designMode) return;
        const el = e.target as HTMLElement;
        if (!el) return;
        if (el === selectedEl) return;

        if (lastHoverEl && lastHoverEl !== selectedEl) {
          lastHoverEl.style.outline = "";
        }

        el.style.outline = "2px solid blue";
        lastHoverEl = el;
      };

      const mouseOutHandler = (e: MouseEvent) => {
        if (!designMode) return;
        const el = e.target as HTMLElement;
        if (!el) return;
        if (el === selectedEl) return;

        if (el.style.outline === "2px solid blue") {
          el.style.outline = "";
        }
      };

      // -----------------------------
      // ATTACH EVENTS
      // -----------------------------
      doc.addEventListener("click", clickHandler, true);
      doc.addEventListener("dblclick", dblHandler, true);
      doc.addEventListener("mouseover", mouseOverHandler, true);
      doc.addEventListener("mouseout", mouseOutHandler, true);

      (iframe as any).__clickHandler = clickHandler;
      (iframe as any).__dblHandler = dblHandler;
      (iframe as any).__hoverOverHandler = mouseOverHandler;
      (iframe as any).__hoverOutHandler = mouseOutHandler;

      onFrameReady(iframe);
    };

    iframe.addEventListener("load", onLoad);
    if (iframe.contentDocument?.readyState === "complete") onLoad();

    return () => {
      try {
        const doc = iframe.contentDocument!;
        const ch = (iframe as any).__clickHandler;
        const dh = (iframe as any).__dblHandler;
        const hh = (iframe as any).__hoverOverHandler;
        const hho = (iframe as any).__hoverOutHandler;

        if (ch) doc.removeEventListener("click", ch, true);
        if (dh) doc.removeEventListener("dblclick", dh, true);
        if (hh) doc.removeEventListener("mouseover", hh, true);
        if (hho) doc.removeEventListener("mouseout", hho, true);
      } catch {}
      iframe.removeEventListener("load", onLoad);
    };
  }, [designMode, onElementSelect, selectedEl]);

  // -----------------------------
  // CLEAR SELECTION
  // -----------------------------
  const clearSelection = () => {
    try {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;

      doc.querySelectorAll("*").forEach((n) => {
        (n as HTMLElement).style.outline = "";
      });

      setSelectedEl(null);
      if (tooltipRef.current) tooltipRef.current.style.display = "none";
      onElementSelect(null);
    } catch {}
  };

  return (
    <div className="relative h-full">
      <iframe
        ref={iframeRef}
        title="Preview"
        srcDoc={srcDoc}
        style={{
          width: "100%",
          height: "calc(100vh - 120px)",
        }}
      />
      {/* Tooltip for selected element */}

      <div
        ref={tooltipRef}
        className="hidden absolute bg-orange-500 text-white px-2 py-1 rounded text-xs pointer-events-none z-9999"
      ></div>

      <div className="absolute w-[350px] left-1/2 -translate-x-1/2 bottom-18 bg-white rounded-mdxl shadow-[0px_0px_1px_rgba(0,0,0,0.18),_0px_3px_8px_rgba(0,0,0,0.1),_0px_1px_3px_rgba(0,0,0,0.1)] py-2 px-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[14px]">
          <TriangleAlert size={16} />
          <div className="flex-1">Unsaved Changes</div>
        </div>
        <div className="flex gap-1.5">
          <Button
            shape="round"
            onClick={() => {
              const doc = iframeRef.current?.contentDocument;
              if (doc) {
                onSnapshot(srcDoc);
              }
            }}
          >
            Discard
          </Button>
          <Button
            shape="round"
            type="primary"
            onClick={() => {
              const doc = iframeRef.current?.contentDocument;
              if (doc) {
                onSnapshot(doc.documentElement.outerHTML);
              }
            }}
          >
            Save
          </Button>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 bottom-3 bg-white rounded-mdxl shadow-[0px_0px_1px_rgba(0,0,0,0.18),_0px_3px_8px_rgba(0,0,0,0.1),_0px_1px_3px_rgba(0,0,0,0.1)] py-2 px-3 flex items-center gap-2">
        <Space>
          {/* Replace Switch with a button */}
          <Button
            type={designMode ? "primary" : "default"}
            onClick={() => {
              // Toggle mode
              const newMode = !designMode;
              setDesignMode(newMode);

              // Clear selection when turning OFF design mode
              if (!newMode) {
                clearSelection();
              }
            }}
          >
            <SplinePointer />
            {designMode ? "Visual Edits: ON" : "Visual Edits: OFF"}
          </Button>

          <Button icon={<ClearOutlined />} onClick={clearSelection} />
        </Space>
      </div>
    </div>
  );
};

export default PreviewFrame;
