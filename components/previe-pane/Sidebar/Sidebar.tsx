"use client";
import { SplinePointer } from "lucide-react";
import React from "react";
import BordersPanel from "./panels/BordersPanel";
import ColorsPanel from "./panels/ColorsPanel";
import ContentPanel from "./panels/ContentPanel";
import ImagePanel from "./panels/ImagePanel";
import LayoutPanel from "./panels/LayoutPanel";
import LinkPanel from "./panels/LinkPanel";
import SpacingPanel from "./panels/SpacingPanel";
import TypographyPanel from "./panels/TypographyPanel";

type Props = {
  editor: any;
  inspector: any;
};

const TYPO_TAGS = [
  "p",
  "span",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "strong",
  "em",
  "label",
  "small",
  "li",
  "blockquote",
];

const Sidebar: React.FC<Props> = ({ editor, inspector }) => {
  const hasSelection = !!editor.selectedSummary;
  // detect if selected element is an <img>
  const isImage = editor.selectedSummary?.startsWith("img —");
  const isLink = editor.selectedSummary?.startsWith("a —");

  const isTypography = editor.selectedSummary
    ? TYPO_TAGS.some((tag) => editor.selectedSummary.startsWith(`${tag} —`))
    : false;

  return (
    <aside className="w-[380px] min-w-[340px] max-w-[480px] h-full bg-white border-l border-[#eee] p-4 overflow-auto flex flex-col">
      {!hasSelection && (
        <div className="flex flex-1 flex-col items-center justify-center">
          <SplinePointer size={46} strokeWidth={1} className="text-gray-400" />
          <div className="font-semibold mt-2 text-xl">Visual edits</div>
          <div className="text-[14px]">Select an element to edit it</div>
          <div className="text-[13px] mt-4 text-gray-400">
            Hold Ctrl to select multiple elements
          </div>
        </div>
      )}

      {/* {hasSelection && (
        <>
          <div className="mb-3">
            <div className="text-[14px] font-semibold mb-2">
              Selected element
            </div>
            <div className="font-semibold mt-1.5">{editor.selectedSummary}</div>
          </div>

          <ContentPanel editor={editor} inspector={inspector} />
          <TypographyPanel editor={editor} inspector={inspector} />
          <ColorsPanel editor={editor} inspector={inspector} />
          <LayoutPanel editor={editor} inspector={inspector} />
          <SpacingPanel editor={editor} inspector={inspector} />
          <BordersPanel editor={editor} inspector={inspector} />
          <ImagePanel editor={editor} inspector={inspector} />
          <LinkPanel editor={editor} inspector={inspector} />
        </>
      )} */}

      {hasSelection && (
        <>
          <div className="mb-3">
            <div className="text-[14px] font-semibold mb-2">
              Selected element
            </div>
            <div className="font-semibold mt-1.5">{editor.selectedSummary}</div>
          </div>

          {isTypography && (
            <>
              <ContentPanel editor={editor} inspector={inspector} />
              <TypographyPanel editor={editor} inspector={inspector} />
              <SpacingPanel editor={editor} inspector={inspector} />
              <BordersPanel editor={editor} inspector={inspector} />
            </>
          )}

          {isImage && (
            <>
              <ImagePanel editor={editor} inspector={inspector} />
              <BordersPanel editor={editor} inspector={inspector} />
            </>
          )}

          {!isTypography && !isImage && !isLink && (
            <>
              <TypographyPanel editor={editor} inspector={inspector} />
              <ColorsPanel editor={editor} inspector={inspector} />
              <LayoutPanel editor={editor} inspector={inspector} />
              <SpacingPanel editor={editor} inspector={inspector} />
              <BordersPanel editor={editor} inspector={inspector} />
            </>
          )}

          {isLink && (
            <>
              <ContentPanel editor={editor} inspector={inspector} />
              <TypographyPanel editor={editor} inspector={inspector} />
              <LinkPanel editor={editor} inspector={inspector} />
              <LayoutPanel editor={editor} inspector={inspector} />
              <SpacingPanel editor={editor} inspector={inspector} />
            </>
          )}
        </>
      )}
    </aside>
  );
};

export default Sidebar;
