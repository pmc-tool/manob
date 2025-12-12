"use client";

import { useMobile } from "@/hooks/use-mobile";
import type * as Monaco from "monaco-editor";
import dynamic from "next/dynamic";
import { useRef } from "react";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then((m) => m.default),
  { ssr: false }
);

type Props = {
  value: string;
  language?: string;
  onChange?: (v?: string) => void;
};

export function Editor({ value, language = "plaintext", onChange }: Props) {
  const isMobile = useMobile();
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (
    editor: Monaco.editor.IStandaloneCodeEditor,
    monaco: typeof Monaco
  ) => {
    editorRef.current = editor;

    // Custom GitHub-like highlight
    monaco.editor.defineTheme("customVS", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#f8f4f3",
        "editor.lineHighlightBackground": "#ebe4e2",
        "editor.lineHighlightBorder": "#ebe4e2",

        "editorGutter.background": "#ebe4e2",
      },
    });

    monaco.editor.setTheme("customVS");
  };

  return (
    <div className="w-full overflow-hidden flex flex-col h-full">
      <MonacoEditor
        height="100%"
        language={language}
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        theme="customVS"
        options={{
          minimap: { enabled: false },
          fontSize: isMobile ? 13 : 14,
          // fontFamily: "var(--font-dm-sans)",
          automaticLayout: true,
          wordWrap: "off",
          folding: true,
          lineNumbers: "on",
          // scrollbar: { vertical: "auto" },
          roundedSelection: false,
          renderLineHighlight: "all",

          scrollBeyondLastLine: false,
          overviewRulerBorder: false,

          renderValidationDecorations: "off",

          contextmenu: false,
          padding: { top: 8, bottom: 8 },

          tabSize: 2,

          suggestFontSize: isMobile ? 13 : 14,
          suggestLineHeight: isMobile ? 20 : 22,

          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
            verticalScrollbarSize: 12, // width of vertical scrollbar
            horizontalScrollbarSize: 12, // height of horizontal scrollbar
            verticalSliderSize: 8, // slider thickness
            horizontalSliderSize: 8,
            arrowSize: 11,
            handleMouseWheel: true,
          },
        }}
      />
    </div>
  );
}
