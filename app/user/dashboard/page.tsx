"use client";
import { Card } from "antd";
import Link from "next/link";
import {
  ShoppingCart,
  Package,
  Briefcase,
  Heart,
  LayoutDashboard,
  ArrowRight,
  ReceiptText,
  Zap,
} from "lucide-react";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  iconBgColor: string;
  iconColor: string;
}

const dashboardCards: DashboardCardProps[] = [
  {
    title: "My Orders",
    description: "View and track your service orders",
    icon: <ShoppingCart size={24} />,
    href: "/user/order-list",
    iconBgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Purchased Products",
    description: "Access your purchased digital products",
    icon: <Package size={24} />,
    href: "/user/purchased-products",
    iconBgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    title: "Posted Jobs",
    description: "Manage your job postings",
    icon: <Briefcase size={24} />,
    href: "/user/job-list",
    iconBgColor: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    title: "Favorites",
    description: "View your saved products and services",
    icon: <Heart size={24} />,
    href: "/user/favorites-list",
    iconBgColor: "bg-red-50",
    iconColor: "text-red-500",
  },
  {
    title: "Refund Requests",
    description: "Manage your refund requests",
    icon: <ReceiptText size={24} />,
    href: "/user/refund-list",
    iconBgColor: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    title: "My Connects",
    description: "View balance and purchase connects",
    icon: <Zap size={24} />,
    href: "/connect",
    iconBgColor: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
];

function DashboardCard({ title, description, icon, href, iconBgColor, iconColor }: DashboardCardProps) {
  return (
    <Link href={href} className="block group">
      <Card
        className="h-full hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-gray-300"
        bodyStyle={{ padding: 24 }}
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl ${iconBgColor} ${iconColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
          <ArrowRight size={20} className="text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 mt-1" />
        </div>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  return (
    <section className="pt-4 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <LayoutDashboard size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Welcome back! Manage your account here.</p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dashboardCards.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
