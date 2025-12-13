// Purchased Products Page - User's purchased items
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Download, Eye, Star, Calendar, Package, CheckCircle, FileCode, ShoppingBag } from "lucide-react";
import { Skeleton, Empty, Button, Dropdown } from "antd";
import type { MenuProps } from "antd";

interface PurchasedProduct {
  id: string;
  name: string;
  image: string;
  author: string;
  authorAvatar: string;
  category: string;
  purchaseDate: string;
  price: number;
  licenseType: string;
  downloadCount: number;
  rating: number;
  reviewCount: number;
  slug: string;
  version: string;
  lastUpdate: string;
}

// Mock data - will come from API
const mockPurchasedProducts: PurchasedProduct[] = [
  {
    id: "1",
    name: "Modern Dashboard UI Kit",
    image: "/images/listings/product-draft-default.png",
    author: "DesignStudio",
    authorAvatar: "https://i.pravatar.cc/150?img=1",
    category: "UI Kits",
    purchaseDate: "2024-01-15",
    price: 49,
    licenseType: "Regular",
    downloadCount: 3,
    rating: 4.8,
    reviewCount: 124,
    slug: "modern-dashboard-ui-kit",
    version: "2.1.0",
    lastUpdate: "2024-01-20",
  },
  {
    id: "2",
    name: "E-commerce Website Template",
    image: "/images/listings/product-draft-default.png",
    author: "WebCraft",
    authorAvatar: "https://i.pravatar.cc/150?img=2",
    category: "Templates",
    purchaseDate: "2024-01-10",
    price: 79,
    licenseType: "Extended",
    downloadCount: 5,
    rating: 4.9,
    reviewCount: 89,
    slug: "ecommerce-website-template",
    version: "3.0.2",
    lastUpdate: "2024-01-18",
  },
  {
    id: "3",
    name: "Mobile App Starter Kit",
    image: "/images/listings/product-draft-default.png",
    author: "AppDevs",
    authorAvatar: "https://i.pravatar.cc/150?img=3",
    category: "Code",
    purchaseDate: "2024-01-05",
    price: 129,
    licenseType: "Regular",
    downloadCount: 2,
    rating: 4.7,
    reviewCount: 56,
    slug: "mobile-app-starter-kit",
    version: "1.5.0",
    lastUpdate: "2024-01-12",
  },
];

export default function PurchasedProductsPage() {
  const [products, setProducts] = useState<PurchasedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setProducts(mockPurchasedProducts);
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDownloadItems = (product: PurchasedProduct): MenuProps["items"] => [
    {
      key: "main",
      label: "Main Files",
      icon: <FileCode size={14} />,
    },
    {
      key: "license",
      label: "License Certificate",
      icon: <CheckCircle size={14} />,
    },
  ];

  return (
    <div className="purchased-page">
      {/* Page Header */}
      <div className="purchased-page__header">
        <div className="purchased-page__header-content">
          <div className="purchased-page__icon">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h1 className="purchased-page__title">My Purchases</h1>
            <p className="purchased-page__subtitle">
              {isLoading ? "Loading..." : `${products.length} products purchased`}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="purchased-page__content">
        {isLoading ? (
          <div className="purchased-page__grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="purchase-card purchase-card--skeleton">
                <Skeleton.Image active style={{ width: "100%", height: 180 }} />
                <div className="purchase-card__body">
                  <Skeleton active paragraph={{ rows: 3 }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="purchased-page__empty">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="purchased-page__empty-text">
                  <h3>No purchases yet</h3>
                  <p>Start exploring our marketplace to find amazing products</p>
                </div>
              }
            />
            <Link href="/marketplace">
              <Button type="primary" size="large">
                Browse Marketplace
              </Button>
            </Link>
          </div>
        ) : (
          <div className="purchased-page__grid">
            {products.map((product) => (
              <div key={product.id} className="purchase-card">
                {/* Card Image */}
                <div className="purchase-card__image">
                  <Link href={`/product-details/${product.slug}`}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={220}
                      className="purchase-card__img"
                      unoptimized
                    />
                  </Link>
                  <div className="purchase-card__license">
                    {product.licenseType}
                  </div>
                </div>

                {/* Card Body */}
                <div className="purchase-card__body">
                  {/* Title & Author */}
                  <div className="purchase-card__header">
                    <h3 className="purchase-card__title">
                      <Link href={`/product-details/${product.slug}`}>
                        {product.name}
                      </Link>
                    </h3>
                    <div className="purchase-card__author">
                      <Image
                        src={product.authorAvatar}
                        alt={product.author}
                        width={20}
                        height={20}
                        className="purchase-card__author-avatar"
                        unoptimized
                      />
                      <span>by <strong>{product.author}</strong></span>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="purchase-card__meta">
                    <div className="purchase-card__meta-item">
                      <Calendar size={14} />
                      <span>Purchased {formatDate(product.purchaseDate)}</span>
                    </div>
                    <div className="purchase-card__meta-item">
                      <Star size={14} className="text-warning" fill="#ffc107" />
                      <span>{product.rating} ({product.reviewCount})</span>
                    </div>
                  </div>

                  {/* Version & Update */}
                  <div className="purchase-card__version">
                    <span className="purchase-card__version-tag">v{product.version}</span>
                    <span className="purchase-card__update">Updated {formatDate(product.lastUpdate)}</span>
                  </div>

                  {/* Footer */}
                  <div className="purchase-card__footer">
                    <div className="purchase-card__price">
                      <span className="purchase-card__price-value">${product.price}</span>
                      <span className="purchase-card__downloads">{product.downloadCount} downloads</span>
                    </div>
                    <div className="purchase-card__actions">
                      <Link href={`/product-details/${product.slug}`}>
                        <Button icon={<Eye size={16} />} />
                      </Link>
                      <Dropdown
                        menu={{ items: getDownloadItems(product) }}
                        trigger={["click"]}
                        placement="bottomRight"
                      >
                        <Button type="primary" icon={<Download size={16} />}>
                          Download
                        </Button>
                      </Dropdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
