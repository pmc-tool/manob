"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Cascader } from "antd";
import type { CascaderProps } from "antd";
import toast from "react-hot-toast";

// Mock categories for development
const mockCategories = [
  {
    id: 1,
    title: "Graphics & Design",
    children: [
      { id: 11, title: "Logo Design" },
      { id: 12, title: "Brand Style Guides" },
      { id: 13, title: "Business Cards" },
    ],
  },
  {
    id: 2,
    title: "Programming & Tech",
    children: [
      { id: 21, title: "Web Development" },
      { id: 22, title: "Mobile Apps" },
      { id: 23, title: "Desktop Applications" },
    ],
  },
  {
    id: 3,
    title: "WordPress",
    children: [
      { id: 31, title: "Themes" },
      { id: 32, title: "Plugins" },
      { id: 33, title: "Templates" },
    ],
  },
  {
    id: 4,
    title: "Site Templates",
    children: [
      { id: 41, title: "Admin Templates" },
      { id: 42, title: "Landing Pages" },
      { id: 43, title: "Email Templates" },
    ],
  },
];

interface OverviewFormProps {
  productId: string;
  productInfo: any;
  onNext: () => void;
}

interface Option {
  value: number;
  label: string;
  children?: Option[];
  isLeaf?: boolean;
}

const INPUT_TITLE_MIN = 10;
const INPUT_TITLE_MAX = 100;
const INPUT_TEXT_AREA_MIN = 50;
const INPUT_TEXT_AREA_MAX = 500;

