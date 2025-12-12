"use client";

import { GiftOutlined, GithubOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Tooltip } from "antd";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { PublishDropdown } from "./PublishDropdown"; // Import the separate component
import { userMenuItems } from "./UserDropdown";
import { LogoIcon } from "../icons/LogoIcon";
import { useRenameModal } from "@/context/RenameModalContext";
import { useState } from "react";

export default function Header() {
  const { openRenameModal } = useRenameModal();
  const [publishDropdownOpen, setPublishDropdownOpen] = useState(false);
  const router = useRouter();

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'profile':
        router.push('/my-profile');
        break;
      case 'dashboard':
        router.push('/dashboard');
        break;
      case 'settings':
        router.push('/dashboard/settings');
        break;
      case 'pricing':
        router.push('/pricing');
        break;
      case 'forum':
        router.push('/forum/questions');
        break;
      case 'support':
        router.push('/support-requests');
        break;
      case 'logout':
        // TODO: Implement logout
        console.log('Logout clicked');
        break;
    }
  };

  return (
    <div className="flex items-center w-full">
      {/* LEFT SIDE: Logo + Title */}
      <button className="group flex items-center gap-2 border-none text-foreground outline-none duration-150 ease-in-out hover:opacity-80 focus:outline-none md:min-w-0 md:shrink">
        {/* Logo */}
        <LogoIcon />
        {/* Title */}
        <div className="flex w-full min-w-0 flex-col items-start gap-0 truncate">
          <div className="flex min-w-0 items-center gap-1 truncate">
            <p
              className="hidden min-w-0 truncate text-sm font-medium leading-none md:block cursor-pointer"
              onClick={() =>
                openRenameModal({
                  defaultName: "My Project",
                  onRename: (newName) => console.log("Renamed to:", newName),
                })
              }
            >
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
        {/* Publish Dropdown */}
        <Dropdown
          trigger={["click"]}
          // popupRender={() => <PublishDropdown />}
          open={publishDropdownOpen}
          onOpenChange={(open) => setPublishDropdownOpen(open)}
          popupRender={() => (
            <PublishDropdown onClose={() => setPublishDropdownOpen(false)} />
          )}
          placement="bottomRight"
          arrow
        >
          <Button type="primary" size="small">
            Publish
          </Button>
        </Dropdown>

        {/* User Dropdown */}
        <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} trigger={["click"]} arrow>
          <div className="cursor-pointer">
            <Avatar
              size="small"
              src="https://i.pravatar.cc/150?img=3"
              className="border border-gray-300 dark:border-neutral-600"
            />
          </div>
        </Dropdown>
      </div>
    </div>
  );
}
