"use client";
import { Button, Form, Input, Select, Alert } from "antd";
import { Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useCreateRequestMutation } from "@/state/services/user-service/refund.service";
import { useGetOrderHistoryQuery } from "@/state/services/user-service/purchase-items.service";

const { TextArea } = Input;

// Mock data for development
const mockOrderHistory = [
  {
    order_id: "ORD-2024-001",
    product_id: "prod-001",
    product_name: "Premium React Admin Dashboard Template",
  },
  {
    order_id: "ORD-2024-002",
    product_id: "prod-002",
    product_name: "E-commerce Website Complete Package",
  },
  {
    order_id: "ORD-2024-003",
    product_id: "prod-003",
    product_name: "Mobile App UI Kit - iOS & Android",
  },
  {
    order_id: "ORD-2024-004",
    product_id: "prod-004",
    product_name: "WordPress Theme - Business Pro",
  },
  {
    order_id: "ORD-2024-005",
    product_id: "prod-005",
    product_name: "Icon Pack - 5000+ Premium Icons",
  },
];

const refundReasons = [
  { value: "There was a problem with my payment", label: "There was a problem with my payment" },
  { value: "I'm having a problem with item support", label: "I'm having a problem with item support" },
  { value: "The item is broken, malfunctioning or not as described", label: "The item is broken, malfunctioning or not as described" },
  { value: "Other", label: "Other" },
];

export default function RefundRequest() {
  const [form] = Form.useForm();
  const router = useRouter();

  const { data: apiOrderList } = useGetOrderHistoryQuery();
  const [createRequest, { data: reqData, isLoading, error }] = useCreateRequestMutation();

  // Use mock data if API returns no data
  const orderList = apiOrderList && apiOrderList.length > 0 ? apiOrderList : mockOrderHistory;

  const productOptions = orderList.map((item: any) => ({
    value: item?.order_id,
    label: item?.product_name,
  }));

  const onFinish = async (values: any) => {
    const orderInfo = orderList.find(
      (order: any) => order?.order_id === values?.order_id
    );
    await createRequest({
      ...values,
      product_id: orderInfo?.product_id
    });
  };

  useEffect(() => {
    if (reqData?.statusCode === 201) {
      form.resetFields();
      router.push("/user/refund-list");
      toast.success("Your refund request submitted successfully");
    } else if (reqData?.statusCode === 400) {
      toast.error(reqData?.message);
    } else if (reqData?.statusCode === 404) {
      toast.error(reqData?.message);
    }
    const err: any = error;
    if (err) {
      toast.error(err?.message || "Something went wrong");
    }
  }, [reqData, error, form, router]);

  return (
    <section className="pt-4 pb-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center border-b-2 border-gray-200 mb-6 pb-6">
            <h1 className="text-2xl font-semibold mb-2">Request a Refund</h1>
            <p className="text-gray-600">
              Please detail the reason you're requesting a refund. If you're
              having trouble with an item you can find out how to get help{" "}
              <Link href="/help" className="text-primary hover:underline">
                here
              </Link>
            </p>
          </div>

          {/* Info Alert */}
          <Alert
            type="info"
            showIcon
            icon={<Info size={20} className="mt-1" />}
            message={
              <div>
                <h4 className="font-semibold mb-1">Here are some things we'd like you to know:</h4>
                <p className="text-gray-600 text-sm">
                  In the meantime, for anything about buying and how to get
                  support at PackMyCode Market,{" "}
                  <Link href="/help" className="text-primary hover:underline font-medium">
                    visit our Help Center
                  </Link>
                  .
                </p>
                <p className="text-gray-600 text-sm mt-1">Have an awesome day!</p>
              </div>
            }
            className="mb-6"
          />

          {/* Form */}
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              name="order_id"
              label={<span className="font-medium">Choose the product you want to refund <span className="text-red-500">*</span></span>}
              rules={[{ required: true, message: "This field is required" }]}
            >
              <Select
                placeholder="Select One"
                options={productOptions}
                size="large"
                showSearch
                filterOption={(input, option) =>
                  String(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item
              name="reason"
              label={<span className="font-medium">Main cause for refund request <span className="text-red-500">*</span></span>}
              rules={[{ required: true, message: "This field is required" }]}
            >
              <Select
                placeholder="Select One"
                options={refundReasons}
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="description"
              label={<span className="font-medium">Provide details of your request <span className="text-red-500">*</span></span>}
              rules={[
                { required: true, message: "This field is required" },
                { min: 20, message: "Description must be at least 20 characters" },
                { max: 1000, message: "Description cannot exceed 1000 characters" },
              ]}
            >
              <TextArea
                rows={6}
                placeholder="Describe your issue in detail..."
                showCount
                maxLength={1000}
              />
            </Form.Item>

            <div className="text-right">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                size="large"
              >
                Send Request
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </section>
  );
}
