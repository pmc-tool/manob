"use client";

import type { MenuProps } from "antd";
import { Progress } from "antd";
import {
  BadgeDollarSign,
  ChevronRight,
  LogOut,
  Settings,
  UserRoundPen,
  UsersRound,
} from "lucide-react";

export const userMenuItems: MenuProps["items"] = [
  {
    type: "group",
    key: "user-card",
    label: (
      <div className="w-66">
        <p className="text-[15px] font-semibold text-black dark:text-gray-100 leading-5">
          Naeem Khan
        </p>
        <p className="text-[14px] text-gray-700 dark:text-gray-400 leading-5">
          naeem@domain.com
        </p>
      </div>
    ),
  },
  {
    type: "group",
    key: "credit-card",
    label: (
      <div className="p-4 bg-[#f8f4f3] mb-2 rounded-xl">
        <div className="flex items-center justify-between cursor-pointer transition-all duration-150 ease-in-out hover:opacity-80">
          <p className="text-base font-medium text-foreground md:text-sm">
            Credit Balance
          </p>
          <div className="flex items-center gap-px">
            <p className="text-base font-normal md:text-sm text-muted-foreground">
              5 left
            </p>
            <ChevronRight size={14} />
          </div>
        </div>

        <Progress percent={30} />
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
          <p className="text-xs text-muted-foreground">
            Daily credits reset at midnight UTC
          </p>
        </div>
      </div>
    ),
  },
  { type: "divider" },

  {
    key: "profile",
    icon: <UserRoundPen size={18} />,
    label: <span className="dark:text-gray-300 font-medium">Profile</span>,
  },
  {
    key: "pricing",
    icon: <BadgeDollarSign size={18} />,
    label: <span className="dark:text-gray-300 font-medium">Pricing</span>,
  },
  {
    key: "settings",
    icon: <Settings size={18} />,
    label: <span className="dark:text-gray-300 font-medium">Settings</span>,
  },
  {
    key: "forum",
    icon: <UsersRound size={18} />,
    label: (
      <span className="dark:text-gray-300 font-medium">Community Forum</span>
    ),
  },

  { type: "divider" },

  {
    key: "logout",
    icon: <LogOut size={18} />,
    label: <span className="dark:text-gray-300 font-medium">Logout</span>,
  },
];
