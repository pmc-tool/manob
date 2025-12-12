"use client";
import { Button, Tooltip } from "antd";
import {
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceAround,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
  AlignVerticalSpaceAround,
  Maximize,
  Minimize,
  PanelLeftOpen,
  PanelLeftRightDashed,
  PanelRightOpen,
  PanelTopBottomDashed,
  PanelTopClose,
  PanelTopOpen,
} from "lucide-react";
import { useState } from "react";
import DraggableNumberInput from "./DraggableNumberInput";

const SpacingPanel = ({ editor, inspector }: any) => {
  const [linkedMargin, setLinkedMargin] = useState(true);
  const [linkedPadding, setLinkedPadding] = useState(true);

  const sanitize = (v: any) =>
    typeof v === "number" ? v : parseInt(String(v).replace(/px/g, "")) || 0;

  const updateSingleMargin = (
    side: "top" | "bottom" | "left" | "right",
    v: string
  ) => {
    const px = `${sanitize(v)}px`;
    const updated = { ...editor.margin, [side]: px };
    editor.setMargin(updated);
    inspector.updateStyles(
      {
        [`margin${side[0].toUpperCase() + side.slice(1)}`]: px,
      },
      true
    );
  };

  const updateSinglePadding = (
    side: "top" | "bottom" | "left" | "right",
    v: string
  ) => {
    const px = `${sanitize(v)}px`;
    const updated = { ...editor.padding, [side]: px };
    editor.setPadding(updated);
    inspector.updateStyles(
      {
        [`padding${side[0].toUpperCase() + side.slice(1)}`]: px,
      },
      true
    );
  };

  return (
    <section>
      <div className="text-[14px] font-semibold mb-2 flex items-center justify-between">
        <span>Spacing</span>
      </div>

      {/* ---------------- MARGIN ---------------- */}
      <div className="flex gap-2">
        <div className="grid grid-cols-2 gap-2">
          {linkedMargin ? (
            <>
              <DraggableNumberInput
                disabled={!editor.selectedSummary}
                value={editor.margin.top}
                icon={AlignVerticalSpaceAround}
                tooltip="Drag to adjust vertical margin"
                onChange={inspector.updateMarginVertical}
              />
              <DraggableNumberInput
                disabled={!editor.selectedSummary}
                value={editor.margin.left}
                icon={AlignHorizontalSpaceAround}
                tooltip="Drag to adjust horizontal margin"
                onChange={inspector.updateMarginHorizontal}
              />
            </>
          ) : (
            ["top", "bottom", "left", "right"].map((side, idx) => (
              <DraggableNumberInput
                key={side}
                disabled={!editor.selectedSummary}
                value={editor.margin[side]}
                icon={
                  [
                    AlignVerticalJustifyStart,
                    AlignVerticalJustifyEnd,
                    AlignHorizontalJustifyStart,
                    AlignHorizontalJustifyEnd,
                  ][idx]
                }
                tooltip={`Drag to adjust ${side} margin`}
                onChange={(v: string) => updateSingleMargin(side as any, v)}
              />
            ))
          )}
        </div>
        <div className="flex-1">
          <Tooltip title="Toggle margin sides">
            <Button
              color="default"
              variant="filled"
              onClick={() => setLinkedMargin(!linkedMargin)}
              icon={
                linkedMargin ? <Maximize size={15} /> : <Minimize size={15} />
              }
            />
          </Tooltip>
        </div>
      </div>

      {/* ---------------- PADDING ---------------- */}
      <div className="text-[13px] font-semibold mb-2 mt-4">Padding</div>
      <div className="flex gap-2">
        <div className="grid grid-cols-2 gap-2">
          {linkedPadding ? (
            <>
              <DraggableNumberInput
                disabled={!editor.selectedSummary}
                value={editor.padding.top}
                icon={PanelTopBottomDashed}
                tooltip="Drag to adjust vertical padding"
                onChange={inspector.updatePaddingVertical}
              />
              <DraggableNumberInput
                disabled={!editor.selectedSummary}
                value={editor.padding.left}
                icon={PanelLeftRightDashed}
                tooltip="Drag to adjust horizontal padding"
                onChange={inspector.updatePaddingHorizontal}
              />
            </>
          ) : (
            ["top", "bottom", "left", "right"].map((side, idx) => (
              <DraggableNumberInput
                key={side}
                disabled={!editor.selectedSummary}
                value={editor.padding[side]}
                icon={
                  [PanelTopClose, PanelTopOpen, PanelRightOpen, PanelLeftOpen][
                    idx
                  ]
                }
                tooltip={`Drag to adjust ${side} padding`}
                onChange={(v: string) => updateSinglePadding(side as any, v)}
              />
            ))
          )}
        </div>
        <div className="flex-1">
          <Tooltip title="Toggle padding sides">
            <Button
              color="default"
              variant="filled"
              onClick={() => setLinkedPadding(!linkedPadding)}
              icon={
                linkedPadding ? <Maximize size={15} /> : <Minimize size={15} />
              }
            />
          </Tooltip>
        </div>
      </div>

      <div className="border-t border-gray-200 my-6" />
    </section>
  );
};

export default SpacingPanel;
