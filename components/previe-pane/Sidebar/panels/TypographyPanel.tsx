"use client";
import { ColorPicker, Input, InputNumber, Radio, Select, Tooltip } from "antd";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";
import { useEffect, useState } from "react";
import { loadGoogleFontToDocument } from "./loadGoogleFontToDocument";
const { Option } = Select;

const TypographyPanel = ({ editor, inspector }: any) => {
  const [googleFonts, setGoogleFonts] = useState<string[]>([]);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_FONTS_KEY;

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}`
        );
        const data = await res.json();
        const fontNames = data.items.map((f: any) => f.family);

        setGoogleFonts(fontNames);
      } catch (error) {
        console.error("Failed to load Google Fonts", error);
      }
    };

    fetchFonts();
  }, [apiKey]);

  return (
    <>
      <section>
        <div className="text-[14px] font-semibold mb-2">Typography</div>
        <div className="flex gap-2">
          <div className="w-[120px]">
            <div className="text-xs text-[#444] mb-1">Font size (px)</div>
            <InputNumber
              disabled={!editor.selectedSummary}
              className="w-full!"
              variant="filled"
              value={
                editor.typography.fontSize
                  ? Number(String(editor.typography.fontSize).replace("px", ""))
                  : undefined
              }
              onChange={(v) => {
                editor.setTypography({
                  ...editor.typography,
                  fontSize: v ? `${v}px` : "",
                });
                inspector.setTypography({
                  ...editor.typography,
                  fontSize: v ? `${v}px` : "",
                });
              }}
            />
          </div>
          <div className="flex-1">
            <div className="text-xs text-[#444] mb-1">Weight</div>
            <Select
              variant="filled"
              disabled={!editor.selectedSummary}
              value={editor.typography.fontWeight || undefined}
              onChange={(v) => {
                editor.setTypography({
                  ...editor.typography,
                  fontWeight: `${v}`,
                });
                inspector.setTypography({
                  ...editor.typography,
                  fontWeight: `${v}`,
                });
              }}
              className="w-full"
            >
              <Option value="100">100 - Thin</Option>
              <Option value="200">200 - Extra Light</Option>
              <Option value="300">300 - Light</Option>
              <Option value="400">400 - Regular</Option>
              <Option value="500">500 - Medium</Option>
              <Option value="600">600 - SemiBold</Option>
              <Option value="700">700 - Bold</Option>
              <Option value="800">800 - Extra Bold</Option>
              <Option value="900">900 - Black</Option>
            </Select>
          </div>
        </div>

        <div className="mt-3">
          <div className="text-xs text-[#444] mb-1">Alignment</div>
          <Radio.Group
            block
            optionType="button"
            buttonStyle="solid"
            disabled={!editor.selectedSummary}
            defaultValue={editor.typography.textAlign}
            onChange={(e) => {
              editor.setTypography({
                ...editor.typography,
                textAlign: e.target.value,
              });
              inspector.setTypography({
                ...editor.typography,
                textAlign: e.target.value,
              });
            }}
          >
            <Tooltip title="Align Left">
              <Radio.Button value="left">
                <span className="anticon">
                  <AlignLeft size={15} />
                </span>
              </Radio.Button>
            </Tooltip>

            <Tooltip title="Align Center">
              <Radio.Button value="center">
                <span className="anticon">
                  <AlignCenter size={15} />
                </span>
              </Radio.Button>
            </Tooltip>

            <Tooltip title="Align Right">
              <Radio.Button value="right">
                <span className="anticon">
                  <AlignRight size={15} />
                </span>
              </Radio.Button>
            </Tooltip>

            <Tooltip title="Justify">
              <Radio.Button value="justify">
                <span className="anticon">
                  <AlignJustify size={15} />
                </span>
              </Radio.Button>
            </Tooltip>
          </Radio.Group>
        </div>

        <div className="flex gap-2 mt-2">
          <div className="flex-1">
            <div className="text-xs text-[#444] mb-1">Line height</div>
            <Input
              variant="filled"
              disabled={!editor.selectedSummary}
              value={editor.typography.lineHeight}
              onChange={(e) => {
                editor.setTypography({
                  ...editor.typography,
                  lineHeight: e.target.value,
                });
                inspector.setTypography({
                  ...editor.typography,
                  lineHeight: e.target.value,
                });
              }}
              placeholder="e.g. 1.5 or 24px"
            />
          </div>
          <div className="w-[140px]">
            <div className="text-xs text-[#444] mb-1">Color</div>
            <ColorPicker
              size="middle"
              className="w-full! custom-color-picker"
              disabled={!editor.selectedSummary}
              defaultValue={editor.typography.color || "#000000"}
              onChange={(color) => {
                const hexColor = color.toHexString();
                editor.setTypography({
                  ...editor.typography,
                  color: hexColor,
                });
                inspector.setTypography({
                  ...editor.typography,
                  color: hexColor,
                });
              }}
            />
          </div>
        </div>

        <div className="mt-2">
          <div className="text-xs text-[#444] mb-1">Font family</div>
          <Select
            showSearch
            className="w-full"
            variant="filled"
            disabled={!editor.selectedSummary}
            placeholder="Search Google Fonts…"
            value={editor.typography.fontFamily || undefined}
            onChange={(font) => {
              loadGoogleFontToDocument(font); // preview in dropdown

              editor.setTypography({
                ...editor.typography,
                fontFamily: font,
              });

              inspector.setTypography({
                ...editor.typography,
                fontFamily: font,
              });
            }}
            filterOption={(input, option) =>
              typeof option?.value === "string" &&
              option.value.toLowerCase().includes(input.toLowerCase())
            }
          >
            {googleFonts.map((font) => {
              loadGoogleFontToDocument(font); // load for preview

              return (
                <Select.Option
                  key={font}
                  value={font}
                  style={{
                    fontFamily: font,
                    fontSize: 14,
                  }}
                >
                  {font}
                </Select.Option>
              );
            })}
          </Select>
        </div>
      </section>
      <div className="border-t border-gray-200 my-6" />
    </>
  );
};

export default TypographyPanel;
