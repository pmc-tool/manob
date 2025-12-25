"use client";

import { Modal, Input, Select, Button, Form, Alert } from "antd";
import { DollarSign } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useWithdrawRequestMutation, useGetMyMethodsQuery } from "@/state/services/seller-service/finance.service";
import toast from "react-hot-toast";

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
  availableBalance: number;
  currency?: string;
}

interface PaymentMethod {
  id: string;
  account_holder_name: string;
  bank_name: string;
  account_number: string;
  is_default: boolean;
}

export default function WithdrawModal({ open, onClose, availableBalance, currency = "USD" }: WithdrawModalProps) {
  const [form] = Form.useForm();
  const [withdrawRequest, { isLoading }] = useWithdrawRequestMutation();
  const { data: methodsData } = useGetMyMethodsQuery();

  const paymentMethods: PaymentMethod[] = methodsData?.data || [];
  const minWithdraw = 30;

  const handleSubmit = async (values: { amount: number; payout_method_id: string }) => {
    if (values.amount < minWithdraw) {
      toast.error(`Minimum withdrawal amount is $${minWithdraw}`);
      return;
    }
    if (values.amount > availableBalance) {
      toast.error("Amount exceeds available balance");
      return;
    }

    try {
      await withdrawRequest({
        amount: values.amount,
        payout_method_id: values.payout_method_id,
      }).unwrap();

      toast.success("Withdrawal request submitted successfully");
      form.resetFields();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit withdrawal request");
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <DollarSign className="text-green-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Withdraw Funds</h3>
            <p className="text-sm text-gray-500 font-normal">Transfer money to your bank account</p>
          </div>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={480}
    >
      <div className="mt-4">
        {/* Available Balance Display */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500 mb-1">Available Balance</p>
          <p className="text-2xl font-bold text-gray-900">
            ${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-sm font-normal text-gray-500">{currency}</span>
          </p>
        </div>

        {paymentMethods.length === 0 ? (
          <Alert
            type="warning"
            message="No Payment Method"
            description={
              <span>
                You need to add a payment method before you can withdraw funds.{" "}
                <Link href="/seller/payment" className="text-primary hover:underline">
                  Add Payment Method
                </Link>
              </span>
            }
            showIcon
            className="mb-4"
          />
        ) : (
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {/* Amount Input */}
            <Form.Item
              name="amount"
              label="Withdrawal Amount"
              rules={[
                { required: true, message: "Please enter amount" },
                { type: "number", min: minWithdraw, message: `Minimum amount is $${minWithdraw}` },
              ]}
            >
              <Input
                type="number"
                prefix={<DollarSign size={16} className="text-gray-400" />}
                placeholder="Enter amount"
                size="large"
                min={minWithdraw}
                max={availableBalance}
              />
            </Form.Item>
            <p className="text-xs text-gray-500 -mt-4 mb-4">
              Minimum withdrawal: ${minWithdraw} • Maximum: ${availableBalance.toLocaleString()}
            </p>

            {/* Payment Method Select */}
            <Form.Item
              name="payout_method_id"
              label="Payout Method"
              rules={[{ required: true, message: "Please select a payment method" }]}
            >
              <Select
                placeholder="Select payment method"
                size="large"
                options={paymentMethods.map((method) => ({
                  value: method.id,
                  label: (
                    <div className="flex items-center justify-between">
                      <span>{method.bank_name} - {method.account_holder_name}</span>
                      {method.is_default && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Default</span>
                      )}
                    </div>
                  ),
                }))}
              />
            </Form.Item>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>Don't see your method?</span>
              <Link href="/seller/payment" className="text-primary hover:underline">
                Add New Method
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button onClick={onClose} size="large" className="flex-1">
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="flex-1"
                loading={isLoading}
                disabled={availableBalance < minWithdraw}
              >
                Withdraw
              </Button>
            </div>
          </Form>
        )}
      </div>
    </Modal>
  );
}
