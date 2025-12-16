"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { X, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import styles from "./SellerRegistration.module.css";

type MenuItem = {
  href: string;
  label: string;
};

const menuItems: MenuItem[] = [
  { href: "/blog", label: "Blogs" },
  { href: "/help", label: "FAQs" },
  { href: "/support-requests", label: "Support" },
  { href: "/forum/questions", label: "Discussion Forum" },
];

export function SellerHeader() {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);
  const { user } = useAuth();

  const toggleFilter = () => {
    setIsActive(!isActive);
    if (!isActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  const closeSidebarNav = () => {
    setIsActive(false);
    document.body.style.overflow = "";
  };

  return (
    <>
      {/* Desktop Nav */}
      <nav className={`${styles.sellerHeader} hidden lg:block`}>
        <div className="container mx-auto px-4 lg:px-10">
          <div className={styles.sellerHeaderInner}>
            <Link href="/">
              <img src="/images/logo-manob.png" height={20} alt="manob.ai" />
            </Link>
            <ul className={styles.navLinks}>
              {menuItems.map((menu, index) => (
                <li key={index}>
                  <Link
                    className={`${styles.navLink} ${
                      pathname === menu.href ? "text-primary" : ""
                    }`}
                    href={menu.href}
                  >
                    {menu.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/my-profile">
              <Image
                src={user?.profile_image || "/images/become-seller/become_sellerProfile.png"}
                alt="Seller Profile"
                height={40}
                width={40}
                className={styles.userAvatar}
              />
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div className={`${styles.mobileHeader} lg:hidden`}>
        <Link href="/">
          <img src="/images/logo-manob.png" height={20} alt="manob.ai" />
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/my-profile">
            <Image
              src={user?.profile_image || "/images/become-seller/become_sellerProfile.png"}
              alt="Seller Profile"
              height={36}
              width={36}
              className={styles.userAvatar}
            />
          </Link>
          <button
            className={styles.mobileMenuBtn}
            onClick={toggleFilter}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white flex flex-col ${
          isActive ? "translate-x-0" : ""
        }`}
        style={{
          width: "280px",
          zIndex: 1050,
          transform: isActive ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
        }}
      >
        <div className="flex justify-between items-center p-3 border-b">
          <Link href="/">
            <img src="/images/logo-manob.png" height={20} alt="manob.ai" />
          </Link>
          <button
            className="p-0 bg-transparent border-0 hover:opacity-70"
            onClick={closeSidebarNav}
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-3 flex-grow overflow-auto">
          <ul className="list-none p-0 m-0">
            {menuItems.map((menu, index) => (
              <li key={index} className="mb-3">
                <Link
                  href={menu.href}
                  className={`no-underline ${
                    pathname === menu.href ? "text-primary font-semibold" : "text-gray-900"
                  }`}
                  onClick={closeSidebarNav}
                >
                  {menu.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-3 border-t">
          <div className="flex flex-col gap-2" style={{ fontSize: "13px" }}>
            <Link href="/terms" className="text-gray-500 no-underline hover:text-primary">
              Terms of service
            </Link>
            <Link href="/privacy-policy" className="text-gray-500 no-underline hover:text-primary">
              Privacy policy
            </Link>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isActive && (
        <div
          className="fixed top-0 left-0 w-full h-full"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1040,
          }}
          onClick={closeSidebarNav}
        />
      )}
    </>
  );
}
