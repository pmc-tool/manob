"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Eye } from "@geist-ui/icons";
import { useEffect, useRef, useState } from "react";

import { CodePane } from "./CodePane";
import initialFiles from "./initialFiles";

// import PreviewPane from "./PreviewPane";
import PreviewPane from "@/components/previe-pane";
import { PreviewTopBar } from "./PreviewTopBar";

export default function EditorLayout() {
  const [files, setFiles] = useState(initialFiles);
  const [openTabs, setOpenTabs] = useState<string[]>([initialFiles[0].path]);
  const [active, setActive] = useState<string>(initialFiles[0].path);

  // Device selector state
  const [device, setDevice] = useState<"Desktop" | "Tablet" | "Phone">(
    "Desktop"
  );

  // Top tab state
  const [topTab, setTopTab] = useState<"preview" | "code">("preview");

  const openFile = (path: string) => {
    if (!openTabs.includes(path)) setOpenTabs((t) => [...t, path]);
    setActive(path);
  };

  const closeTab = (path: string) => {
    setOpenTabs((tabs) => tabs.filter((t) => t !== path));
    if (active === path) {
      const idx = openTabs.indexOf(path);
      const next = openTabs[idx - 1] ?? openTabs[1] ?? "";
      setActive(next);
    }
  };

  const updateContent = (next: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.path === active ? { ...f, content: next } : f))
    );
  };

  // Sidebar resizing
  const contentRef = useRef<HTMLDivElement | null>(null);
  const isResizing = useRef(false);
  const [sidebarWidth, setSidebarWidth] = useState<number>(400);

  const onMouseDownHandle = () => {
    isResizing.current = true;
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !contentRef.current) return;
      const rect = contentRef.current.getBoundingClientRect();
      let newWidth = e.clientX - rect.left;

      newWidth = Math.max(330, Math.min(newWidth, 800));
      setSidebarWidth(newWidth);
    };

    const onMouseUp = () => {
      isResizing.current = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div ref={contentRef} className="flex flex-col h-full">
      <Tabs
        value={topTab}
        onValueChange={(val) => setTopTab(val as "preview" | "code")}
        className="gap-0! flex-1"
      >
        {/* Top bar */}
        <div className="flex h-12 w-full items-center gap-1 px-2 border-b border-gray-200 bg-white">
          <TabsList>
            <TabsTrigger value="preview">
              <Eye />
            </TabsTrigger>
            <TabsTrigger value="code">
              <Code />
            </TabsTrigger>
          </TabsList>
          {topTab === "preview" && (
            <PreviewTopBar device={device} setDevice={setDevice} />
          )}
        </div>

        {/* Preview tab */}
        <TabsContent value="preview">
          <div className="relative h-full">
            <PreviewPane device={device} />
            {/* <PreviewPaneCopyThree device={device} /> */}
            {/* <div className="bg-white p-3 absolute bottom-4 left-1/2 -translate-x-1/2 border border-gray-200 rounded-2xl overflow-hidden shadow-[0_2px_2px_#0000000a,0_8px_8px_-8px_#0000000a]">
              <Button type="primary" icon={<SendOutlined />}>
                Design
              </Button>
            </div> */}
          </div>
        </TabsContent>

        {/* Code tab */}
        <TabsContent value="code">
          <CodePane
            sidebarWidth={sidebarWidth}
            onMouseDownHandle={onMouseDownHandle}
            files={files}
            openTabs={openTabs}
            active={active}
            setActive={setActive}
            openFile={openFile}
            closeTab={closeTab}
            updateContent={updateContent}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