export default function OverviewForm({ productId, productInfo, onNext }: OverviewFormProps) {
  const [form] = Form.useForm();
  const [htmlDescription, setHtmlDescription] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<number[]>([]);
  const [categoryTree, setCategoryTree] = useState("");
  const [categoryTreeShow, setCategoryTreeShow] = useState("");
  const [selectedFirstValue, setSelectedFirstValue] = useState<{ value: number; label: string } | null>(null);
  const [selectedLastValue, setSelectedLastValue] = useState<{ value: number; label: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Use mock categories
  const parentCategories = mockCategories;

  // Format categories for cascader
  const formatCategories = (data: any[]): Option[] => {
    return data.map((item: any) => ({
      value: item.id,
      label: item.title || item.name,
      children: item.children ? formatCategories(item.children) : [],
      isLeaf: !item.children || item.children.length === 0,
    }));
  };

  // Initialize categories
  useEffect(() => {
    if (parentCategories) {
      const formatted = formatCategories(parentCategories);
      setCategoryOptions(formatted);
    }
  }, [parentCategories]);

  // Set initial form values from productInfo
  useEffect(() => {
    if (productInfo) {
      form.setFieldsValue({
        product_name: productInfo.product_name !== "Untitled Product" ? productInfo.product_name : "",
        short_description: productInfo.short_description !== "Product description placeholder" ? productInfo.short_description : "",
        key_feature_1: productInfo.key_feature_one || "",
        key_feature_2: productInfo.key_feature_two || "",
        key_feature_3: productInfo.key_feature_three || "",
      });
      setHtmlDescription(productInfo.full_description || "");

      // Parse category tree if exists
      if (productInfo.category_tree) {
        const tree = productInfo.category_tree.split("|");
        if (tree[0]) {
          const valuePath = tree[0].split("-").map(Number);
          const labelPath = tree[1] || "";
          setCategoryTreeShow(labelPath.replace(/-/g, " > "));
          setCategoryTree(productInfo.category_tree);
          setSelectedCategoryPath(valuePath);

          const labels = labelPath.split("-");
          setSelectedFirstValue({
            value: valuePath[0],
            label: labels[0],
          });
          setSelectedLastValue({
            value: valuePath[valuePath.length - 1],
            label: labels[labels.length - 1],
          });
        }
      }
    }
  }, [productInfo, form]);

  // Load subcategories dynamically (mock - already loaded)
  const loadData: CascaderProps<Option>["loadData"] = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    // In mock mode, children are already loaded
    if (!targetOption.children || targetOption.children.length === 0) {
      targetOption.isLeaf = true;
    }
    setCategoryOptions([...categoryOptions]);
  };

  // Handle category change
  const handleCategoryChange: CascaderProps<Option>["onChange"] = (value, selectedOptions) => {
    if (!value || value.length === 0) {
      setCategoryTree("");
      setCategoryTreeShow("");
      setSelectedFirstValue(null);
      setSelectedLastValue(null);
      setSelectedCategoryPath([]);
      return;
    }

    const valueString = value.join("-");
    const labelString = selectedOptions.map((o) => o.label).join("-");
    const treeString = `${valueString}|${labelString}`;

    setCategoryTree(treeString);
    setCategoryTreeShow(labelString.replace(/-/g, " > "));
    setSelectedCategoryPath(value as number[]);

    setSelectedFirstValue({
      value: (selectedOptions[0] as Option).value,
      label: (selectedOptions[0] as Option).label,
    });

    const lastOption = selectedOptions[selectedOptions.length - 1] as Option;
    setSelectedLastValue({
      value: lastOption.value,
      label: lastOption.label,
    });
  };

  const onFinish = async (values: any) => {
    if (!categoryTree || !selectedFirstValue || !selectedLastValue) {
      toast.error("Please select a category");
      return;
    }

    setIsLoading(true);

    // Mock save - just simulate delay and proceed
    const payload = {
      product_name: values.product_name,
      short_description: values.short_description,
      full_description: htmlDescription,
      key_feature_one: values.key_feature_1 || "",
      key_feature_two: values.key_feature_2 || "",
      key_feature_three: values.key_feature_3 || "",
      primary_category: selectedFirstValue.value,
      primary_category_name: selectedFirstValue.label,
      secondary_category: selectedLastValue.value,
      secondary_category_name: selectedLastValue.label,
      product_category_tree: categoryTree,
    };

    console.log("Mock save payload:", payload);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsLoading(false);
    toast.success("Product overview saved!");
    onNext();
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <div className="space-y-6">
        {/* Product Name */}
        <Form.Item
          name="product_name"
          label={
            <span className="font-medium">
              Product Name <span className="text-red-500">*</span>
            </span>
          }
          rules={[
            { required: true, message: "Product name is required" },
            { min: INPUT_TITLE_MIN, message: `Minimum ${INPUT_TITLE_MIN} characters` },
            { max: INPUT_TITLE_MAX, message: `Maximum ${INPUT_TITLE_MAX} characters` },
            {
              pattern: /^[a-zA-Z0-9\s]+$/,
              message: "Only letters, numbers, and spaces are allowed",
            },
          ]}
          extra="Enter a clear, descriptive name for your product"
        >
          <Input
            placeholder="e.g., Professional Admin Dashboard Template"
            size="large"
            showCount
            maxLength={INPUT_TITLE_MAX}
          />
        </Form.Item>

        {/* Category Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label={
              <span className="font-medium">
                Select Category <span className="text-red-500">*</span>
              </span>
            }
            required
            extra="Choose the most relevant category for your product"
          >
            <Cascader
              options={categoryOptions}
              loadData={loadData}
              onChange={handleCategoryChange}
              value={selectedCategoryPath}
              placeholder="Select a category"
              size="large"
              changeOnSelect
              expandTrigger="hover"
              displayRender={(labels) => labels.join(" > ")}
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="key_feature_1"
            label={<span className="font-medium">Key Feature 1</span>}
            rules={[{ max: INPUT_TITLE_MAX, message: `Maximum ${INPUT_TITLE_MAX} characters` }]}
          >
            <Input placeholder="e.g., Fully Responsive Design" size="large" />
          </Form.Item>
        </div>

        {/* Key Features 2 & 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="key_feature_2"
            label={<span className="font-medium">Key Feature 2</span>}
            rules={[{ max: INPUT_TITLE_MAX, message: `Maximum ${INPUT_TITLE_MAX} characters` }]}
          >
            <Input placeholder="e.g., Dark/Light Mode Support" size="large" />
          </Form.Item>

          <Form.Item
            name="key_feature_3"
            label={<span className="font-medium">Key Feature 3</span>}
            rules={[{ max: INPUT_TITLE_MAX, message: `Maximum ${INPUT_TITLE_MAX} characters` }]}
          >
            <Input placeholder="e.g., Well Documented" size="large" />
          </Form.Item>
        </div>

        {/* Short Description */}
        <Form.Item
          name="short_description"
          label={
            <span className="font-medium">
              Short Description <span className="text-red-500">*</span>
            </span>
          }
          rules={[
            { required: true, message: "Description is required" },
            { min: INPUT_TEXT_AREA_MIN, message: `Minimum ${INPUT_TEXT_AREA_MIN} characters` },
            { max: INPUT_TEXT_AREA_MAX, message: `Maximum ${INPUT_TEXT_AREA_MAX} characters` },
          ]}
          extra="Briefly describe your product and its main benefits"
        >
          <Input.TextArea
            placeholder="Describe your product's main features and what makes it unique..."
            rows={5}
            showCount
            maxLength={INPUT_TEXT_AREA_MAX}
          />
        </Form.Item>

        {/* HTML Description */}
        <Form.Item
          name="full_description"
          label={<span className="font-medium">Full Description (Optional)</span>}
          extra="Add a detailed description with HTML formatting if needed"
        >
          <Input.TextArea
            value={htmlDescription}
            onChange={(e) => setHtmlDescription(e.target.value)}
            placeholder="Add a detailed description for your product..."
            rows={8}
            showCount
            maxLength={5000}
          />
        </Form.Item>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Button type="primary" htmlType="submit" size="large" loading={isLoading}>
            Save & Continue
          </Button>
        </div>
      </div>
    </Form>
  );
}
