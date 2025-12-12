"use client";

import {
  GiftOutlined,
  GithubOutlined,
  LogoutOutlined,
  PlusOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps, UploadProps } from "antd";
import {
  Avatar,
  Button,
  Collapse,
  Dropdown,
  Input,
  Select,
  Space,
  Tooltip,
  Upload,
  message
} from "antd";
import { ChevronDown, Info } from "lucide-react";
import { useState } from "react";

const { Panel } = Collapse;
const { TextArea } = Input;
const { Dragger } = Upload;

export default function Header() {
  const [subdomain, setSubdomain] = useState("");

  const menuItems: MenuProps["items"] = [
    {
      type: "group",
      key: "user-card",
      label: (
        <div className="w-64 ">
          <p className="text-[14px] font-semibold text-gray-900 dark:text-gray-100">
            Naeem Khan
          </p>
          <p className="text-[14px] text-gray-500 dark:text-gray-400">
            naeem@domain.com
          </p>
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: <span className="text-gray-700 dark:text-gray-300">Profile</span>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: <span className="text-gray-700 dark:text-gray-300">Logout</span>,
    },
  ];

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

  // Publish dropdown content
  const publishContent = (
    <div className="w-[450px] p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Publish
      </p>
      <p className="text-gray-700 text-sm mb-4">
        Make your project live and track its performance.
      </p>

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
          // Show Discard & Save buttons when typing
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
          // Show Add Custom Domain button when input is empty
          <Button
            color="default"
            variant="outlined"
            block
            icon={<PlusOutlined style={{ fontSize: "13px" }} />}
          >
            <span className="text-[13px]">Add Custom Domain</span>
          </Button>
        )}
      </div>
      <div className="p-4 bg-[#f8f4f3] mb-2 rounded-xl">
        <div className="border-b pb-2 mb-3 border-gray-200">
          <div className="text-sm font-semibold">Publish as Template Info</div>
          <div className="mb-0 text-[13px] text-gray-700">
            Share your project as a reusable template for others.
          </div>
        </div>
        <div>
          <div className="mb-3">
            <div className="text-xs mb-1 font-medium flex items-center gap-1">
              Template Name
              <Tooltip title="Enter a name for your template">
                <Info className="w-3 h-3 text-gray-400 cursor-pointer" />
              </Tooltip>
            </div>
            <Input placeholder="Icon & Title" />
          </div>

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
      </div>

      {/* Accordion */}
      {/* <Collapse>
        <Panel header="Publish as Template" key="1">
          <div className="mb-2">
            <p className="text-sm font-medium">Update a Template</p>
            <p className="text-xs text-gray-500">
              Update the details of this template
            </p>
          </div>
          <Input placeholder="Icon & Title" className="mb-2" />
          <TextArea placeholder="Description" rows={3} className="mb-2" />
          <Upload>
            <Button icon={<UploadOutlined />}>Share Image</Button>
          </Upload>
        </Panel>
      </Collapse> */}

      {/* Access */}
      <div className="p-4 bg-[#f8f4f3] mb-2 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold flex-1">Who can access?</div>
          <Select
            defaultValue="Anyone"
            popupStyle={{ width: 200 }}
            optionLabelProp="label" // Use the label prop for selected display
            placement="bottomRight"
          >
            <Select.Option
              value="Anyone"
              label={
                <div className="flex items-center gap-2">
                  <UserOutlined />
                  <span>Anyone</span>
                </div>
              }
            >
              {/* Dropdown content */}
              <div className="flex gap-2">
                <UserOutlined />
                <div className="flex-1">
                  <div>Anyone</div>
                  <div className="text-xs text-gray-500 font-medium">
                    Anyone can access
                  </div>
                </div>
              </div>
            </Select.Option>

            <Select.Option
              value="Workspace"
              label={
                <div className="flex items-center gap-2">
                  <GithubOutlined />
                  <span>Workspace</span>
                </div>
              }
            >
              <div className="flex gap-2">
                <GithubOutlined />
                <div className="flex-1">
                  <div>Workspace</div>
                  <div className="text-xs text-gray-500 font-medium">
                    Only workspace members
                  </div>
                </div>
              </div>
            </Select.Option>
          </Select>

          {/* <Select
          defaultValue="Anyone"
          className="flex-1"
          style={{ width: "100%" }}
        >
          <Select.Option
            value="Anyone"
            label={
              <div className="flex items-center gap-2">
                <UserOutlined className="text-gray-500" />
                <div className="flex flex-col">
                  <span>Anyone</span>
                  <span className="text-xs text-gray-400">
                    Anyone can access
                  </span>
                </div>
              </div>
            }
          >
            <div className="flex items-center gap-2">
              <UserOutlined className="text-gray-500" />
              <div className="flex flex-col">
                <span>Anyone</span>
                <span className="text-xs text-gray-400">Anyone can access</span>
              </div>
            </div>
          </Select.Option>

          <Select.Option
            value="Workspace"
            label={
              <div className="flex items-center gap-2">
                <GithubOutlined className="text-gray-500" />
                <div className="flex flex-col">
                  <span>Workspace</span>
                  <span className="text-xs text-gray-400">
                    Only workspace members
                  </span>
                </div>
              </div>
            }
          >
            <div className="flex items-center gap-2">
              <GithubOutlined className="text-gray-500" />
              <div className="flex flex-col">
                <span>Workspace</span>
                <span className="text-xs text-gray-400">
                  Only workspace members
                </span>
              </div>
            </div>
          </Select.Option>
        </Select> */}
        </div>
      </div>
      <div className="mt-3">
        <Button type="primary" className="w-full">
          Publish Project
        </Button>
      </div>
    </div>
  );
  return (
    <>
      {/* LEFT SIDE */}
      <button className="group flex items-center gap-2 border-none text-foreground outline-none duration-150 ease-in-out hover:opacity-80 focus:outline-none md:min-w-0 md:shrink">
        {/* Logo */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height={30}
          viewBox="0 0 250 141"
          fill="none"
        >
          <g clipPath="url(#clip0_18716_20435)">
            <path
              d="M140.947 58.3715C150.767 120.782 81.1271 164.432 28.7171 126.732C-34.4229 81.3115 15.3771 -19.9385 92.7771 3.46151C97.1071 4.77151 117.067 13.9615 117.017 18.1415C117.007 18.9615 108.117 31.2215 107.327 31.4615C105.267 32.0815 96.5971 25.2315 93.3471 23.7415C51.1271 4.37151 6.97707 43.9215 22.0171 87.7015C35.6571 127.432 91.2571 134.222 114.397 99.0015C118.107 93.3615 119.787 86.5515 123.157 80.8915C127.597 73.4515 135.387 65.2015 140.957 58.3615L140.947 58.3715Z"
              fill="#010101"
            />
            <path
              d="M107.976 59.8629C113.336 9.59295 175.466 -15.6471 216.806 11.2829C278.956 51.7729 245.306 147.213 168.446 139.803C162.406 139.223 133.726 129.263 133.246 123.443C133.116 121.823 142.046 109.363 143.446 109.263C166.836 127.593 199.776 126.163 218.876 102.543C254.016 59.0829 203.186 -2.42705 152.936 25.0829C133.176 35.9029 133.446 48.1129 122.796 64.6429C120.306 68.5029 113.516 78.4629 110.506 81.2329C109.076 82.5429 107.996 81.2829 107.996 80.7229C107.996 74.2329 107.336 66.0829 107.996 59.8629H107.976Z"
              fill="#E32026"
            />
          </g>
        </svg>

        {/* Title */}
        <div className="flex w-full min-w-0 flex-col items-start gap-0 truncate">
          <div className="flex min-w-0 items-center gap-1 truncate">
            <p className="hidden min-w-0 truncate text-sm font-medium leading-none md:block">
              My Digital Showcase
            </p>
            <ChevronDown className="h-3 w-3 text-foreground/50" />
          </div>
          <p className="hidden w-full min-w-0 truncate text-left text-xs text-muted-foreground md:flex">
            Previewing last saved version
          </p>
        </div>
      </button>

      {/* RIGHT SIDE ACTIONS */}
      <div className="flex items-center gap-1.5 ms-auto">
        <Button
          size="small"
          color="default"
          variant="outlined"
          icon={<GiftOutlined />}
        >
          Refer
        </Button>

        <Tooltip title="Connect to branch">
          <Button
            icon={<GithubOutlined />}
            color="default"
            variant="outlined"
            size="small"
          />
        </Tooltip>

        <Button color="default" variant="outlined" size="small">
          Share
        </Button>

        {/* <Button color="primary" variant="solid" size="small">
          Publish
        </Button> */}
        {/* PUBLISH DROPDOWN */}
        <Dropdown
          trigger={["click"]}
          dropdownRender={() => publishContent}
          placement="bottomRight"
          arrow
        >
          <Button type="primary" size="small">
            Publish
          </Button>
        </Dropdown>

        {/* USER DROPDOWN (NOT DEPRECATED) */}
        <Dropdown
          menu={{ items: menuItems }}
          trigger={["click"]}
          rootClassName="custom-dropdown-shadow"
        >
          <div className="cursor-pointer">
            <Avatar
              size="small"
              src="https://i.pravatar.cc/150?img=3"
              className="border border-gray-300 dark:border-neutral-600"
            />
          </div>
        </Dropdown>
      </div>
    </>
  );
}
