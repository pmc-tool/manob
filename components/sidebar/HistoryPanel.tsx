"use client";

import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, FolderPlus, Search } from "lucide-react";
import Link from "next/link";
import { forwardRef } from "react";

interface HistoryPanelProps {
  open: boolean;
}

const projectLinks = [
  { label: "Search", icon: <Search size={18} />, href: "#" },
  { label: "Projects", icon: <FolderPlus size={18} />, href: "#" },
  { label: "Recent Chats", icon: <Clock size={18} />, href: "#" },
];

const historyItems = [
  "Nano Banana Pro Playground",
  "Storefront w/Nano Banana + AI SDK + AI Gateway",
  "Brillance SaaS Landing Page",
  "Brillance SaaS Landing Page (2)",
  "Pointer AI landing page",
  "Separate user dropdown component",
  "Ecommerce Admin Dashboard",
  "AI Content Generator",
  "Portfolio Modern UI",
  "Chatbot Integration Demo",
];

const HistoryPanel = forwardRef<HTMLDivElement, HistoryPanelProps>(
  ({ open }, ref) => {
    return (
      <AnimatePresence>
        {open && (
          <motion.div
            ref={ref}
            className="absolute left-[67px] top-0 h-full w-72 bg-white rounded-mdxl z-50 p-4 border border-gray-200 overflow-y-auto shadow-lg"
            initial={{ x: -367 }}
            animate={{ x: 0 }}
            exit={{ x: -367 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
          >
            <div className="mb-5">
              <Button block icon={<PlusOutlined />}>
                New Chat
              </Button>
            </div>

            {/* PROJECTS */}
            <div className="mb-5">
              <h2 className="text-[13px] text-gray-600 font-medium mb-1.5 mx-2">
                Projects
              </h2>

              {projectLinks.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-gray-100! whitespace-nowrap overflow-hidden text-ellipsis text-[0.906rem] text-gray-800!"
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* HISTORY */}
            <div className="mb-5">
              <h2 className="text-[13px] text-gray-600 font-medium mb-1.5 mx-2">
                History
              </h2>

              <div className="flex flex-col">
                {historyItems.map((name, idx) => (
                  <Link
                    key={idx}
                    href="#"
                    className="px-2 py-1.5 rounded-md hover:bg-gray-100! whitespace-nowrap overflow-hidden text-ellipsis text-[0.906rem] text-gray-800!"
                  >
                    {name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

HistoryPanel.displayName = "HistoryPanel";
export default HistoryPanel;
