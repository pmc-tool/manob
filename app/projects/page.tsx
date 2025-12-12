"use client";
import React, { useEffect, useRef, useState } from "react";
import ChatBot from "./components/ChatBot";
import EditorLayout from "./components/EditorLayout";
import Header from "@/components/header";
import ProjectSidebar from "@/components/sidebar";

export default function Page() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const isResizing = useRef(false);
  const [sidebarWidth, setSidebarWidth] = useState<number>(600);

  // start / stop
  const onMouseDownHandle = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !contentRef.current) return;
      const rect = contentRef.current.getBoundingClientRect();
      // compute width relative to content left
      let newWidth = e.clientX - rect.left;
      if (newWidth < 330) newWidth = 330;
      if (newWidth > 800) newWidth = 800;
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
    <div className="layout">
      <header className="header">
        <Header />
      </header>

      {/* IMPORTANT: include the handle as a column (three columns total) */}
      <div
        className="content px-2 sm:pb-2"
        ref={contentRef}
        style={{ gridTemplateColumns: `${sidebarWidth}px 6px 1fr` }}
      >
        {/* Sidebar column */}
        <aside className="sidebar flex">
          <ProjectSidebar />
          <ChatBot />
        </aside>

        {/* Drag Handle */}
        <div
          role="separator"
          tabIndex={-1}
          aria-orientation="vertical"
          onMouseDown={onMouseDownHandle}
          className="group relative z-20 hidden sm:flex cursor-col-resize items-center justify-center outline-none"
          data-testid="block-resize-handle"
        >
          <div
            className="absolute h-[80%] w-[1.5px] rounded-full opacity-0 group-hover:opacity-100
                              bg-linear-to-b from-transparent via-[#ea2725] to-transparent
                              scale-y-0 group-hover:scale-y-100 transition-all duration-300 ease-[cubic-bezier(0.31,0.1,0.08,0.96)]"
          />

          <div className="absolute inset-y-0 w-6" />

          <div
            className="absolute h-full max-h-9 w-1.5 rounded-full opacity-0 group-hover:opacity-100
                              scale-[0.75] group-hover:scale-100 bg-[#ea2725]
                              transition-all duration-100 ease-[cubic-bezier(0.31,0.1,0.08,0.96)]"
          />
        </div>

        {/* Main column */}
        <main className="main border border-gray-200 rounded-2xl overflow-hidden shadow-[0_2px_2px_#0000000a,0_8px_8px_-8px_#0000000a]">
          <EditorLayout />
        </main>
      </div>
    </div>
  );
}
