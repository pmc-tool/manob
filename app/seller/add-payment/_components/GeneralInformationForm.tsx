"use client";

import { useEffect, useState } from "react";
import { Card, Button, DatePicker, Radio, Input, Select, Form } from "antd";
import type { RadioChangeEvent } from "antd";
import { Calendar } from "lucide-react";
import toast from "react-hot-toast";
import Countries from "@/lib/data/countries.json";
import { useAppSelector, useAppStore } from "@/state/hooks";
import { setPaymentMethodFormValues } from "@/state/slices/finance.slice";
import dayjs from "dayjs";

interface GeneralInformationFormProps {
  handleNextStep: () => void;
}

interface FormValues {
  method_type: string;
  first_name: string;
  last_name: string;
  date_of_birth: dayjs.Dayjs | null;
  phone_number: string;
  country: string;
  address_one: string;
  address_two: string;
  state: string;
  post_code: string;
  business_name: string;
}

export default function GeneralInformationForm({ handleNextStep }: GeneralInformationFormProps) {
  const [form] = Form.useForm<FormValues>();
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>("INDIVIDUAL");

  const store = useAppStore();
  const generalData = useAppSelector(
    (state) => state.financeStore.paymentMethodFormValues
  );

  useEffect(() => {
    if (generalData?.method_type) {
      form.setFieldsValue({
        method_type: generalData.method_type,
        first_name: generalData.first_name,
        last_name: generalData.last_name,
        date_of_birth: generalData.date_of_birth ? dayjs(generalData.date_of_birth) : null,
        phone_number: generalData.phone_number,
        country: generalData.country,
        address_one: generalData.address_one,
        address_two: generalData.address_two,
        state: generalData.state,
        post_code: generalData.post_code,
        business_name: generalData.business_name,
      });
      setSelectedPaymentType(generalData.method_type);
    }
  }, [generalData, form]);

  const onFinish = (values: FormValues) => {
    const formData = {
      ...values,
      date_of_birth: values.date_of_birth?.toISOString(),
    };
    store.dispatch(setPaymentMethodFormValues(formData));
    toast.success("Information saved");
    handleNextStep();
  };

  const handleTypeChange = (e: RadioChangeEvent) => {
    setSelectedPaymentType(e.target.value as string);
    form.setFieldValue("method_type", e.target.value);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ method_type: "INDIVIDUAL" }}
    >
      {/* Account Type Selection */}
      <Form.Item
        label={<span className="font-medium">Account Type</span>}
        name="method_type"
        rules={[{ required: true, message: "Please select account type" }]}
      >
        <Radio.Group onChange={handleTypeChange} value={selectedPaymentType}>
          <div className="flex gap-4 flex-wrap">
            <label
              className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                selectedPaymentType === "INDIVIDUAL"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Radio value="INDIVIDUAL" />
              <span className="font-medium">Individual</span>
            </label>
            <label
              className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                selectedPaymentType === "BUSINESS"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Radio value="BUSINESS" />
              <span className="font-medium">Business</span>
            </label>
          </div>
        </Radio.Group>
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedPaymentType === "BUSINESS" ? (
          <>
            {/* Business Name */}
            <div className="md:col-span-2">
              <Form.Item
                label={<span className="font-medium">Registered Business Name <span className="text-red-500">*</span></span>}
                name="business_name"
                rules={[
                  { required: true, message: "Business name is required" },
                  { min: 2, message: "Business name must be at least 2 characters" },
                  { max: 100, message: "Business name cannot exceed 100 characters" },
                ]}
              >
                <Input placeholder="Enter Registered Business Name" size="large" />
              </Form.Item>
            </div>

            {/* First Name (Optional for Business) */}
            <Form.Item
              label={<span className="font-medium">First Name <span className="text-gray-400">(Optional)</span></span>}
              name="first_name"
              rules={[
                { max: 50, message: "First name cannot exceed 50 characters" },
              ]}
            >
              <Input placeholder="Enter First Name" size="large" />
            </Form.Item>

            {/* Last Name (Optional for Business) */}
            <Form.Item
              label={<span className="font-medium">Last Name <span className="text-gray-400">(Optional)</span></span>}
              name="last_name"
              rules={[
                { max: 50, message: "Last name cannot exceed 50 characters" },
              ]}
            >
              <Input placeholder="Enter Last Name" size="large" />
            </Form.Item>
          </>
        ) : (
          <>
            {/* First Name */}
            <Form.Item
              label={<span className="font-medium">First Name <span className="text-red-500">*</span></span>}
              name="first_name"
              rules={[
                { required: true, message: "First name is required" },
                { min: 2, message: "First name must be at least 2 characters" },
                { max: 50, message: "First name cannot exceed 50 characters" },
              ]}
            >
              <Input placeholder="Enter First Name" size="large" />
            </Form.Item>

            {/* Last Name */}
            <Form.Item
              label={<span className="font-medium">Last Name <span className="text-red-500">*</span></span>}
              name="last_name"
              rules={[
                { required: true, message: "Last name is required" },
                { min: 2, message: "Last name must be at least 2 characters" },
                { max: 50, message: "Last name cannot exceed 50 characters" },
              ]}
            >
              <Input placeholder="Enter Last Name" size="large" />
            </Form.Item>

            {/* Date of Birth */}
            <div className="md:col-span-2">
              <Form.Item
                label={<span className="font-medium">Date of Birth <span className="text-red-500">*</span></span>}
                name="date_of_birth"
                rules={[{ required: true, message: "Date of birth is required" }]}
              >
                <DatePicker
                  size="large"
                  className="w-full"
                  format="MMMM D, YYYY"
                  placeholder="Select Date of Birth"
                  disabledDate={(current) => current && current > dayjs()}
                  suffixIcon={<Calendar size={18} className="text-gray-400" />}
                />
              </Form.Item>
            </div>
          </>
        )}

        {/* Phone Number */}
        <Form.Item
          label={<span className="font-medium">Phone Number <span className="text-red-500">*</span></span>}
          name="phone_number"
          rules={[
            { required: true, message: "Phone number is required" },
            {
              pattern: /^\+?[1-9]\d{0,14}$/,
              message: "Please enter a valid phone number",
            },
          ]}
        >
          <Input
            placeholder="Enter Phone Number (e.g., +1234567890)"
            size="large"
            onChange={(e) => {
              let value = e.target.value.replace(/[^+\d]/g, "");
              if (value.startsWith("++")) value = value.replace(/^\++/, "+");
              form.setFieldValue("phone_number", value);
            }}
          />
        </Form.Item>

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
          />
        </Form.Item>

        {/* Address 1 */}
        <Form.Item
          label={<span className="font-medium">Address 1 <span className="text-red-500">*</span></span>}
          name="address_one"
          rules={[
            { required: true, message: "Address is required" },
            { max: 200, message: "Address cannot exceed 200 characters" },
          ]}
        >
          <Input placeholder="Enter Address 1" size="large" />
        </Form.Item>

        {/* Address 2 */}
        <Form.Item
          label={<span className="font-medium">Address 2 <span className="text-gray-400">(Optional)</span></span>}
          name="address_two"
          rules={[
            { max: 200, message: "Address cannot exceed 200 characters" },
          ]}
        >
          <Input placeholder="Enter Address 2 (Optional)" size="large" />
        </Form.Item>

        {/* Region/State */}
        <Form.Item
          label={<span className="font-medium">Region <span className="text-red-500">*</span></span>}
          name="state"
          rules={[
            { required: true, message: "Region is required" },
            { min: 2, message: "Region must be at least 2 characters" },
            { max: 100, message: "Region cannot exceed 100 characters" },
          ]}
        >
          <Input placeholder="Enter Region" size="large" />
        </Form.Item>

        {/* Postal Code */}
        <Form.Item
          label={<span className="font-medium">Postal Code <span className="text-red-500">*</span></span>}
          name="post_code"
          rules={[
            { required: true, message: "Postal code is required" },
            { max: 20, message: "Postal code cannot exceed 20 characters" },
          ]}
        >
          <Input placeholder="Enter Postal Code" size="large" />
        </Form.Item>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-6">
        <Button type="primary" htmlType="submit" size="large">
          Save & Continue
        </Button>
      </div>
    </Form>
  );
}
