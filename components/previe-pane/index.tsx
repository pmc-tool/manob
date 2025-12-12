// components/PreviewPane/index.tsx
"use client";

import React from "react";
import PreviewFrame from "./PreviewFrame";
import Sidebar from "./Sidebar/Sidebar";
import { useEditorState } from "./useEditorState";
import { useElementInspector } from "./useElementInspector";
import { initialIframeContent } from "./initialIframeContent";
export type DeviceType = "Desktop" | "Tablet" | "Phone";

export const PreviewPane: React.FC<{ device?: DeviceType }> = ({
  device = "Desktop",
}) => {
  const editor = useEditorState(initialIframeContent);
  const inspector = useElementInspector(editor);

  return (
    <div className="w-full h-[calc(100vh-118px)] flex bg-gray-100 relative">
      <div className="flex-1 h-full flex justify-center items-start">
        <div
          style={{
            width:
              device === "Phone" ? 375 : device === "Tablet" ? 768 : "100%",
            height: "100%",
            position: "relative",
          }}
        >
          <PreviewFrame
            srcDoc={editor.srcDoc}
            designMode={editor.designMode}
            setDesignMode={editor.setDesignMode}
            onFrameReady={(frame) => editor.setFrameRef(frame)}
            onElementSelect={(el) => inspector.selectElementInFrame(el)}
            onSnapshot={(html) => editor.setSrcDoc(html)}
          />
        </div>
      </div>

      {editor.designMode && <Sidebar editor={editor} inspector={inspector} />}
    </div>
  );
};

export default PreviewPane;
