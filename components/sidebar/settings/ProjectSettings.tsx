"use client";

import { useRenameModal } from "@/context/RenameModalContext";
import { CheckOutlined, GithubOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Select, Switch } from "antd";
import { useState } from "react";

export default function ProjectSettings() {
  const [access, setAccess] = useState("Anyone");
  const { openRenameModal } = useRenameModal();

  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };

  return (
    <>
      <div className="max-w-3xl m-auto">
        <div className="border-b border-gray-200  pb-4 mb-4">
          <h3 className="text-lg font-semibold">Project Settings</h3>
          <div className="text-gray-600">
            Manage your project details, visibility, and preferences.
          </div>
        </div>

        <div className="flex justify-between items-center gap-2 border-b border-gray-200 pb-4 mb-4">
          <div className="">
            <div className="font-semibold text-[15px]">Who can access?</div>
            <div className="text-gray-600">
              Control the visibility of your project by selecting who can access
              it.
            </div>
          </div>
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
        <div className="flex justify-between items-center gap-2 border-b border-gray-200 pb-4 mb-4">
          <div className="">
            <div className="font-semibold text-[15px]">Rename Project</div>
            <div className="text-gray-600">
              Update your project&#39;s title.
            </div>
          </div>
          <div className="">
            <Button
              onClick={() =>
                openRenameModal({
                  defaultName: "My Project",
                  onRename: (newName) => console.log("Renamed to:", newName),
                })
              }
            >
              Rename Project
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center gap-2 border-b border-gray-200 pb-4 mb-4">
          <div className="">
            <div className="font-semibold text-[15px]">
              Hide &quot;Packmycode&quot; Badge
            </div>
            <div className="text-gray-600">
              Remove the &quot;Powered by Packmycode&quot; badge from your
              project.
            </div>
          </div>
          <div className="">
            <Switch defaultChecked onChange={onChange} />
          </div>
        </div>
        <div className="flex justify-between items-center gap-2 border-b border-gray-200 pb-4 mb-4">
          <div className="">
            <div className="font-semibold text-[15px]">Delete Project</div>
            <div className="text-gray-600">
              Permanently delete this project and all associated data.
            </div>
          </div>
          <div className="">
            <Button
              color="danger"
              variant="outlined"
              onClick={() => console.log("Delete clicked")}
            >
              Delete Project
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
