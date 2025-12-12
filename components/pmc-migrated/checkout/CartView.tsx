// MIGRATION: Cart view from PMC
// VIPER: Visual consistency with Engine design system
// CONTRACT: Uses cartApi for data operations

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, InputNumber, Empty, message, Popconfirm, Input, Card } from 'antd';
import {
  DeleteOutlined,
  ShoppingOutlined,
  TagOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { cartApi } from '@/lib/api/cart';
import type { Cart, CartItem } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';
import { LoadingState } from '@/components/pmc-migrated/shared/LoadingState';
import { ErrorDisplay } from '@/components/pmc-migrated/shared/ErrorBoundary';

interface CartViewProps {
  initialData?: Cart;
}

/**
 * Cart View Component
 * MIGRATION: Full cart view with item management
 */
export function CartView({ initialData }: CartViewProps) {
  const [cart, setCart] = useState<Cart | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<ReturnType<typeof handleError> | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  useEffect(() => {
    if (!initialData) {
      fetchCart();
    }
  }, [initialData]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartApi.getCart();
      setCart(data);
    } catch (err) {
      const displayError = handleError(err as Parameters<typeof handleError>[0]);
      setError(displayError);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (!cart) return;

    try {
      setUpdatingItems((prev) => new Set(prev).add(itemId));
      const updatedCart = await cartApi.updateItem(itemId, quantity);
      setCart(updatedCart);
    } catch (err) {
      handleError(err as Parameters<typeof handleError>[0], { showToast: true });
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!cart) return;

    try {
      setUpdatingItems((prev) => new Set(prev).add(itemId));
      const updatedCart = await cartApi.removeItem(itemId);
      setCart(updatedCart);
      message.success('Item removed from cart');
    } catch (err) {
      handleError(err as Parameters<typeof handleError>[0], { showToast: true });
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const handleClearCart = async () => {
    try {
      await cartApi.clearCart();
      setCart(null);
      message.success('Cart cleared');
    } catch (err) {
      handleError(err as Parameters<typeof handleError>[0], { showToast: true });
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      setApplyingCoupon(true);
      const updatedCart = await cartApi.applyCoupon(couponCode);
      setCart(updatedCart as Cart);
      message.success('Coupon applied successfully');
      setCouponCode('');
    } catch (err) {
      handleError(err as Parameters<typeof handleError>[0], { showToast: true });
    } finally {
      setApplyingCoupon(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading your cart..." />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchCart} showRetry />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Empty
        image={<ShoppingOutlined className="text-6xl text-gray-300" />}
        description="Your cart is empty"
        className="py-12"
      >
        <Link href="/products">
          <Button type="primary" icon={<ShoppingOutlined />}>
            Continue Shopping
          </Button>
        </Link>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Cart ({cart.itemCount} items)
          </h2>
          <Popconfirm
            title="Clear all items from cart?"
            onConfirm={handleClearCart}
            okText="Clear"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger>
              Clear Cart
            </Button>
          </Popconfirm>
        </div>

        <div className="space-y-4">
          {cart.items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              updating={updatingItems.has(item.id)}
              onUpdateQuantity={(qty) => handleUpdateQuantity(item.id, qty)}
              onRemove={() => handleRemoveItem(item.id)}
            />
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div>
        <Card title="Order Summary" className="sticky top-4 rounded-2xl">
          <div className="space-y-4">
            {/* Coupon */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Coupon Code
              </label>
              <div className="flex gap-2">
                <Input
                  prefix={<TagOutlined className="text-gray-400" />}
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  onPressEnter={handleApplyCoupon}
                />
                <Button onClick={handleApplyCoupon} loading={applyingCoupon}>
                  Apply
                </Button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="mt-2 flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${cart.subtotal.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout">
              <Button
                type="primary"
                size="large"
                block
                icon={<ArrowRightOutlined />}
              >
                Proceed to Checkout
              </Button>
            </Link>

            <Link href="/products">
              <Button block>Continue Shopping</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

/**
 * Cart Item Row Component
 */
function CartItemRow({
  item,
  updating,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem;
  updating: boolean;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4">
      {/* Image */}
      <Link href={`/products/${item.productId}`}>
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
          {item.product.thumbnail ? (
            <Image
              src={item.product.thumbnail}
              alt={item.product.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link href={`/products/${item.productId}`}>
            <h3 className="font-medium text-gray-900 hover:text-blue-600">
              {item.product.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-500">{item.product.category?.name}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <InputNumber
              min={1}
              max={item.product.stock}
              value={item.quantity}
              onChange={(val) => onUpdateQuantity(val || 1)}
              disabled={updating}
              size="small"
            />
            <Popconfirm
              title="Remove this item?"
              onConfirm={onRemove}
              okText="Remove"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                loading={updating}
                size="small"
              >
                Remove
              </Button>
            </Popconfirm>
          </div>

          <div className="text-right">
            <p className="font-bold text-gray-900">
              ${item.total.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              ${item.price.toFixed(2)} each
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartView;
