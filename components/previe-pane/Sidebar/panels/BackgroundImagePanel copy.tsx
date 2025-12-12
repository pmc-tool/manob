"use client";
import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Input, message, Upload } from "antd";

type Props = {
  editor: any;
  inspector: any;
};

const BackgroundImagePanel: React.FC<Props> = ({ editor }) => {
  const [bgUrl, setBgUrl] = useState(editor.selectedBackground?.src || "");
  const [bgSize, setBgSize] = useState(editor.selectedBackground?.size || "cover");
  const [bgRepeat, setBgRepeat] = useState(editor.selectedBackground?.repeat || "no-repeat");
  const [bgPosition, setBgPosition] = useState(editor.selectedBackground?.position || "center");

  const updateBackground = (updates: Partial<CSSStyleDeclaration>) => {
    const el = editor.getSelected();
    if (!el) return;

    Object.entries(updates).forEach(([key, value]) => {
      (el.style as any)[key] = value ?? "";
    });

    editor.detectRelevantGroups(el); // Refresh the panel values
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setBgUrl(url);
    updateBackground({ backgroundImage: url ? `url(${url})` : "" });
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setBgUrl(result);
      updateBackground({ backgroundImage: `url(${result})` });
    };
    reader.readAsDataURL(file);
    return false; // Prevent default upload
  };

  const handleSizeChange = (value: string) => {
    setBgSize(value);
    updateBackground({ backgroundSize: value });
  };

  const handleRepeatChange = (value: string) => {
    setBgRepeat(value);
    updateBackground({ backgroundRepeat: value });
  };

  const handlePositionChange = (value: string) => {
    setBgPosition(value);
    updateBackground({ backgroundPosition: value });
  };

  return (
    <div className="mb-4">
      <div className="text-[14px] font-semibold mb-2">Background Image</div>

      <Input
        placeholder="Image URL"
        value={bgUrl}
        onChange={handleUrlChange}
        className="mb-2"
      />

      <Upload beforeUpload={handleUpload} showUploadList={false}>
        <Button icon={<UploadOutlined />} size="small" className="mb-2">
          Upload Image
        </Button>
      </Upload>

      <div className="flex flex-col gap-2">
        <div>
          <label className="text-[13px] mr-2">Size:</label>
          <select value={bgSize} onChange={(e) => handleSizeChange(e.target.value)}>
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        <div>
          <label className="text-[13px] mr-2">Repeat:</label>
          <select value={bgRepeat} onChange={(e) => handleRepeatChange(e.target.value)}>
            <option value="no-repeat">No Repeat</option>
            <option value="repeat">Repeat</option>
            <option value="repeat-x">Repeat X</option>
            <option value="repeat-y">Repeat Y</option>
          </select>
        </div>

        <div>
          <label className="text-[13px] mr-2">Position:</label>
          <select value={bgPosition} onChange={(e) => handlePositionChange(e.target.value)}>
            <option value="center">Center</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BackgroundImagePanel;
