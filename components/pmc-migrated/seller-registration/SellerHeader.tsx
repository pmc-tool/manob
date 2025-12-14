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
      <nav className={`${styles.sellerHeader} d-none d-lg-block`}>
        <div className="container-fluid px-lg-5">
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
      <div className={`${styles.mobileHeader} d-lg-none`}>
        <Link href="/">
          <img src="/images/logo-manob.png" height={20} alt="manob.ai" />
        </Link>
        <div className="d-flex align-items-center gap-2">
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
        className={`position-fixed top-0 start-0 h-100 bg-white d-flex flex-column ${
          isActive ? "translate-x-0" : ""
        }`}
        style={{
          width: "280px",
          zIndex: 1050,
          transform: isActive ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
        }}
      >
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <Link href="/">
            <img src="/images/logo-manob.png" height={20} alt="manob.ai" />
          </Link>
          <button
            className="btn btn-link p-0"
            onClick={closeSidebarNav}
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-3 flex-grow-1 overflow-auto">
          <ul className="list-unstyled">
            {menuItems.map((menu, index) => (
              <li key={index} className="mb-3">
                <Link
                  href={menu.href}
                  className={`text-decoration-none ${
                    pathname === menu.href ? "text-primary fw-semibold" : "text-dark"
                  }`}
                  onClick={closeSidebarNav}
                >
                  {menu.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-3 border-top">
          <div className="d-flex flex-column gap-2" style={{ fontSize: "13px" }}>
            <Link href="/terms" className="text-muted text-decoration-none">
              Terms of service
            </Link>
            <Link href="/privacy-policy" className="text-muted text-decoration-none">
              Privacy policy
            </Link>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isActive && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
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
