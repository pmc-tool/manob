"use client";
import { ColorPicker, Divider } from "antd";

const ColorsPanel = ({ editor, inspector }: any) => {
  return (
    <>
      <section>
        <div className="text-[14px] font-semibold mb-2">Colors</div>
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="text-xs text-[#444] mb-1">Background</div>
            {/* <Input
              disabled={!editor.selectedSummary}
              type="color"
              value={editor.colors.background || "#ffffff"}
              onChange={(e) =>
                editor.setColors({
                  ...editor.colors,
                  background: e.target.value,
                })
              }
            /> */}

            <ColorPicker
              size="middle"
              className="w-full! custom-color-picker"
              disabled={!editor.selectedSummary}
              defaultValue={editor.typography.background || "#ffffff"}
              onChange={(background) => {
                const hexColor = background.toHexString();
                editor.setTypography({
                  ...editor.typography,
                  background: hexColor,
                });
                inspector.setTypography({
                  ...editor.typography,
                  background: hexColor,
                });
              }}
            />
          </div>
          <div className="w-[140px]">
            <div className="text-xs text-[#444] mb-1">Border color</div>
            {/* <Input
              disabled={!editor.selectedSummary}
              type="color"
              value={editor.colors.borderColor || "#000000"}
              onChange={(e) =>
                editor.setColors({
                  ...editor.colors,
                  borderColor: e.target.value,
                })
              }
            /> */}

            <ColorPicker
              size="middle"
              className="w-full! custom-color-picker"
              disabled={!editor.selectedSummary}
              defaultValue={editor.typography.borderColor || "#000000"}
              onChange={(borderColor) => {
                const hexColor = borderColor.toHexString();
                editor.setTypography({
                  ...editor.typography,
                  borderColor: hexColor,
                });
                inspector.setTypography({
                  ...editor.typography,
                  borderColor: hexColor,
                });
              }}
            />
          </div>
        </div>
      </section>
      <Divider />
    </>
  );
};

export default ColorsPanel;
