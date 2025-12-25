"use client";

import {
  Activity,
  BotMessageSquare,
  Briefcase,
  DollarSign,
  History,
  Home,
  LayoutDashboard,
  Mail,
  ReceiptText,
  Settings,
  SplinePointer,
  Store,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useSettingsModal } from "@/context/SettingsModalContext";
import { useUserMode } from "@/context/UserModeContext";
import HistoryPanel from "./HistoryPanel";

export default function ProjectSidebar() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [openHistory, setOpenHistory] = useState(false);
  const { openModal } = useSettingsModal();
  const { isSeller } = useUserMode();
  const router = useRouter();

  const panelRef = useRef<HTMLDivElement>(null);

  const handleClick = (tab: string, path?: string) => {
    setActiveTab(tab);

    if (tab === "history") {
      setOpenHistory(!openHistory);
    } else {
      setOpenHistory(false);
    }

    if (path) {
      router.push(path);
    }
  };

  // CLICK OUTSIDE to close HISTORY panel
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        openHistory &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        setOpenHistory(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openHistory]);

  const buttonClass = (tab: string) =>
    `flex flex-col items-center justify-center gap-0.5 text-[0.719rem] leading-4 group/sidebar-item cursor-pointer
     ${
       activeTab === tab ? "text-v0 font-semibold" : "text-gray-700 font-medium"
     }
    `;

  const iconClass = (tab: string) =>
    `p-1.5 rounded-md ${
      activeTab === tab
        ? "bg-v0-alpha-500"
        : "group-hover/sidebar-item:bg-v0-alpha-400"
    }`;

  // Buyer menu items
  const buyerMenuItems = [
    { key: "home", icon: Home, label: "Home", path: "/" },
    { key: "chat", icon: BotMessageSquare, label: "Chat", path: "/projects" },
    { key: "design", icon: SplinePointer, label: "Design", path: undefined },
    { key: "marketplace", icon: Store, label: "Market", path: "/marketplace" },
    { key: "market2", icon: Activity, label: "Market 2", path: "/market-2" },
    { key: "hire", icon: Briefcase, label: "Hire", path: "/job-list" },
    { key: "history", icon: History, label: "History", path: undefined },
  ];

  // Seller menu items
  const sellerMenuItems = [
    { key: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/seller/dashboard" },
    { key: "jobs", icon: Briefcase, label: "Jobs", path: "/job-list" },
    { key: "finance", icon: DollarSign, label: "Finance", path: "/seller/finance" },
    { key: "marketplace", icon: Store, label: "Market", path: "/marketplace" },
    { key: "activities", icon: Activity, label: "Activities", path: "/seller/activities" },
    { key: "refund", icon: ReceiptText, label: "Refund", path: "/seller/refund-list" },
    { key: "history", icon: History, label: "History", path: undefined },
  ];

  // Get menu items based on mode
  const menuItems = isSeller ? sellerMenuItems : buyerMenuItems;

  return (
    <div className="relative" style={{ zIndex: 50, overflow: 'visible', height: '100%' }}>
      {/* SIDEBAR */}
      <div className="flex-col h-full p-2 flex min-w-16 pl-0 bg-white rounded-xl justify-between">
        <div className="flex flex-col gap-2.5">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleClick(item.key, item.path)}
              className={buttonClass(item.key)}
            >
              <div className={iconClass(item.key)}>
                <item.icon size={22} />
              </div>
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-2.5">
          <button
            onClick={() => handleClick("settings", "/settings/security")}
            className={buttonClass("settings")}
          >
            <div className={iconClass("settings")}>
              <Settings size={22} />
            </div>
            Settings
          </button>

          <button
            onClick={() => handleClick("inbox", "/chat")}
            className={buttonClass("inbox")}
          >
            <div className={iconClass("inbox")}>
              <Mail size={22} />
            </div>
            Inbox
          </button>
        </div>
      </div>

      {/* HISTORY PANEL */}
      <HistoryPanel ref={panelRef} open={openHistory} />
    </div>
  );
}
