'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import {
  CartData,
  CartItem,
  mockCartItems,
  calculateCartTotals,
  licenseOptions,
} from '@/lib/mocks/cart.mock';

// Types for add to cart
interface AddToCartProductData {
  product_id: string;
  quantity: number;
  is_extended?: boolean;
  lic_type: 'REGULAR' | 'EXTENDED';
}

interface AddToCartServiceData {
  service_id: string;
  quantity: number;
  service_plan: string;
  package_info?: {
    title: string;
    price: number;
    discounted_price?: number;
    delivery_time: number;
  };
}

interface CartContextType {
  // Cart state
  cartItems: CartItem[];
  cartTotals: Omit<CartData, 'cart_items'>;
  isLoading: boolean;
  error: string | null;

  // Cart actions
  addToCart: (data: AddToCartProductData) => Promise<void>;
  addServiceToCart: (data: AddToCartServiceData) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, type: 'increment' | 'decrement') => void;
  toggleItemCheck: (itemId: string, checked: boolean) => void;
  changeLicenseType: (itemId: string) => void;
  clearCart: () => void;

  // Service order state (for service payment flow)
  serviceOrderInfo: AddToCartServiceData | null;
  setServiceOrderInfo: (info: AddToCartServiceData | null) => void;

  // Utility
  getCartItemCount: () => number;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serviceOrderInfo, setServiceOrderInfo] = useState<AddToCartServiceData | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('pmc_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch {
        setCartItems(mockCartItems); // Fallback to mock data
      }
    } else {
      setCartItems(mockCartItems); // Default mock data for demo
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('pmc_cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Calculate totals
  const cartTotals = calculateCartTotals(cartItems);

  // Add product to cart
  const addToCart = useCallback(async (data: AddToCartProductData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const existingItem = cartItems.find(item => item.id === data.product_id);

      if (existingItem) {
        // Update quantity if item exists
        setCartItems(prev =>
          prev.map(item =>
            item.id === data.product_id
              ? { ...item, quantity: item.quantity + data.quantity }
              : item
          )
        );
        message.success('Cart updated successfully!');
      } else {
        // Add new item (mock implementation - in real app, this would come from API)
        const newItem: CartItem = {
          id: data.product_id,
          product_name: 'Product', // Would come from API
          product_image: '',
          slug: data.product_id,
          creator_name: 'Author',
          creator_meta: { user_name: 'author' },
          primary_category: 'category',
          primary_category_slug: 'category',
          primar_category_name: 'Category',
          regular_price: 49,
          extended_price: 149,
          regular_discount: 0,
          extended_discount: 0,
          quantity: data.quantity,
          selected_lic_type: data.lic_type,
          is_checked: true,
        };
        setCartItems(prev => [...prev, newItem]);
        message.success('Added to cart successfully!');
      }
    } catch (err) {
      setError('Failed to add to cart');
      message.error('Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  }, [cartItems]);

  // Add service to cart (redirects to service payment)
  const addServiceToCart = useCallback((data: AddToCartServiceData) => {
    setServiceOrderInfo(data);
    // Store in sessionStorage for persistence
    sessionStorage.setItem('service_info', JSON.stringify(data));
    message.success('Service added! Proceeding to checkout...');
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    message.success('Item removed from cart');
  }, []);

  // Update quantity
  const updateQuantity = useCallback((itemId: string, type: 'increment' | 'decrement') => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const newQuantity = type === 'increment'
            ? Math.min(item.quantity + 1, 10)
            : Math.max(item.quantity - 1, 1);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  }, []);

  // Toggle item selection
  const toggleItemCheck = useCallback((itemId: string, checked: boolean) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, is_checked: checked } : item
      )
    );
  }, []);

  // Change license type
  const changeLicenseType = useCallback((itemId: string) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const newLicType = item.selected_lic_type === 'REGULAR' ? 'EXTENDED' : 'REGULAR';
          return { ...item, selected_lic_type: newLicType };
        }
        return item;
      })
    );
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('pmc_cart');
    message.success('Cart cleared');
  }, []);

  // Get cart item count
  const getCartItemCount = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  // Check if product is in cart
  const isInCart = useCallback((productId: string) => {
    return cartItems.some(item => item.id === productId);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotals,
        isLoading,
        error,
        addToCart,
        addServiceToCart,
        removeFromCart,
        updateQuantity,
        toggleItemCheck,
        changeLicenseType,
        clearCart,
        serviceOrderInfo,
        setServiceOrderInfo,
        getCartItemCount,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
