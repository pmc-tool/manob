"use client";
import { Input, Radio, Tooltip } from "antd";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeftRight,
  ArrowUp,
  ArrowUpDown,
  Ban,
  Box,
  Columns,
  Grid,
  List,
  Repeat,
} from "lucide-react";

const LayoutPanel = ({ editor, inspector }: any) => {
  const {
    display,
    width,
    height,
    flexDirection,
    justifyContent,
    alignItems,
    gridTemplateColumns,
    gap,
  } = editor.layout;

  /** Helper to update layout styles */
  const handleLayoutChange = (updates: Partial<CSSStyleDeclaration>) => {
    inspector.updateStyles(updates);
  };

  return (
    <>
      <section>
        <div className="text-[13px] font-semibold mb-2">Layout</div>

        {/* Display */}
        <div className="mb-2">
          <div className="text-xs text-[#444] mb-1">Display</div>
          <Radio.Group
            block
            disabled={!editor.selectedSummary}
            value={display || ""}
            onChange={(e) => handleLayoutChange({ display: e.target.value })}
            optionType="button"
            buttonStyle="solid"
          >
            <Tooltip title="None">
              <Radio.Button
                value=""
                className="inline-flex! justify-center items-center"
              >
                <Ban size={15} />
              </Radio.Button>
            </Tooltip>
            <Tooltip title="Block">
              <Radio.Button
                value="block"
                className="inline-flex! justify-center items-center"
              >
                <Box size={15} />
              </Radio.Button>
            </Tooltip>
            <Tooltip title="Inline">
              <Radio.Button
                value="inline"
                className="inline-flex! justify-center items-center"
              >
                <List size={15} />
              </Radio.Button>
            </Tooltip>
            <Tooltip title="Inline Block">
              <Radio.Button
                value="inline-block"
                className="inline-flex! justify-center items-center"
              >
                <Columns size={15} />
              </Radio.Button>
            </Tooltip>
            <Tooltip title="Flex">
              <Radio.Button
                value="flex"
                className="inline-flex! justify-center items-center"
              >
                <ArrowLeftRight size={15} />
              </Radio.Button>
            </Tooltip>
            <Tooltip title="Grid">
              <Radio.Button
                value="grid"
                className="inline-flex! justify-center items-center"
              >
                <Grid size={15} />
              </Radio.Button>
            </Tooltip>
          </Radio.Group>
        </div>

        {/* Flex Options */}
        {display === "flex" && (
          <div className="mb-2">
            <div className="text-xs text-[#444] mb-1">Flex Direction</div>
            <Radio.Group
              disabled={!editor.selectedSummary}
              value={flexDirection || ""}
              onChange={(e) =>
                handleLayoutChange({ flexDirection: e.target.value })
              }
              optionType="button"
              buttonStyle="solid"
            >
              <Tooltip title="Row">
                <Radio.Button
                  value="row"
                  className="inline-flex! justify-center items-center"
                >
                  <ArrowLeftRight size={15} />
                </Radio.Button>
              </Tooltip>
              <Tooltip title="Row Reverse">
                <Radio.Button
                  value="row-reverse"
                  className="inline-flex! justify-center items-center"
                >
                  <ArrowLeftRight
                    size={15}
                    style={{ transform: "rotate(180deg)" }}
                  />
                </Radio.Button>
              </Tooltip>
              <Tooltip title="Column">
                <Radio.Button
                  value="column"
                  className="inline-flex! justify-center items-center"
                >
                  <ArrowUpDown size={15} />
                </Radio.Button>
              </Tooltip>
              <Tooltip title="Column Reverse">
                <Radio.Button
                  value="column-reverse"
                  className="inline-flex! justify-center items-center"
                >
                  <ArrowUpDown
                    size={15}
                    style={{ transform: "rotate(180deg)" }}
                  />
                </Radio.Button>
              </Tooltip>
            </Radio.Group>

            <div className="text-xs text-[#444] mb-1 mt-2">Justify Content</div>
            <Radio.Group
              disabled={!editor.selectedSummary}
              value={justifyContent || ""}
              onChange={(e) =>
                handleLayoutChange({ justifyContent: e.target.value })
              }
              optionType="button"
              buttonStyle="solid"
            >
              <Tooltip title="Start">
                <Radio.Button
                  value="flex-start"
                  className="inline-flex! justify-center items-center"
                >
                  <AlignLeft size={15} />
                </Radio.Button>
              </Tooltip>
              <Tooltip title="Center">
                <Radio.Button
                  value="center"
                  className="inline-flex! justify-center items-center"
                >
                  <AlignCenter size={15} />
                </Radio.Button>
              </Tooltip>
              <Tooltip title="End">
                <Radio.Button
                  value="flex-end"
                  className="inline-flex! justify-center items-center"
                >
                  <AlignRight size={15} />
                </Radio.Button>
              </Tooltip>
              <Tooltip title="Space Between">
                <Radio.Button
                  value="space-between"
                  className="inline-flex! justify-center items-center"
                >
                  <ArrowLeftRight size={15} />
                </Radio.Button>
              </Tooltip>
              <Tooltip title="Space Around">
                <Radio.Button
                  value="space-around"
                  className="inline-flex! justify-center items-center"
                >
                  <Repeat size={15} />
                </Radio.Button>
              </Tooltip>
              <Tooltip title="Space Evenly">
                <Radio.Button
                  value="space-evenly"
                  className="inline-flex! justify-center items-center"
                >
                  <Columns size={15} />
                </Radio.Button>
              </Tooltip>
            </Radio.Group>

            <div className="text-xs text-[#444] mb-1 mt-2">Align Items</div>
            <Radio.Group
              disabled={!editor.selectedSummary}
              value={alignItems || ""}
              onChange={(e) =>
                handleLayoutChange({ alignItems: e.target.value })
              }
              optionType="button"
              buttonStyle="solid"
            >
              <Tooltip title="Stretch">
                <Radio.Button
                  value="stretch"
                  className="inline-flex! justify-center items-center"
                >
                  <ArrowUpDown size={15} />
                </Radio.Button>
              </Tooltip>
              <Tooltip title="Start">
                <Radio.Button
                  value="flex-start"
                  className="inline-flex! justify-center items-center"
                >
                  <AlignLeft size={15} />
                </Radio.Button>
              </Tooltip>
              <Tooltip title="Center">
                <Radio.Button
                  value="center"
                  className="inline-flex! justify-center items-center"
                >
                  <AlignCenter size={15} />
                </Radio.Button>
              </Tooltip>
              <Tooltip title="End">
                <Radio.Button
                  value="flex-end"
                  className="inline-flex! justify-center items-center"
                >
                  <AlignRight size={15} />
                </Radio.Button>
              </Tooltip>
              <Tooltip title="Baseline">
                <Radio.Button
                  value="baseline"
                  className="inline-flex! justify-center items-center"
                >
                  <ArrowUp size={15} />
                </Radio.Button>
              </Tooltip>
            </Radio.Group>
          </div>
        )}

        {/* Grid Options */}
        {display === "grid" && (
          <div className="mb-2">
            <div className="text-[12px] text-[#444] mt-2">
              Grid Template Columns
            </div>
            <Radio.Group
              disabled={!editor.selectedSummary}
              value={gridTemplateColumns || ""}
              onChange={(e) =>
                handleLayoutChange({ gridTemplateColumns: e.target.value })
              }
              optionType="button"
              buttonStyle="solid"
            >
              <Tooltip title="1 Column">
                <Radio.Button
                  value="1fr"
                  className="inline-flex! justify-center items-center"
                >
                  <div className="h-4 w-4 bg-[#ddd]" />
                </Radio.Button>
              </Tooltip>
              <Tooltip title="2 Columns">
                <Radio.Button
                  value="1fr 1fr"
                  className="inline-flex! justify-center items-center"
                >
                  <div className="flex gap-1">
                    <div className="h-4 w-4 bg-[#ddd]" />
                    <div className="h-4 w-4 bg-[#ddd]" />
                  </div>
                </Radio.Button>
              </Tooltip>
              <Tooltip title="3 Columns">
                <Radio.Button
                  value="1fr 1fr 1fr"
                  className="inline-flex! justify-center items-center"
                >
                  <div className="flex gap-1">
                    <div className="h-4 w-4 bg-[#ddd]" />
                    <div className="h-4 w-4 bg-[#ddd]" />
                    <div className="h-4 w-4 bg-[#ddd]" />
                  </div>
                </Radio.Button>
              </Tooltip>
              <Tooltip title="Custom">
                <Radio.Button
                  value="custom"
                  className="inline-flex! justify-center items-center"
                >
                  <div className="text-xs">⋯</div>
                </Radio.Button>
              </Tooltip>
            </Radio.Group>

            {gridTemplateColumns === "custom" && (
              <Input
                className="mt-2"
                disabled={!editor.selectedSummary}
                value=""
                onChange={(e) =>
                  handleLayoutChange({ gridTemplateColumns: e.target.value })
                }
                placeholder="e.g. 1fr 2fr 1fr"
              />
            )}

            <div className="text-[12px] text-[#444] mt-2">Gap</div>
            <Input
              disabled={!editor.selectedSummary}
              value={gap}
              onChange={(e) => handleLayoutChange({ gap: e.target.value })}
              placeholder="e.g. 10px, 1rem"
            />
          </div>
        )}

        {/* Width & Height */}
        <div className="flex gap-2 mb-2">
          <div className="flex-1">
            <div className="text-xs text-[#444] mb-1">Width</div>
            <Input
              variant="filled"
              disabled={!editor.selectedSummary}
              value={width}
              onChange={(e) => handleLayoutChange({ width: e.target.value })}
              placeholder="e.g. 100%, 300px"
            />
          </div>
          <div className="flex-1">
            <div className="text-xs text-[#444] mb-1">Height</div>
            <Input
              variant="filled"
              disabled={!editor.selectedSummary}
              value={height}
              onChange={(e) => handleLayoutChange({ height: e.target.value })}
              placeholder="e.g. auto, 200px"
            />
          </div>
        </div>
      </section>

      <div className="border-t border-gray-200 my-6" />
    </>
  );
};

export default LayoutPanel;
