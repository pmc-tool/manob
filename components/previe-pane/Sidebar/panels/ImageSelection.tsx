"use client";
import { Button, Image } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

type ImageSelectionProps = {
  images: string[];
  selected: string | null;
  setSelected: (img: string | null) => void;
  onClose: () => void;
  onSave: (img: string | null) => void;
  editor: any;
  inspector: any;
  originalSrc: string;
};

const ImageSelection: React.FC<ImageSelectionProps> = ({
  images,
  selected,
  setSelected,
  onClose,
  onSave,
  editor,
  inspector,
  originalSrc,
}) => {
  return (
    <div>
      <div className="flex gap-2 mb-3">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`flex-1 aspect-video rounded-md border-2 overflow-hidden cursor-pointer transition-all relative ${
              selected === img ? "border-blue-500" : "border-gray-300"
            }`}
            onClick={() => {
              setSelected(img);
              editor.setImgProps({ ...editor.imgProps, src: img });
              inspector.setImgProps?.({ ...editor.imgProps, src: img });
            }}
          >
            <Image
              src={img}
              preview={false}
              alt={`img-${idx}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          color="default"
          variant="filled"
          onClick={() => {
            onClose();
            editor.setImgProps({ ...editor.imgProps, src: originalSrc });
            inspector.setImgProps?.({ ...editor.imgProps, src: originalSrc });
          }}
          className="flex-1"
          icon={<CloseOutlined />}
        >
          Close
        </Button>

        <Button
          type="primary"
          className="flex-1"
          icon={<CheckOutlined />}
          onClick={() => onSave(selected)}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default ImageSelection;
