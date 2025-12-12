"use client";

import { detectLanguage } from "@/app/utils/detectLanguage";
import { Editor } from "./Editor";
import { FileExplorer } from "./FileExplorer";
import { Toolbar } from "./Toolbar";
import { TopTabs } from "./TopTabs";

type File = {
  path: string;
  name: string;
  content: string;
};

type CodePaneProps = {
  sidebarWidth: number;
  onMouseDownHandle: (e: React.MouseEvent) => void;
  files: File[];
  openTabs: string[];
  active: string;
  setActive: (p: string) => void;
  openFile: (p: string) => void;
  closeTab: (p: string) => void;
  updateContent: (v: string) => void;
};

export const CodePane = ({
  sidebarWidth,
  onMouseDownHandle,
  files,
  openTabs,
  active,
  setActive,
  openFile,
  closeTab,
  updateContent,
}: CodePaneProps) => {
  const activeFile = files.find((f) => f.path === active) ?? files[0];

  const language = detectLanguage(activeFile?.name);

  return (
    <div className="flex h-[calc(100vh-118px)]">
      {/* Sidebar */}
      <aside
        className="h-full bg-gray-100"
        style={{ width: sidebarWidth }}
      >
        <FileExplorer onOpen={openFile} activePath={active} />
      </aside>

      {/* Resize handle */}
      <div
        role="separator"
        tabIndex={-1}
        aria-orientation="vertical"
        onMouseDown={onMouseDownHandle}
        className="group relative z-20 hidden sm:flex cursor-col-resize items-center justify-center"
      >
        <div
          className="absolute h-[80%] w-[1.5px] rounded-full opacity-0 group-hover:opacity-100 
                      bg-linear-to-b from-transparent via-[#ea2725] to-transparent 
                      scale-y-0 group-hover:scale-y-100 transition-all duration-300"
        />
        <div className="absolute inset-y-0 w-6" />
        <div
          className="absolute h-full max-h-9 w-1.5 rounded-full opacity-0 group-hover:opacity-100 
                      bg-[#ea2725] scale-[0.75] group-hover:scale-100 transition-all duration-100"
        />
      </div>

      {/* Main content */}
      <section className="flex-1 flex flex-col min-w-0">
        <TopTabs
          tabs={openTabs.map((p) => {
            const f = files.find((x) => x.path === p);
            return { path: p, name: f?.name ?? p.split("/").pop() ?? p };
          })}
          active={active}
          onSelect={(p) => setActive(p)}
          onClose={closeTab}
        />

        <Toolbar
          onCopy={() => {
            navigator.clipboard.writeText(activeFile?.content ?? "");
            alert("Copied!");
          }}
          onDownload={() => {
            const code = activeFile?.content ?? "";
            const blob = new Blob([code], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = activeFile?.name ?? "file.txt";
            a.click();
            URL.revokeObjectURL(url);
          }}
        />

        <Editor
          value={activeFile?.content ?? ""}
          language={language}
          onChange={(v) => updateContent(v ?? "")}
        />
      </section>
    </div>
  );
};
