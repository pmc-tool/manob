"use client";

import { GiftOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown } from "antd";
import { ChevronDown, Bell, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PublishDropdown } from "./PublishDropdown"; // Import the separate component
import { userMenuItems } from "./UserDropdown";
import { useRenameModal } from "@/context/RenameModalContext";
import { useState } from "react";
import { NotificationDropdown } from "@/components/pmc-migrated/notifications";
import { mockNotifications, getUnseenCount } from "@/lib/mocks/notifications.mock";
import { ReferralPopup } from "@/components/pmc-migrated/referral";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function Header() {
  const { openRenameModal } = useRenameModal();
  const [publishDropdownOpen, setPublishDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [referralPopupOpen, setReferralPopupOpen] = useState(false);
  const router = useRouter();
  const { getCartItemCount } = useCart();
  const { logout } = useAuth();

  const unseenCount = getUnseenCount(mockNotifications);
  const cartCount = getCartItemCount();

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'profile':
        router.push('/my-profile');
        break;
      case 'dashboard':
        router.push('/dashboard');
        break;
      case 'settings':
        router.push('/settings/security');
        break;
      case 'pricing':
        router.push('/pricing');
        break;
      case 'become-seller':
        router.push('/become-seller');
        break;
      case 'forum':
        router.push('/forum/questions');
        break;
      case 'support':
        router.push('/support-requests');
        break;
      case 'blog':
        router.push('/blog');
        break;
      case 'logout':
        logout();
        toast.success('Logged out successfully');
        router.push('/');
        break;
    }
  };

  return (
    <div className="flex items-center w-full">
      {/* LEFT SIDE: Logo + Title */}
      <Link href="/" className="group flex items-center gap-2 border-none text-foreground outline-none duration-150 ease-in-out hover:opacity-80 focus:outline-none md:min-w-0 md:shrink">
        {/* Logo */}
        <Image
          src="/images/logo-manob-full.svg"
          alt="manob.ai"
          width={120}
          height={34}
          style={{ objectFit: 'contain' }}
        />
      </Link>

      {/* RIGHT SIDE ACTIONS */}
      <div className="flex items-center gap-1.5 ms-auto">
        <Button
          size="small"
          color="default"
          variant="outlined"
          icon={<GiftOutlined />}
          onClick={() => setReferralPopupOpen(true)}
        >
          Refer
        </Button>
        {/* Notification Bell */}
        <Dropdown
          trigger={["click"]}
          open={notificationDropdownOpen}
          onOpenChange={(open) => setNotificationDropdownOpen(open)}
          popupRender={() => (
            <NotificationDropdown onClose={() => setNotificationDropdownOpen(false)} />
          )}
          placement="bottomRight"
        >
          <div className="relative cursor-pointer">
            <Button
              color="default"
              variant="outlined"
              size="small"
              icon={<Bell className="h-4 w-4" />}
            />
            {unseenCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[11px] font-semibold text-white bg-red-500 rounded-full flex items-center justify-center">
                {unseenCount > 99 ? '99+' : unseenCount}
              </span>
            )}
          </div>
        </Dropdown>
        {/* Cart Icon */}
        <div className="relative cursor-pointer" onClick={() => router.push('/cart')}>
          <Button
            color="default"
            variant="outlined"
            size="small"
            icon={<ShoppingCart className="h-4 w-4" />}
          />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[11px] font-semibold text-white bg-primary rounded-full flex items-center justify-center">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </div>
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

        {/* Referral Popup */}
        <ReferralPopup
          open={referralPopupOpen}
          onClose={() => setReferralPopupOpen(false)}
        />
      </div>
    </div>
  );
}
