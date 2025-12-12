"use client";

import { Textarea } from "@/components/ui/textarea";
import { CheckOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, Select } from "antd";
import { SquareArrowOutUpRight, UserCog } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AccountSettings() {
  const [activeLanguage, setactiveLanguage] = useState("English");
  const url = "https://i.pravatar.cc/150?img=3";

  return (
    <>
      <div className="max-w-3xl m-auto">
        <div className="border-b border-gray-200 pb-4 mb-8">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <UserCog size={21} className="shrink-0" />
            <span>Account Settings</span>
          </h3>
          <div className="text-gray-600">
            Update your profile and account details...
          </div>
        </div>

        <div className="flex justify-between items-center gap-2 border-b border-gray-200 pb-4 mb-4">
          <div className="flex-1">
            <div className="font-semibold text-[15px]">Your avatar</div>
            <div className="text-gray-600">
              Your avatar is displayed here. You can update it by connecting an
              identity provider or it will be generated automatically.
            </div>
          </div>
          <div className="w-[45%] text-end">
            <Avatar size={50} className="" src={url} />
          </div>
        </div>
        <div className="flex justify-between items-center gap-2 border-b border-gray-200 pb-4 mb-4">
          <div className="flex-1">
            <div className="font-semibold text-[15px]">Username</div>
            <div className="text-gray-600">
              This is your unique username used to identify your account.
            </div>
          </div>
          <div className="w-[45%] text-end">
            <Input defaultValue="john_doe" placeholder="" />
            <Link
              href="https://packmycode.com/john_doe"
              target="_blank"
              className="text-sm text-gray-500! hover:underline! hover:text-gray-700! inline-flex items-center gap-1 mt-1"
            >
              https://packmycode.com/john_doe
              <SquareArrowOutUpRight size={14} />
            </Link>
          </div>
        </div>
        <div className="flex justify-between items-center gap-2 border-b border-gray-200 pb-4 mb-4">
          <div className="flex-1">
            <div className="font-semibold text-[15px]">Email</div>
            <div className="text-gray-600">
              Update the email address associated with your account.
            </div>
          </div>
          <div className="w-[45%] text-end">
            <Input
              placeholder="naeem0955@gmail.com"
              defaultValue="naeem0955@gmail.com"
              disabled
            />
          </div>
        </div>
        <div className="flex justify-between items-center gap-2 border-b border-gray-200 pb-4 mb-4">
          <div className="flex-1">
            <div className="font-semibold text-[15px]">Name</div>
            <div className="text-gray-600">
              Update the name associated with your account.
            </div>
          </div>
          <div className="w-[45%] text-end">
            <Input placeholder="John Doe" defaultValue="John Doe" />
          </div>
        </div>
        <div className="flex justify-between items-center gap-2 border-b border-gray-200 pb-4 mb-4">
          <div className="flex-1">
            <div className="font-semibold text-[15px]">Description</div>
            <div className="text-gray-600">
              A brief description or bio for your account.
            </div>
          </div>
          <div className="w-[45%] text-end">
            <Textarea placeholder="A short bio about yourself" rows={3} />
          </div>
        </div>

        <div className="flex justify-between items-center gap-2 border-b border-gray-200 pb-4 mb-4">
          <div className="flex-1">
            <div className="font-semibold text-[15px]">Language</div>
            <div className="text-gray-600">
              Select your preferred language for the application.
            </div>
          </div>
          <div className="w-[45%] text-end">
            <Select
              value={activeLanguage}
              onChange={(value) => setactiveLanguage(value)}
              popupStyle={{ width: 200 }}
              optionLabelProp="label"
              placement="bottomRight"
            >
              <Select.Option value="English">
                <div className="flex items-center justify-between w-full">
                  <div>English</div>
                  {activeLanguage === "English" && (
                    <CheckOutlined className="text-red-500!" />
                  )}
                </div>
              </Select.Option>
              <Select.Option value="日本語 (プレビュー版)">
                <div className="flex items-center justify-between w-full">
                  <div>日本語 (プレビュー版)</div>
                  {activeLanguage === "日本語 (プレビュー版)" && (
                    <CheckOutlined className="text-red-500!" />
                  )}
                </div>
              </Select.Option>
              <Select.Option value="Español (Beta)">
                <div className="flex items-center justify-between w-full">
                  <div>Español (Beta)</div>
                  {activeLanguage === "Español (Beta)" && (
                    <CheckOutlined className="text-red-500!" />
                  )}
                </div>
              </Select.Option>
            </Select>
          </div>
        </div>
        <div className="flex justify-between items-center gap-2 pb-4 mb-4">
          <div className="flex-1">
            <div className="font-semibold text-[15px]">Delete account</div>
            <div className="text-gray-600">
              Permanently delete your account and all associated data.
            </div>
          </div>
          <div className="w-[45%] text-end">
            <Button
              color="danger"
              variant="outlined"
              onClick={() => console.log("Delete clicked")}
            >
              Delete account
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
