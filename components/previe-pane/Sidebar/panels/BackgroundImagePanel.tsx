"use client";
import { Input, Select, Button } from "antd";
import { RotateCcw } from "lucide-react";

const { Option } = Select;

export default function BackgroundImagePanel({ editor, inspector }: any) {
  const bg = editor.backgroundImage || {
    image: "",
    size: "",
    position: "",
    repeat: "",
  };

  const urlValue = (bg.image || "")
    .replace(/^url\(["']?/, "")
    .replace(/["']?\)$/, "");

  const reset = () => {
    inspector.setBackgroundImage({
      image: "",
      size: "",
      position: "",
      repeat: "",
    });
  };

  return (
    <div className="mb-5 border p-3 rounded-lg">
      <div className="font-semibold text-[14px] mb-2">
        Background Image
      </div>

      {/* IMAGE URL */}
      <div className="mb-3">
        <div className="text-[13px] mb-1">Image URL</div>
        <Input
          placeholder="https://example.com/image.jpg"
          value={urlValue}
          onChange={(e) =>
            inspector.setBackgroundImage({ image: e.target.value })
          }
        />
      </div>

      {/* SIZE */}
      <div className="mb-3">
        <div className="text-[13px] mb-1">Size</div>
        <Select
          style={{ width: "100%" }}
          value={bg.size || ""}
          onChange={(v) => inspector.setBackgroundImage({ size: v })}
        >
          <Option value="">Default</Option>
          <Option value="cover">Cover</Option>
          <Option value="contain">Contain</Option>
          <Option value="auto">Auto</Option>
          <Option value="100% 100%">Stretch</Option>
        </Select>
      </div>

      {/* POSITION */}
      <div className="mb-3">
        <div className="text-[13px] mb-1">Position</div>
        <Select
          style={{ width: "100%" }}
          value={bg.position || ""}
          onChange={(v) => inspector.setBackgroundImage({ position: v })}
        >
          <Option value="">Default</Option>
          <Option value="center">Center</Option>
          <Option value="top">Top</Option>
          <Option value="bottom">Bottom</Option>
          <Option value="left">Left</Option>
          <Option value="right">Right</Option>
        </Select>
      </div>

      {/* REPEAT */}
      <div className="mb-4">
        <div className="text-[13px] mb-1">Repeat</div>
        <Select
          style={{ width: "100%" }}
          value={bg.repeat || ""}
          onChange={(v) => inspector.setBackgroundImage({ repeat: v })}
        >
          <Option value="">Default</Option>
          <Option value="no-repeat">No repeat</Option>
          <Option value="repeat">Tile</Option>
          <Option value="repeat-x">Repeat X</Option>
          <Option value="repeat-y">Repeat Y</Option>
        </Select>
      </div>

      {/* RESET */}
      <Button
        icon={<RotateCcw size={14} />}
        onClick={reset}
        className="w-full"
      >
        Reset Background
      </Button>
    </div>
  );
}
