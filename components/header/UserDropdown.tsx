"use client";

import { Progress, Switch } from "antd";
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
  DollarSign,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserMode } from "@/context/UserModeContext";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface UserDropdownProps {
  onClose?: () => void;
}

interface MenuItem {
  key: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  path: string;
}

// Buyer-specific menu items
const buyerMenuItems: MenuItem[] = [
  { key: 'profile', icon: UserRoundPen, label: 'Profile', path: '/my-profile' },
  { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/user/dashboard' },
  { key: 'my-orders', icon: ShoppingCart, label: 'My Orders', path: '/user/order-list' },
  { key: 'purchased-products', icon: Package, label: 'Purchased Products', path: '/user/purchased-products' },
  { key: 'posted-jobs', icon: Briefcase, label: 'Posted Jobs', path: '/user/job-list' },
  { key: 'favorites', icon: Heart, label: 'Favorites', path: '/user/favorites-list' },
  { key: 'refund-list', icon: ReceiptText, label: 'Refund Requests', path: '/user/refund-list' },
];

// Seller-specific menu items
const sellerMenuItems: MenuItem[] = [
  { key: 'profile', icon: UserRoundPen, label: 'Profile', path: '/my-profile' },
  { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/seller/dashboard' },
  { key: 'finance', icon: DollarSign, label: 'Finance', path: '/seller/finance' },
  { key: 'my-services', icon: Briefcase, label: 'My Services', path: '/seller/service-list' },
  { key: 'my-products', icon: Package, label: 'My Products', path: '/seller/product-list' },
  { key: 'orders', icon: ShoppingCart, label: 'Orders', path: '/seller/order-list' },
  { key: 'refund-list', icon: ReceiptText, label: 'Refund Requests', path: '/seller/refund-list' },
  { key: 'tax-info', icon: FileText, label: 'Tax Information', path: '/seller/tax-info' },
];

// Buyer secondary items (includes "Become a Seller")
const buyerSecondaryItems: MenuItem[] = [
  { key: 'pricing', icon: BadgeDollarSign, label: 'Pricing', path: '/pricing' },
  { key: 'become-seller', icon: Store, label: 'Become a Seller', path: '/become-seller' },
  { key: 'settings', icon: Settings, label: 'Settings', path: '/settings/security' },
  { key: 'forum', icon: UsersRound, label: 'Discussion', path: '/forum/questions' },
  { key: 'support', icon: Headset, label: 'Support', path: '/support-requests' },
  { key: 'blog', icon: BookOpen, label: 'Blog', path: '/blog' },
];

// Seller secondary items (no "Become a Seller")
const sellerSecondaryItems: MenuItem[] = [
  { key: 'pricing', icon: BadgeDollarSign, label: 'Pricing', path: '/pricing' },
  { key: 'settings', icon: Settings, label: 'Settings', path: '/settings/security' },
  { key: 'forum', icon: UsersRound, label: 'Discussion', path: '/forum/questions' },
  { key: 'support', icon: Headset, label: 'Support', path: '/support-requests' },
  { key: 'blog', icon: BookOpen, label: 'Blog', path: '/blog' },
];

export function UserDropdown({ onClose }: UserDropdownProps) {
  const router = useRouter();
  const { userMode, setUserMode, isSeller } = useUserMode();
  const { logout } = useAuth();

  // Get menu items based on current mode
  const menuItems = isSeller ? sellerMenuItems : buyerMenuItems;
  const secondaryItems = isSeller ? sellerSecondaryItems : buyerSecondaryItems;

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose?.();
  };

  const handleModeSwitch = (checked: boolean) => {
    const newMode = checked ? 'SELLER' : 'BUYER';
    setUserMode(newMode);

    // Navigate to appropriate page
    if (checked) {
      router.push('/seller/dashboard');
      toast.success('Switched to Selling mode');
    } else {
      router.push('/');
      toast.success('Switched to Buying mode');
    }
    onClose?.();
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
    onClose?.();
  };

  return (
    <div className="w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
      {/* User Info */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <p className="text-[15px] font-semibold text-black dark:text-gray-100 leading-5">
          Naeem Khan
        </p>
        <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-5">
          naeem@domain.com
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isSeller ? 'Switch to Buying' : 'Switch to Selling'}
            </span>
          </div>
          <Switch
            size="small"
            checked={isSeller}
            onChange={handleModeSwitch}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1 pl-6">
          Currently in {isSeller ? 'Selling' : 'Buying'} mode
        </p>
      </div>

      {/* Credit Balance */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div
            className="flex items-center justify-between cursor-pointer transition-all duration-150 ease-in-out hover:opacity-80"
            onClick={() => handleNavigation('/connect')}
          >
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Credit Balance
            </p>
            <div className="flex items-center gap-px">
              <p className="text-sm font-normal text-gray-500">
                5 left
              </p>
              <ChevronRight size={14} className="text-gray-400" />
            </div>
          </div>
          <Progress percent={30} size="small" className="mt-2" />
          <div className="flex items-center gap-1.5 mt-1">
            <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
            <p className="text-xs text-gray-400">
              Daily credits reset at midnight UTC
            </p>
          </div>
        </div>
      </div>

      {/* Primary Menu Items */}
      <div className="py-2">
        {menuItems.map((item) => (
          <div
            key={item.key}
            className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => handleNavigation(item.path)}
          >
            <item.icon size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 dark:border-gray-700" />

      {/* Secondary Menu Items */}
      <div className="py-2">
        {secondaryItems.map((item) => (
          <div
            key={item.key}
            className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => handleNavigation(item.path)}
          >
            <item.icon size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 dark:border-gray-700" />

      {/* Logout */}
      <div className="py-2">
        <div
          className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={handleLogout}
        >
          <LogOut size={18} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Logout
          </span>
        </div>
      </div>
    </div>
  );
}
