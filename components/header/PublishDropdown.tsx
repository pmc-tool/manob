"use client";

import { useSettingsModal } from "@/context/SettingsModalContext";
import {
  GithubOutlined,
  PlusOutlined,
  UploadOutlined,
  UserOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import {
  Button,
  Input,
  Select,
  Space,
  Tooltip,
  Upload,
  UploadProps,
  message,
} from "antd";
import { Info } from "lucide-react";
import { useState } from "react";

const { TextArea } = Input;
const { Dragger } = Upload;

interface PublishDropdownProps {
  onClose?: () => void;
}

export function PublishDropdown({ onClose }: PublishDropdownProps) {
  const [subdomain, setSubdomain] = useState("");
  const [access, setAccess] = useState("Anyone");
  const { openModal } = useSettingsModal();

  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div className="w-[450px] p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
      {/* Header */}
      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Publish Changes to This Template
      </p>
      <p className="text-gray-700 text-sm mb-4">
        Make your project available to others by publishing it as a template.
      </p>

      {/* Default Domain */}
      <div className="p-4 bg-[#f8f4f3] mb-2 rounded-xl">
        <div className="mb-2">
          <div className="border-b pb-2 mb-3 border-gray-200">
            <div className="text-sm font-semibold">Default Domain</div>
            <div className="mb-0 text-[13px] text-gray-700">
              The URL your generation will always be available at.
            </div>
          </div>

          <Space.Compact block>
            <Space.Addon className="bg-gray-200!">pmc-</Space.Addon>

            <Input
              placeholder="Add your-domain (empty to auto-generate)"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              className="flex-1"
            />

            <Space.Addon className="bg-gray-200!">.engine.app</Space.Addon>
          </Space.Compact>
        </div>

        {subdomain ? (
          <div className="flex gap-2 justify-end">
            <Button
              onClick={() => setSubdomain("")}
              color="default"
              variant="outlined"
              size="small"
            >
              Discard
            </Button>
            <Button
              type="primary"
              size="small"
              onClick={() => console.log("Saved:", subdomain)}
            >
              Save
            </Button>
          </div>
        ) : (
          <Button
            color="default"
            variant="outlined"
            block
            icon={<PlusOutlined style={{ fontSize: "13px" }} />}
            //  onClick={() => openModal("Domains")}
            onClick={() => {
              openModal("Domains"); // open modal
              onClose?.(); // close dropdown
            }}
          >
            <span className="text-[13px]">Add Custom Domain</span>
          </Button>
        )}
      </div>

      {/* Publish as Template */}
      <div className="p-4 bg-[#f8f4f3] mb-2 rounded-xl">
        <div className="border-b pb-2 mb-3 border-gray-200">
          <div className="text-sm font-semibold">Publish as Template Info</div>
          <div className="mb-0 text-[13px] text-gray-700">
            Share your project as a reusable template for others.
          </div>
        </div>

        {/* Template Name */}
        <div className="mb-3">
          <div className="text-xs mb-1 font-medium flex items-center gap-1">
            Template Name
            <Tooltip title="Enter a name for your template">
              <Info className="w-3 h-3 text-gray-400 cursor-pointer" />
            </Tooltip>
          </div>
          <Input placeholder="Template Name" />
        </div>

        {/* Description */}
        <div className="mb-3">
          <div className="text-xs mb-1 font-medium flex items-center gap-1">
            Description
            <Tooltip title="Provide a short description of your template">
              <Info className="w-3 h-3 text-gray-400 cursor-pointer" />
            </Tooltip>
          </div>
          <TextArea
            placeholder="Description"
            rows={3}
            maxLength={150}
            showCount
          />
        </div>

        {/* Share Image */}
        <div className="text-xs mb-1 font-medium flex items-center gap-1">
          Share image
          <Tooltip title="Upload an image to share for your template">
            <Info className="w-3 h-3 text-gray-400 cursor-pointer" />
          </Tooltip>
        </div>

        <Dragger {...props}>
          <UploadOutlined style={{ fontSize: "20px" }} />
          <div className="text-[16px] font-medium">Click to upload</div>
          <p className="ant-upload-hint">
            By default a screenshot of the app is used
          </p>
        </Dragger>
      </div>

      {/* Access */}
      <div className="p-4 bg-[#f8f4f3] mb-2 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold flex-1">Who can access?</div>

          <Select
            value={access}
            onChange={(val) => setAccess(val)}
            popupStyle={{ width: 220 }}
            optionLabelProp="label"
            placement="bottomRight"
          >
            {/* Anyone */}
            <Select.Option
              value="Anyone"
              label={
                <div className="flex items-center gap-2">
                  <UserOutlined />
                  <span>Anyone</span>
                </div>
              }
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex gap-2">
                  <UserOutlined />
                  <div>
                    <div>Anyone</div>
                    <div className="text-xs text-gray-500 font-medium">
                      Anyone can access
                    </div>
                  </div>
                </div>

                {access === "Anyone" && (
                  <CheckOutlined className="text-red-500!" />
                )}
              </div>
            </Select.Option>

            {/* Workspace */}
            <Select.Option
              value="Workspace"
              label={
                <div className="flex items-center gap-2">
                  <GithubOutlined />
                  <span>Workspace</span>
                </div>
              }
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex gap-2">
                  <GithubOutlined />
                  <div>
                    <div>Workspace</div>
                    <div className="text-xs text-gray-500 font-medium">
                      Only workspace members
                    </div>
                  </div>
                </div>

                {access === "Workspace" && (
                  <CheckOutlined className="text-red-500!" />
                )}
              </div>
            </Select.Option>
          </Select>
        </div>
      </div>

      {/* Publish Button */}
      <div className="mt-3">
        <Button type="primary" block className="rounded-lg!">
          Publish Project
        </Button>
      </div>
    </div>
  );
}
