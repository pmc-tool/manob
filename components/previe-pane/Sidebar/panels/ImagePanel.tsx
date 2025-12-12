"use client";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Divider, Image, Input, Select, Upload, message } from "antd";
import { RotateCcw, WandSparkles } from "lucide-react";
import { useState } from "react";
import ImageSelection from "./ImageSelection"; // Import the reusable component

const ImagePanel = ({ editor, inspector }: any) => {
  const [hovered, setHovered] = useState(false);
  const [isPromptMode, setIsPromptMode] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");

  const [originalSrc, setOriginalSrc] = useState(editor.imgProps.src);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!editor.selectedSummary) return null;

  // File upload handler
  const handleUpload = (file: any) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      editor.setImgProps({ ...editor.imgProps, src: url });
      inspector.setImgProps?.({ ...editor.imgProps, src: url });
      message.success("Image updated!");
    };
    reader.readAsDataURL(file);
    return false;
  };

  // Regenerate images
  const handleRegenerate = () => {
    setOriginalSrc(editor.imgProps.src);

    const newImages = [
      "/images/sample1.jpg",
      "/images/sample2.jpg",
      "/images/sample3.jpg",
    ];
    setGeneratedImages(newImages);
    setSelectedImage(null);
  };

  // Save selected image
  const handleSaveSelected = (img: string | null) => {
    if (img) {
      editor.setImgProps({ ...editor.imgProps, src: img });
      inspector.setImgProps?.({ ...editor.imgProps, src: img });
      setGeneratedImages([]);
      setSelectedImage(null);
      message.success("Selected image applied!");
    }
  };

  // Apply prompt changes (mock implementation)
  const handleApplyPrompt = () => {
    if (!editPrompt.trim()) {
      message.error("Please enter a prompt.");
      return;
    }
    setOriginalSrc(editor.imgProps.src);

    const newImages = [
      "/images/prompt1.jpg",
      "/images/prompt2.jpg",
      "/images/prompt3.jpg",
    ];
    setGeneratedImages(newImages);
    setSelectedImage(null);
    setIsPromptMode(false);
    setEditPrompt("");
  };

  return (
    <>
      <section>
        <div className="text-[14px] font-semibold mb-2">Image</div>

        {/* Preview */}
        <div
          className="relative w-full h-46 bg-[#f5f4f3] rounded-md flex items-center justify-center overflow-hidden mb-3"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {editor.imgProps.src ? (
            <Image
              preview={false}
              src={editor.imgProps.src}
              alt={editor.imgProps.alt || "preview"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: editor.imgProps.objectFit || "contain",
              }}
            />
          ) : (
            <span className="text-gray-400">No image</span>
          )}

          {hovered && !generatedImages.length && !isPromptMode && (
            <div className="absolute inset-0 p-4 flex flex-col items-center justify-center bg-[#f8f4f3]/90 transition-opacity">
              <div className="text-gray-700 mb-3 text-center text-sm">
                Replace with any JPG, PNG,
                <br /> or WEBP file up to 20MB
              </div>
              <Upload showUploadList={false} beforeUpload={handleUpload}>
                <Button
                  color="default"
                  variant="solid"
                  icon={<UploadOutlined />}
                  className="z-10"
                >
                  Upload File
                </Button>
              </Upload>
            </div>
          )}
        </div>

        {/* Buttons or Prompt Mode */}
        <div className="mb-3">
          {!isPromptMode && generatedImages.length === 0 ? (
            <div className="flex gap-2">
              <Button
                color="default"
                variant="filled"
                onClick={handleRegenerate}
                className="flex-1"
                icon={<RotateCcw size={14} strokeWidth={2.2} />}
              >
                <span className="font-medium">Regenerate</span>
              </Button>

              <Button
                color="default"
                variant="filled"
                onClick={() => setIsPromptMode(true)}
                className="flex-1"
                icon={<WandSparkles size={14} strokeWidth={2.2} />}
              >
                <span className="font-medium">Prompt to Edit</span>
              </Button>
            </div>
          ) : isPromptMode ? (
            <div className="flex flex-col gap-2">
              <Input.TextArea
                rows={2}
                variant="filled"
                placeholder="Describe your changes..."
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
              />

              <div className="flex gap-2">
                <Button
                  type="primary"
                  className="flex-1"
                  onClick={handleApplyPrompt}
                >
                  Apply
                </Button>

                <Button
                  type="default"
                  className="flex-1"
                  onClick={() => {
                    setIsPromptMode(false);
                    setEditPrompt("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : generatedImages.length > 0 ? (
            <ImageSelection
              images={generatedImages}
              selected={selectedImage}
              setSelected={setSelectedImage}
              onClose={() => {
                setGeneratedImages([]);
                setSelectedImage(null);
              }}
              onSave={handleSaveSelected}
              editor={editor}
              inspector={inspector}
              originalSrc={originalSrc}
            />
          ) : null}
        </div>

        {/* Source, Width, Height, Layout, Alt text */}
        <div className="mb-3">
          <div className="text-xs text-[#444] mb-1">Source (src)</div>
          <Input
            variant="filled"
            value={editor.imgProps.src}
            disabled={!editor.selectedSummary}
            onChange={(e) => {
              editor.setImgProps({ ...editor.imgProps, src: e.target.value });
              inspector.setImgProps?.({
                ...editor.imgProps,
                src: e.target.value,
              });
            }}
            placeholder="Image URL"
          />
        </div>

        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <div className="text-xs text-[#444] mb-1">Width</div>
            <Input
              variant="filled"
              value={editor.imgProps.width}
              disabled={!editor.selectedSummary}
              onChange={(e) => {
                editor.setImgProps({
                  ...editor.imgProps,
                  width: e.target.value,
                });
                inspector.setImgProps?.({
                  ...editor.imgProps,
                  width: e.target.value,
                });
              }}
              placeholder="e.g. 200px or 50%"
            />
          </div>

          <div className="flex-1">
            <div className="text-xs text-[#444] mb-1">Height</div>
            <Input
              variant="filled"
              value={editor.imgProps.height}
              disabled={!editor.selectedSummary}
              onChange={(e) => {
                editor.setImgProps({
                  ...editor.imgProps,
                  height: e.target.value,
                });
                inspector.setImgProps?.({
                  ...editor.imgProps,
                  height: e.target.value,
                });
              }}
              placeholder="e.g. auto or 100px"
            />
          </div>
        </div>

        <div className="mb-3">
          <div className="text-xs text-[#444] mb-1">Image Layout</div>
          <Select
            variant="filled"
            className="w-full"
            value={editor.imgProps.objectFit || "contain"}
            onChange={(value) => {
              editor.setImgProps({ ...editor.imgProps, objectFit: value });
              inspector.setImgProps?.({ ...editor.imgProps, objectFit: value });
            }}
            options={[
              { label: "Contain", value: "contain" },
              { label: "Cover", value: "cover" },
              { label: "Fill", value: "fill" },
              { label: "Scale Down", value: "scale-down" },
            ]}
          />
        </div>

        <div style={{ marginTop: 8 }}>
          <div className="text-xs text-[#444] mb-1">Alt text</div>
          <Input
            variant="filled"
            value={editor.imgProps.alt}
            disabled={!editor.selectedSummary}
            onChange={(e) => {
              editor.setImgProps({ ...editor.imgProps, alt: e.target.value });
              inspector.setImgProps?.({
                ...editor.imgProps,
                alt: e.target.value,
              });
            }}
          />
        </div>
      </section>

      <Divider />
    </>
  );
};

export default ImagePanel;
