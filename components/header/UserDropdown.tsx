"use client";

import type { MenuProps } from "antd";
import { Progress } from "antd";
import {
  BadgeDollarSign,
  BookOpen,
  Briefcase,
  ChevronRight,
  Headset,
  Heart,
  LayoutDashboard,
  LogOut,
  Package,
  ReceiptText,
  Settings,
  ShoppingCart,
  Store,
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
            <p className="text-base font-normal md:text-sm text-gray-500-foreground">
              5 left
            </p>
            <ChevronRight size={14} />
          </div>
        </div>

        <Progress percent={30} />
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
          <p className="text-xs text-gray-500-foreground">
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
    key: "dashboard",
    icon: <LayoutDashboard size={18} />,
    label: <span className="dark:text-gray-300 font-medium">Dashboard</span>,
  },
  {
    key: "my-orders",
    icon: <ShoppingCart size={18} />,
    label: <span className="dark:text-gray-300 font-medium">My Orders</span>,
  },
  {
    key: "purchased-products",
    icon: <Package size={18} />,
    label: <span className="dark:text-gray-300 font-medium">Purchased Products</span>,
  },
  {
    key: "posted-jobs",
    icon: <Briefcase size={18} />,
    label: <span className="dark:text-gray-300 font-medium">Posted Jobs</span>,
  },
  {
    key: "favorites",
    icon: <Heart size={18} />,
    label: <span className="dark:text-gray-300 font-medium">Favorites</span>,
  },
  {
    key: "refund-list",
    icon: <ReceiptText size={18} />,
    label: <span className="dark:text-gray-300 font-medium">Refund Requests</span>,
  },

  { type: "divider" },

  {
    key: "pricing",
    icon: <BadgeDollarSign size={18} />,
    label: <span className="dark:text-gray-300 font-medium">Pricing</span>,
  },
  {
    key: "become-seller",
    icon: <Store size={18} />,
    label: <span className="dark:text-gray-300 font-medium">Become a Seller</span>,
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
      <span className="dark:text-gray-300 font-medium">Discussion</span>
    ),
  },
  {
    key: "support",
    icon: <Headset size={18} />,
    label: <span className="dark:text-gray-300 font-medium">Support</span>,
  },
  {
    key: "blog",
    icon: <BookOpen size={18} />,
    label: <span className="dark:text-gray-300 font-medium">Blog</span>,
  },

  { type: "divider" },

  {
    key: "logout",
    icon: <LogOut size={18} />,
    label: <span className="dark:text-gray-300 font-medium">Logout</span>,
  },
];
