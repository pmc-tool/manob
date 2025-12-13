// Cart Mock Data

export interface CartItem {
  id: string;
  product_name: string;
  product_image: string;
  slug: string;
  creator_name: string;
  creator_meta: {
    user_name: string;
  };
  primary_category: string;
  primary_category_slug: string;
  primar_category_name: string;
  regular_price: number;
  extended_price: number;
  regular_discount: number;
  extended_discount: number;
  quantity: number;
  selected_lic_type: 'REGULAR' | 'EXTENDED';
  is_checked: boolean;
}

export interface CartData {
  id: string;
  coupon_id: string | null;
  coupon_code: string | null;
  total_price: number;
  extended_support_fee: number;
  subtotal_price: number;
  total_discount: number;
  total_payable: number;
  total_selected_items: number;
  total_cart_item: number;
  cart_items: CartItem[];
  created_at: string;
  updated_at: string;
}

export const mockCartItems: CartItem[] = [
  {
    id: 'cart-item-001',
    product_name: 'Modern Dashboard Admin Template',
    product_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    slug: 'modern-dashboard-admin-template',
    creator_name: 'CodeMaster',
    creator_meta: {
      user_name: 'codemaster',
    },
    primary_category: 'admin-templates',
    primary_category_slug: 'admin-templates',
    primar_category_name: 'Admin Templates',
    regular_price: 49,
    extended_price: 149,
    regular_discount: 10,
    extended_discount: 30,
    quantity: 1,
    selected_lic_type: 'REGULAR',
    is_checked: true,
  },
  {
    id: 'cart-item-002',
    product_name: 'E-commerce React UI Kit',
    product_image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400',
    slug: 'ecommerce-react-ui-kit',
    creator_name: 'ReactPro',
    creator_meta: {
      user_name: 'reactpro',
    },
    primary_category: 'ui-kits',
    primary_category_slug: 'ui-kits',
    primar_category_name: 'UI Kits',
    regular_price: 79,
    extended_price: 199,
    regular_discount: 0,
    extended_discount: 0,
    quantity: 1,
    selected_lic_type: 'REGULAR',
    is_checked: true,
  },
  {
    id: 'cart-item-003',
    product_name: 'Mobile App Starter Kit - Flutter',
    product_image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
    slug: 'mobile-app-starter-kit-flutter',
    creator_name: 'FlutterDev',
    creator_meta: {
      user_name: 'flutterdev',
    },
    primary_category: 'mobile-apps',
    primary_category_slug: 'mobile-apps',
    primar_category_name: 'Mobile Apps',
    regular_price: 59,
    extended_price: 179,
    regular_discount: 15,
    extended_discount: 45,
    quantity: 2,
    selected_lic_type: 'EXTENDED',
    is_checked: false,
  },
];

// Calculate cart totals from items
export function calculateCartTotals(items: CartItem[]): Omit<CartData, 'cart_items'> {
  const checkedItems = items.filter(item => item.is_checked);

  let totalPrice = 0;
  let totalDiscount = 0;
  let extendedSupportFee = 0;

  checkedItems.forEach(item => {
    const isExtended = item.selected_lic_type === 'EXTENDED';
    const basePrice = isExtended ? item.extended_price : item.regular_price;
    const discount = isExtended ? item.extended_discount : item.regular_discount;

    totalPrice += basePrice * item.quantity;
    totalDiscount += discount * item.quantity;

    if (isExtended) {
      extendedSupportFee += (item.extended_price - item.regular_price) * item.quantity;
    }
  });

  const subtotalPrice = totalPrice;
  const totalPayable = totalPrice - totalDiscount;

  return {
    id: 'cart-001',
    coupon_id: null,
    coupon_code: null,
    total_price: totalPrice - extendedSupportFee,
    extended_support_fee: extendedSupportFee,
    subtotal_price: subtotalPrice,
    total_discount: totalDiscount,
    total_payable: totalPayable,
    total_selected_items: checkedItems.length,
    total_cart_item: items.length,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export const mockCartData: CartData = {
  ...calculateCartTotals(mockCartItems),
  cart_items: mockCartItems,
};

export const licenseOptions = [
  { value: 'REGULAR', title: 'Regular License' },
  { value: 'EXTENDED', title: 'Extended License' },
];
