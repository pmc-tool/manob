'use client';

import { useCallback } from 'react';
import { message } from 'antd';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface AddToCartOptions {
  quantity?: number;
  is_extended?: boolean;
  lic_type?: 'REGULAR' | 'EXTENDED';
}

export default function useAddToCart() {
  const { addToCart, isLoading, isInCart } = useCart();
  const { isAuthenticated, openLoginModal } = useAuth();

  const handleAddToCart = useCallback(
    async (productId: string, options: AddToCartOptions = {}) => {
      // Check authentication
      if (!isAuthenticated) {
        message.warning('Please sign in to add items to cart');
        openLoginModal();
        return false;
      }

      // Add to cart
      const data = {
        product_id: productId,
        quantity: options.quantity || 1,
        is_extended: options.is_extended || false,
        lic_type: options.lic_type || 'REGULAR',
      };

      await addToCart(data);
      return true;
    },
    [isAuthenticated, openLoginModal, addToCart]
  );

  return {
    addToCart: handleAddToCart,
    isLoading,
    isInCart,
  };
}
