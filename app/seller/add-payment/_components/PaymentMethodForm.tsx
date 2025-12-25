"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Radio, Input, Select, Form, Checkbox } from "antd";
import { Building2 } from "lucide-react";
import toast from "react-hot-toast";
import Countries from "@/lib/data/countries.json";
import { useAppSelector } from "@/state/hooks";
import { useSaveMethodMutation } from "@/state/services/seller-service/finance.service";

interface PaymentMethodFormProps {
  handlePreviousStep: () => void;
}

interface CountryData {
  name: string;
  code: string;
  currency?: string;
  currency_name?: string;
}

interface FormValues {
  country: string;
  swift_code: string;
  bank_name: string;
  bank_branch: string;
  account_number: string;
  account_name: string;
  routing_number: string;
  is_default: boolean;
}

export default function PaymentMethodForm({ handlePreviousStep }: PaymentMethodFormProps) {
  const [form] = Form.useForm<FormValues>();
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>("BANK");
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();
  const generalData = useAppSelector(
    (state) => state.financeStore.paymentMethodFormValues
  );

  const [saveMethod, { data: savedData }] = useSaveMethodMutation();

  const handleCountryChange = (countryName: string) => {
    const countryData = Countries.find((c) => c.name === countryName) as CountryData | undefined;
    setSelectedCountry(countryData || null);
  };

  const onFinish = async (values: FormValues) => {
    try {
      setIsSaving(true);
      const insertData = {
        ...generalData,
        account_type: selectedPaymentType,
        is_default: values.is_default || false,
        account_details: {
          ...values,
          currency: selectedCountry?.currency || "USD",
        },
      };
      await saveMethod(insertData);
    } catch {
      setIsSaving(false);
      toast.error("Failed to save payment method");
    }
  };

  useEffect(() => {
    if (savedData?.statusCode === 201) {
      toast.success("Payment method saved successfully!");
      router.push("/seller/payment");
      setIsSaving(false);
    } else if (savedData?.statusCode && savedData?.statusCode !== 201) {
      toast.error(savedData?.message || "Failed to save payment method");
      setIsSaving(false);
    }
  }, [savedData, router]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ is_default: false }}
    >
      {/* Payment Method Selection */}
      <Form.Item
        label={<span className="font-medium">Select Payout Method</span>}
      >
        <div className="flex gap-4 flex-wrap">
          <label
            className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
              selectedPaymentType === "BANK"
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Radio
              checked={selectedPaymentType === "BANK"}
              onChange={() => setSelectedPaymentType("BANK")}
            />
            <Building2 size={20} className="text-gray-600" />
            <span className="font-medium">Bank Transfer</span>
          </label>
        </div>
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Country */}
        <Form.Item
          label={<span className="font-medium">Country <span className="text-red-500">*</span></span>}
          name="country"
          rules={[{ required: true, message: "Country is required" }]}
        >
          <Select
            placeholder="Select Country"
            size="large"
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={Countries.map((country) => ({
              value: country.name,
              label: country.name,
            }))}
            onChange={handleCountryChange}
          />
        </Form.Item>

        {/* Currency Display */}
        <div className="flex flex-col justify-end pb-6">
          <label className="font-medium text-gray-700 mb-1">Bank Account Currency</label>
          <div className="text-gray-900">
            {selectedCountry?.currency_name
              ? `${selectedCountry.currency_name} (${selectedCountry.currency})`
              : "United States dollar (USD)"}
          </div>
        </div>

        {/* Bank Name */}
        <Form.Item
          label={<span className="font-medium">Bank Name <span className="text-red-500">*</span></span>}
          name="bank_name"
          rules={[
            { required: true, message: "Bank name is required" },
            { max: 100, message: "Bank name cannot exceed 100 characters" },
          ]}
        >
          <Input placeholder="Enter Bank Name" size="large" />
        </Form.Item>

        {/* Bank Branch */}
        <Form.Item
          label={<span className="font-medium">Bank Branch <span className="text-red-500">*</span></span>}
          name="bank_branch"
          rules={[
            { required: true, message: "Bank branch is required" },
            { max: 100, message: "Bank branch cannot exceed 100 characters" },
          ]}
        >
          <Input placeholder="Enter Bank Branch" size="large" />
        </Form.Item>

        {/* Account Holder Name */}
        <Form.Item
          label={<span className="font-medium">Account Holder Name <span className="text-red-500">*</span></span>}
          name="account_name"
          rules={[
            { required: true, message: "Account holder name is required" },
            { max: 100, message: "Account holder name cannot exceed 100 characters" },
          ]}
        >
          <Input placeholder="Enter Account Holder Name" size="large" />
        </Form.Item>

        {/* Account Number */}
        <Form.Item
          label={<span className="font-medium">Account Number <span className="text-red-500">*</span></span>}
          name="account_number"
          rules={[
            { required: true, message: "Account number is required" },
            { min: 3, message: "Account number must be at least 3 digits" },
            { max: 17, message: "Account number cannot exceed 17 digits" },
          ]}
          extra={<span className="text-gray-500 text-xs">Account number has 3 to 17 digits</span>}
        >
          <Input placeholder="Enter Account Number" size="large" />
        </Form.Item>

        {/* SWIFT/BIC Code */}
        <Form.Item
          label={<span className="font-medium">SWIFT/BIC Code <span className="text-red-500">*</span></span>}
          name="swift_code"
          rules={[
            { required: true, message: "SWIFT/BIC code is required" },
            { max: 11, message: "SWIFT/BIC code cannot exceed 11 characters" },
          ]}
        >
          <Input placeholder="Enter SWIFT/BIC Code" size="large" />
        </Form.Item>

        {/* Routing Number */}
        <Form.Item
          label={<span className="font-medium">Routing Number <span className="text-red-500">*</span></span>}
          name="routing_number"
          rules={[
            { required: true, message: "Routing number is required" },
            { max: 20, message: "Routing number cannot exceed 20 characters" },
          ]}
        >
          <Input placeholder="Enter Routing Number" size="large" />
        </Form.Item>
      </div>

      {/* Default Checkbox */}
      <Form.Item name="is_default" valuePropName="checked" className="mt-4">
        <Checkbox>
          <span className="font-medium">Use this account as a default payment option</span>
        </Checkbox>
      </Form.Item>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <Button size="large" onClick={handlePreviousStep}>
          Previous
        </Button>
        <Button type="primary" htmlType="submit" size="large" loading={isSaving}>
          Submit
        </Button>
      </div>
    </Form>
  );
}
