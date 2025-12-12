"use client";

import { Modal } from "antd";
import { CreditCard, Globe, Settings2, UserCog } from "lucide-react";
import { useEffect, useState } from "react";
import ProjectSettings from "./ProjectSettings";
import Pricing from "./Pricing";
import Domains from "./Domains";
import AccountSettings from "./AccountSettings";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  initialTab?: string;
}

const tabs = [
  { name: "Project Settings", icon: Settings2 },
  { name: "Plans & Credits", icon: CreditCard },
  { name: "Domains", icon: Globe },
  { name: "Account Settings", icon: UserCog },
];

export default function SettingsModal({
  open,
  onClose,
  initialTab,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState(initialTab ?? tabs[0].name);
  // Reset activeTab only when modal opens
  useEffect(() => {
    if (open) {
      Promise.resolve().then(() =>
        setActiveTab(initialTab ?? "Project Settings")
      );
    }
  }, [open, initialTab]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      centered
      width={1200}
      footer={null}
      title={null}
      className="setting-modal"
    >
      <div className="flex h-[56vh]">
        {/* SIDEBAR */}
        <div className="w-64 p-3 flex flex-col gap-1 bg-gray-100">
          <h2 className="text-md font-semibold mb-2 text-gray-600 ml-3">
            Settings
          </h2>
          {tabs.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => setActiveTab(name)}
              className={`
                relative flex items-center gap-3 px-3 py-1.5 cursor-pointer rounded-lg font-medium transition text-left
                ${
                  activeTab === name
                    ? "bg-gray-200"
                    : "hover:bg-gray-200 text-gray-800"
                }
              `}
            >
              {activeTab === name && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-v0 rounded-r-full" />
              )}
              <Icon size={20} />
              {name}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 p-6 overflow-y-auto bg-white">
          {activeTab === "Project Settings" && <ProjectSettings />}
          {activeTab === "Plans & Credits" && <Pricing />}
          {activeTab === "Domains" && <Domains />}
          {activeTab === "Account Settings" && <AccountSettings />}
        </div>
      </div>
    </Modal>
  );
}
