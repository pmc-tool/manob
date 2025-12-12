// MIGRATION: Payment form from PMC
// VIPER: Visual consistency with Engine design system
// CONTRACT: Integrates with PMC payment processing

'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, Alert, Checkbox } from 'antd';
import {
  CreditCardOutlined,
  LockOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Order } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';

interface PaymentFormProps {
  order: Order;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Payment Form Component
 * MIGRATION: Secure payment form with card input
 */
export function PaymentForm({ order, onSuccess, onCancel }: PaymentFormProps) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [processing, setProcessing] = useState(false);
  const [saveCard, setSaveCard] = useState(false);

  const handleSubmit = async (values: {
    cardNumber: string;
    expiry: string;
    cvv: string;
    name: string;
  }) => {
    try {
      setProcessing(true);

      // CONTRACT: Payment processing through PMC API
      // In a real implementation, this would call a payment API
      // For now, we simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 2000));

      onSuccess?.();
      router.push(`/orders/${order.id}/confirmation`);
    } catch (err) {
      handleError(err as Parameters<typeof handleError>[0], { showToast: true });
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      {/* Security Notice */}
      <Alert
        message="Secure Payment"
        description="Your payment information is encrypted and secure. We never store your full card details."
        type="info"
        icon={<SafetyOutlined />}
        showIcon
      />

      {/* Order Summary */}
      <Card className="rounded-2xl">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Order Total</span>
          <span className="text-2xl font-bold">
            {order.currency} {order.total.toFixed(2)}
          </span>
        </div>
      </Card>

      {/* Payment Form */}
      <Card title="Payment Details" className="rounded-2xl">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="cardNumber"
            label="Card Number"
            rules={[
              { required: true, message: 'Please enter your card number' },
              { len: 19, message: 'Please enter a valid card number' },
            ]}
            getValueFromEvent={(e) => formatCardNumber(e.target.value)}
          >
            <Input
              prefix={<CreditCardOutlined className="text-gray-400" />}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              size="large"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="expiry"
              label="Expiry Date"
              rules={[
                { required: true, message: 'Enter expiry' },
                { len: 5, message: 'Invalid format' },
              ]}
              getValueFromEvent={(e) => formatExpiry(e.target.value)}
            >
              <Input placeholder="MM/YY" maxLength={5} size="large" />
            </Form.Item>

            <Form.Item
              name="cvv"
              label="CVV"
              rules={[
                { required: true, message: 'Enter CVV' },
                { min: 3, max: 4, message: 'Invalid CVV' },
              ]}
            >
              <Input
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="123"
                maxLength={4}
                size="large"
                type="password"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="name"
            label="Name on Card"
            rules={[{ required: true, message: 'Please enter the name on card' }]}
          >
            <Input placeholder="John Doe" size="large" />
          </Form.Item>

          <Form.Item>
            <Checkbox
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
            >
              Save card for future purchases
            </Checkbox>
          </Form.Item>

          <div className="space-y-3">
            <Button
              type="primary"
              htmlType="submit"
              loading={processing}
              block
              size="large"
            >
              {processing ? 'Processing...' : `Pay ${order.currency} ${order.total.toFixed(2)}`}
            </Button>

            {onCancel && (
              <Button onClick={onCancel} block size="large">
                Cancel
              </Button>
            )}
          </div>
        </Form>
      </Card>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-6 text-gray-400">
        <div className="flex items-center gap-2">
          <LockOutlined />
          <span className="text-sm">SSL Secured</span>
        </div>
        <div className="flex items-center gap-2">
          <SafetyOutlined />
          <span className="text-sm">PCI Compliant</span>
        </div>
      </div>

      {/* Accepted Cards */}
      <div className="text-center">
        <p className="mb-2 text-sm text-gray-500">We accept</p>
        <div className="flex justify-center gap-4">
          <div className="rounded border border-gray-200 bg-white p-2 px-3">
            <span className="text-sm font-medium">VISA</span>
          </div>
          <div className="rounded border border-gray-200 bg-white p-2 px-3">
            <span className="text-sm font-medium">Mastercard</span>
          </div>
          <div className="rounded border border-gray-200 bg-white p-2 px-3">
            <span className="text-sm font-medium">AMEX</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentForm;
