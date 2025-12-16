"use client";

import {
  Activity,
  BotMessageSquare,
  Briefcase,
  History,
  Home,
  Mail,
  Settings,
  SplinePointer,
  Store,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useSettingsModal } from "@/context/SettingsModalContext";
import HistoryPanel from "./HistoryPanel";

export default function ProjectSidebar() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [openHistory, setOpenHistory] = useState(false);
  const { openModal } = useSettingsModal();
  const router = useRouter();

  const panelRef = useRef<HTMLDivElement>(null);

  const handleClick = (tab: string) => {
    setActiveTab(tab);

    if (tab === "history") {
      setOpenHistory(!openHistory);
    } else {
      setOpenHistory(false);
    }

    if (tab === "settings") {
      router.push("/settings/security");
    }

    if (tab === "marketplace") {
      router.push("/marketplace");
    }

    if (tab === "market2") {
      router.push("/market-2");
    }

    if (tab === "chat") {
      router.push("/projects");
    }

    if (tab === "inbox") {
      router.push("/chat");
    }

    if (tab === "hire") {
      router.push("/job-list");
    }

    if (tab === "home") {
      router.push("/");
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

  return (
    <div className="relative" style={{ zIndex: 50, overflow: 'visible', height: '100%' }}>
      {/* SIDEBAR */}
      <div className="flex-col h-full p-2 flex min-w-16 pl-0 bg-white rounded-xl justify-between">
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => handleClick("home")}
            className={buttonClass("home")}
          >
            <div className={iconClass("home")}>
              <Home size={22} />
            </div>
            Home
          </button>

          <button
            onClick={() => handleClick("chat")}
            className={buttonClass("chat")}
          >
            <div className={iconClass("chat")}>
              <BotMessageSquare size={23} />
            </div>
            Chat
          </button>

          <button className={buttonClass("design")}>
            <div className={iconClass("design")}>
              <SplinePointer size={23} />
            </div>
            Design
          </button>

          <button
            onClick={() => handleClick("marketplace")}
            className={buttonClass("marketplace")}
          >
            <div className={iconClass("marketplace")}>
              <Store size={22} />
            </div>
            Market
          </button>

          <button
            onClick={() => handleClick("market2")}
            className={buttonClass("market2")}
          >
            <div className={iconClass("market2")}>
              <Activity size={22} />
            </div>
            Market 2
          </button>

          <button
            onClick={() => handleClick("hire")}
            className={buttonClass("hire")}
          >
            <div className={iconClass("hire")}>
              <Briefcase size={22} />
            </div>
            Hire
          </button>

          <button
            onClick={() => handleClick("history")}
            className={buttonClass("history")}
          >
            <div className={iconClass("history")}>
              <History size={22} />
            </div>
            History
          </button>
        </div>

        <div className="mt-auto flex flex-col gap-2.5">
          <button
            onClick={() => handleClick("settings")}
            className={buttonClass("settings")}
          >
            <div className={iconClass("settings")}>
              <Settings size={22} />
            </div>
            Settings
          </button>

          <button
            onClick={() => handleClick("inbox")}
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
