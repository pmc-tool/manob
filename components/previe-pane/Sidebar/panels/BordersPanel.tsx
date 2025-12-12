"use client";
import { Divider, InputNumber, Select } from "antd";
const { Option } = Select;

const BordersPanel = ({ editor, inspector }: any) => {
  return (
    <>
      <section>
        <div className="text-[14px] font-semibold mb-2">Borders</div>
        <div style={{ display: "flex", gap: 8 }}>
          <div className="flex-1">
            <div className="text-xs text-[#444] mb-1">Border width (px)</div>
            <InputNumber
              variant="filled"
              disabled={!editor.selectedSummary}
              className="w-full!"
              value={
                editor.borders.width
                  ? Number(String(editor.borders.width).replace("px", ""))
                  : undefined
              }
              onChange={(v) => {
                editor.setBorders({
                  ...editor.borders,
                  width: v ? `${v}px` : "",
                });
                inspector.setBorders({
                  ...editor.borders,
                  width: v ? `${v}px` : "",
                });
              }}
            />
          </div>
          <div className="flex-1">
            <div className="text-xs text-[#444] mb-1">Border style</div>
            <Select
              variant="filled"
              disabled={!editor.selectedSummary}
              value={editor.borders.style || undefined}
              onChange={(v) => {
                editor.setBorders({ ...editor.borders, style: v });
                inspector.setBorders({
                  ...editor.borders,
                  style: v,
                });
              }}
              className="w-full!"
            >
              <Option value="">(none)</Option>
              <Option value="solid">solid</Option>
              <Option value="dashed">dashed</Option>
              <Option value="dotted">dotted</Option>
            </Select>
          </div>
          <div className="flex-1">
            <div className="text-xs text-[#444] mb-1">Radius (px)</div>
            <InputNumber
              variant="filled"
              disabled={!editor.selectedSummary}
              className="w-full!"
              value={
                editor.borders.radius
                  ? Number(String(editor.borders.radius).replace("px", ""))
                  : undefined
              }
              onChange={(v) => {
                editor.setBorders({
                  ...editor.borders,
                  radius: v ? `${v}px` : "",
                });
                inspector.setBorders({
                  ...editor.borders,
                  radius: v ? `${v}px` : "",
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

export default BordersPanel;
