// MIGRATION: Checkout form from PMC
// VIPER: Visual consistency with Engine design system
// CONTRACT: Uses ordersApi for order creation

'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Card, Steps, Radio, message } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { cartApi } from '@/lib/api/cart';
import { ordersApi } from '@/lib/api/orders';
import type { Cart, Address } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';
import { LoadingState } from '@/components/pmc-migrated/shared/LoadingState';

const { Option } = Select;

interface CheckoutFormProps {
  initialCart?: Cart;
}

/**
 * Checkout Form Component
 * MIGRATION: Multi-step checkout process
 */
export function CheckoutForm({ initialCart }: CheckoutFormProps) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [cart, setCart] = useState<Cart | null>(initialCart || null);
  const [loading, setLoading] = useState(!initialCart);
  const [submitting, setSubmitting] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<string>('');
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<string>('');
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cartData, summaryData] = await Promise.all([
          initialCart ? Promise.resolve(initialCart) : cartApi.getCart(),
          cartApi.getSummary(),
        ]);
        setCart(cartData);

        // TODO: Fetch user addresses from API
        // For now, use empty array
        setAddresses([]);
      } catch (err) {
        handleError(err as Parameters<typeof handleError>[0], { showToast: true });
        router.push('/cart');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialCart, router]);

  const handleNext = async () => {
    try {
      await form.validateFields();
      setCurrentStep((prev) => prev + 1);
    } catch {
      // Validation failed
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmitOrder = async () => {
    if (!cart) return;

    try {
      setSubmitting(true);

      // Get form values for new address if no existing address selected
      const formValues = form.getFieldsValue();

      const order = await ordersApi.createOrder({
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddressId: selectedShippingAddress || 'new',
        billingAddressId: sameAsShipping
          ? selectedShippingAddress || 'new'
          : selectedBillingAddress || 'new',
        paymentMethod,
      });

      message.success('Order placed successfully!');
      router.push(`/checkout/confirmation?orderId=${order.id}`);
    } catch (err) {
      handleError(err as Parameters<typeof handleError>[0], { showToast: true });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading checkout..." />;
  }

  if (!cart || cart.items.length === 0) {
    router.push('/cart');
    return null;
  }

  const steps = [
    {
      title: 'Shipping',
      icon: <HomeOutlined />,
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Shipping Address</h3>

          {addresses.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Select a saved address:</p>
              <Radio.Group
                value={selectedShippingAddress}
                onChange={(e) => setSelectedShippingAddress(e.target.value)}
                className="space-y-2"
              >
                {addresses.map((addr) => (
                  <Radio key={addr.id} value={addr.id} className="block">
                    <span className="font-medium">{addr.name}</span>
                    <br />
                    <span className="text-sm text-gray-500">
                      {addr.line1}, {addr.city}, {addr.state} {addr.postalCode}
                    </span>
                  </Radio>
                ))}
              </Radio.Group>
              <p className="text-sm text-gray-600">Or enter a new address:</p>
            </div>
          )}

          <AddressForm form={form} prefix="shipping" />
        </div>
      ),
    },
    {
      title: 'Billing',
      icon: <UserOutlined />,
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Billing Address</h3>

          <Radio.Group
            value={sameAsShipping}
            onChange={(e) => setSameAsShipping(e.target.value)}
          >
            <Radio value={true}>Same as shipping address</Radio>
            <Radio value={false}>Use a different billing address</Radio>
          </Radio.Group>

          {!sameAsShipping && (
            <AddressForm form={form} prefix="billing" />
          )}
        </div>
      ),
    },
    {
      title: 'Payment',
      icon: <CreditCardOutlined />,
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Payment Method</h3>

          <Radio.Group
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="space-y-3"
          >
            <Radio value="card" className="block rounded-lg border border-gray-200 p-4">
              <span className="font-medium">Credit/Debit Card</span>
              <br />
              <span className="text-sm text-gray-500">
                Pay securely with your card
              </span>
            </Radio>
            <Radio value="paypal" className="block rounded-lg border border-gray-200 p-4">
              <span className="font-medium">PayPal</span>
              <br />
              <span className="text-sm text-gray-500">
                Pay with your PayPal account
              </span>
            </Radio>
          </Radio.Group>

          {paymentMethod === 'card' && (
            <Card className="rounded-xl">
              <p className="mb-4 text-sm text-gray-500">
                Card details will be entered on the payment page
              </p>
            </Card>
          )}
        </div>
      ),
    },
    {
      title: 'Review',
      icon: <CheckCircleOutlined />,
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Review Your Order</h3>

          {/* Order Items */}
          <Card title="Items" className="rounded-xl">
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{item.product.title}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-medium">${item.total.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Summary */}
          <Card title="Order Total" className="rounded-xl">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-lg font-bold">
                <span>Total</span>
                <span>${cart.subtotal.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Steps */}
      <Steps current={currentStep} items={steps.map((s) => ({ title: s.title, icon: s.icon }))} />

      {/* Form Content */}
      <Form form={form} layout="vertical" className="max-w-2xl">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          {steps[currentStep].content}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          {currentStep > 0 ? (
            <Button onClick={handleBack}>Back</Button>
          ) : (
            <div />
          )}

          {currentStep < steps.length - 1 ? (
            <Button type="primary" onClick={handleNext}>
              Continue
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={handleSubmitOrder}
              loading={submitting}
            >
              Place Order
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}

/**
 * Address Form Component
 */
function AddressForm({
  form,
  prefix,
}: {
  form: ReturnType<typeof Form.useForm>[0];
  prefix: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Form.Item
        name={[prefix, 'name']}
        label="Full Name"
        rules={[{ required: true, message: 'Please enter your name' }]}
        className="sm:col-span-2"
      >
        <Input placeholder="John Doe" />
      </Form.Item>

      <Form.Item
        name={[prefix, 'line1']}
        label="Address Line 1"
        rules={[{ required: true, message: 'Please enter your address' }]}
        className="sm:col-span-2"
      >
        <Input placeholder="123 Main St" />
      </Form.Item>

      <Form.Item
        name={[prefix, 'line2']}
        label="Address Line 2"
        className="sm:col-span-2"
      >
        <Input placeholder="Apt, Suite, etc. (optional)" />
      </Form.Item>

      <Form.Item
        name={[prefix, 'city']}
        label="City"
        rules={[{ required: true, message: 'Please enter your city' }]}
      >
        <Input placeholder="City" />
      </Form.Item>

      <Form.Item
        name={[prefix, 'state']}
        label="State/Province"
        rules={[{ required: true, message: 'Please enter your state' }]}
      >
        <Input placeholder="State" />
      </Form.Item>

      <Form.Item
        name={[prefix, 'postalCode']}
        label="Postal Code"
        rules={[{ required: true, message: 'Please enter your postal code' }]}
      >
        <Input placeholder="12345" />
      </Form.Item>

      <Form.Item
        name={[prefix, 'country']}
        label="Country"
        rules={[{ required: true, message: 'Please select your country' }]}
      >
        <Select placeholder="Select country">
          <Option value="US">United States</Option>
          <Option value="CA">Canada</Option>
          <Option value="UK">United Kingdom</Option>
          <Option value="AU">Australia</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name={[prefix, 'phone']}
        label="Phone Number"
        rules={[{ required: true, message: 'Please enter your phone number' }]}
        className="sm:col-span-2"
      >
        <Input placeholder="+1 (555) 123-4567" />
      </Form.Item>
    </div>
  );
}

export default CheckoutForm;
