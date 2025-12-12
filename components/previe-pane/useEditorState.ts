// components/PreviewPane/useEditorState.ts
import { useRef, useState } from "react";

export type BoxSides = { top: string; right: string; bottom: string; left: string };

export function useEditorState(initialSrc: string) {
  const [srcDoc, setSrcDoc] = useState(initialSrc);
  const [designMode, setDesignMode] = useState(false);
  const frameRef = useRef<HTMLIFrameElement | null>(null);

  // grouped UI states
  const [contentHTML, setContentHTML] = useState("");
  const [typography, setTypography] = useState({
    fontSize: "",
    fontWeight: "",
    lineHeight: "",
    color: "",
    fontFamily: "",
  });
  const [colors, setColors] = useState({ background: "", borderColor: "" });
  const [layout, setLayout] = useState({
    display: "",
    width: "",
    height: "",
    textAlign: "",
    justifyContent: "",
    alignItems: "",
  });
  const [margin, setMargin] = useState<BoxSides>({ top: "", right: "", bottom: "", left: "" });
  const [padding, setPadding] = useState<BoxSides>({ top: "", right: "", bottom: "", left: "" });
  const [borders, setBorders] = useState({ width: "", style: "", radius: "" });
  const [imgProps, setImgProps] = useState({ src: "", width: "", height: "", alt: "" });
  const [linkProps, setLinkProps] = useState({ href: "", targetBlank: false });

  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);

  return {
    srcDoc,
    setSrcDoc,
    designMode,
    setDesignMode,
    frameRef,
    setFrameRef: (el: HTMLIFrameElement | null) => (frameRef.current = el),

    contentHTML,
    setContentHTML,
    typography,
    setTypography,
    colors,
    setColors,
    layout,
    setLayout,
    margin,
    setMargin,
    padding,
    setPadding,
    borders,
    setBorders,
    imgProps,
    setImgProps,
    linkProps,
    setLinkProps,

    selectedSummary,
    setSelectedSummary,
  };
}
