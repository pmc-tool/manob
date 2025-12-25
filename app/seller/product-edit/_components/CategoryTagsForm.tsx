"use client";

import { useState, useEffect } from "react";
import { Form, Input, Select, Button, Radio, Checkbox, Tag } from "antd";
import toast from "react-hot-toast";

interface CategoryTagsFormProps {
  productId: string;
  productAttr: any;
  onNext: () => void;
  onBack: () => void;
}

interface AttributeSelection {
  attr_type_id: number;
  attr_type_name: string;
  attr_id: number;
  attr_name: string;
}

const YES_NO_OPTIONS = [
  { value: "YES", label: "Yes" },
  { value: "NO", label: "No" },
  { value: "NA", label: "N/A" },
];

const LAYOUT_OPTIONS = [
  { value: "FIXED", label: "Fixed" },
  { value: "RESPONSIVE", label: "Responsive" },
  { value: "NA", label: "N/A" },
];

const INPUT_TITLE_MIN = 10;
const INPUT_TITLE_MAX = 100;
const INPUT_TAG_MAX = 30;

export default function CategoryTagsForm({
  productId,
  productAttr,
  onNext,
  onBack,
}: CategoryTagsFormProps) {
  const [form] = Form.useForm();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [checkedValues, setCheckedValues] = useState<AttributeSelection[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock draft product info
  const draftProductInfo = {
    is_gutenberg_optimized: "NA",
    is_high_resolution: "NA",
    is_widget_ready: "NA",
    layout_columns: 12,
    layout_type: "RESPONSIVE",
    product_demo_url: "",
    product_doc_url: "",
    product_tags: [],
    product_attributes: [],
  };

  // Initialize form with existing data
  useEffect(() => {
    if (draftProductInfo) {
      form.setFieldsValue({
        is_gutenberg_optimized: draftProductInfo.is_gutenberg_optimized || "NA",
        is_high_resolution: draftProductInfo.is_high_resolution || "NA",
        is_widget_ready: draftProductInfo.is_widget_ready || "NA",
        layout_columns: draftProductInfo.layout_columns || 12,
        layout_type: draftProductInfo.layout_type || "FIXED",
        product_demo_url: draftProductInfo.product_demo_url || "",
        product_doc_url: draftProductInfo.product_doc_url || "",
      });

      // Set tags
      if (draftProductInfo.product_tags) {
        const previousTags = draftProductInfo.product_tags.map((item: any) => item.tag);
        setTags(previousTags);
      }

      // Set attribute selections
      if (draftProductInfo.product_attributes) {
        const selectedAttributes = draftProductInfo.product_attributes.map((attr: any) => ({
          attr_type_id: attr.attribute_type_id,
          attr_type_name: attr.attribute_type_title,
          attr_id: attr.attribute_id,
          attr_name: attr.attribute_title,
        }));
        setCheckedValues(selectedAttributes);
      }
    }
  }, [draftProductInfo, form]);

  // Handle attribute checkbox change
  const handleAttributeChange = (
    attrTypeId: number,
    attrTypeName: string,
    attrId: number,
    attrName: string,
    checked: boolean
  ) => {
    const newSelection: AttributeSelection = {
      attr_type_id: attrTypeId,
      attr_type_name: attrTypeName,
      attr_id: attrId,
      attr_name: attrName,
    };

    if (checked) {
      setCheckedValues([...checkedValues, newSelection]);
    } else {
      setCheckedValues(checkedValues.filter((item) => item.attr_id !== attrId));
    }
  };

  // Check if attribute is selected
  const isAttributeSelected = (attrId: number) => {
    return checkedValues.some((item) => item.attr_id === attrId);
  };

  // Handle tag input
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag) && tags.length < 15) {
        setTags([...tags, newTag]);
        setTagInput("");
      } else if (tags.length >= 15) {
        toast.error("Maximum 15 tags allowed");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const onFinish = async (values: any) => {
    if (tags.length === 0) {
      toast.error("Please add at least one tag");
      return;
    }

    // Validate required attributes
    if (productAttr?.attributes?.length > 0) {
      for (const attrGroup of productAttr.attributes) {
        const hasSelectedAttr = checkedValues.some(
          (cv) => cv.attr_type_id === attrGroup.type_id
        );
        if (!hasSelectedAttr) {
          toast.error(`Please select at least one ${attrGroup.type_name}`);
          return;
        }
      }
    }

    setIsLoading(true);

    const payload = {
      productId,
      product_attributes: checkedValues,
      is_gutenberg_optimized: values.is_gutenberg_optimized || "NA",
      is_high_resolution: values.is_high_resolution || "NA",
      is_widget_ready: values.is_widget_ready || "NA",
      layout_columns: values.layout_columns || 12,
      layout_type: values.layout_type || "FIXED",
      product_demo_url: values.product_demo_url,
      product_doc_url: values.product_doc_url,
      product_tags: tags,
    };

    console.log("Mock save payload:", payload);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsLoading(false);
    toast.success("Category & tags saved!");
    onNext();
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category & Attributes</h3>

        {/* Conditional Radio Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {productAttr?.is_guterberg_enable && (
            <Form.Item
              name="is_gutenberg_optimized"
              label={
                <span className="font-medium">
                  Gutenberg Optimized <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "Required" }]}
            >
              <Radio.Group options={YES_NO_OPTIONS} optionType="button" buttonStyle="solid" />
            </Form.Item>
          )}

          {productAttr?.is_highres_enable && (
            <Form.Item
              name="is_high_resolution"
              label={
                <span className="font-medium">
                  High Resolution <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "Required" }]}
            >
              <Radio.Group options={YES_NO_OPTIONS} optionType="button" buttonStyle="solid" />
            </Form.Item>
          )}

          {productAttr?.is_widget_enable && (
            <Form.Item
              name="is_widget_ready"
              label={
                <span className="font-medium">
                  Widget Ready <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "Required" }]}
            >
              <Radio.Group options={YES_NO_OPTIONS} optionType="button" buttonStyle="solid" />
            </Form.Item>
          )}
        </div>

        {/* Dynamic Attributes */}
        {productAttr?.attributes?.length > 0 &&
          productAttr.attributes.map((attrGroup: any) => (
            <div key={attrGroup.type_id} className="mb-4">
              <label className="block font-medium mb-2">
                {attrGroup.type_name} <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {attrGroup.attributes.map((attr: any) => (
                  <label
                    key={attr.id}
                    className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-all ${
                      isAttributeSelected(attr.id)
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Checkbox
                      checked={isAttributeSelected(attr.id)}
                      onChange={(e) =>
                        handleAttributeChange(
                          attrGroup.type_id,
                          attrGroup.type_name,
                          attr.id,
                          attr.display_text,
                          e.target.checked
                        )
                      }
                    />
                    <span className="text-sm font-medium">{attr.display_text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

        {/* Columns & Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productAttr?.is_column_enable && (
            <Form.Item
              name="layout_columns"
              label={
                <span className="font-medium">
                  Columns <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "Required" }]}
            >
              <Select size="large" placeholder="Select columns">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                  <Select.Option key={num} value={num}>
                    {num} {num === 1 ? "Column" : "Columns"}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {productAttr?.is_layout_enable && (
            <Form.Item
              name="layout_type"
              label={
                <span className="font-medium">
                  Layout <span className="text-red-500">*</span>
                </span>
              }
              rules={[{ required: true, message: "Required" }]}
            >
              <Select size="large" options={LAYOUT_OPTIONS} placeholder="Select layout type" />
            </Form.Item>
          )}
        </div>

        {/* Demo URL */}
        <Form.Item
          name="product_demo_url"
          label={
            <span className="font-medium">
              Demo URL <span className="text-red-500">*</span>
            </span>
          }
          rules={[
            { required: true, message: "Demo URL is required" },
            {
              pattern: /^(https?:\/\/)?([\w\-]+\.)+[\w\-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
              message: "Enter a valid URL",
            },
            { min: INPUT_TITLE_MIN, message: `Minimum ${INPUT_TITLE_MIN} characters` },
            { max: INPUT_TITLE_MAX, message: `Maximum ${INPUT_TITLE_MAX} characters` },
          ]}
          extra="Provide a live demo URL where buyers can preview your product"
        >
          <Input placeholder="https://example.com/demo/" size="large" />
        </Form.Item>

        {/* Documentation URL */}
        <Form.Item
          name="product_doc_url"
          label={
            <span className="font-medium">
              Online Documentation URL <span className="text-red-500">*</span>
            </span>
          }
          rules={[
            { required: true, message: "Documentation URL is required" },
            {
              pattern: /^(https?:\/\/)?([\w\-]+\.)+[\w\-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
              message: "Enter a valid URL",
            },
            { min: INPUT_TITLE_MIN, message: `Minimum ${INPUT_TITLE_MIN} characters` },
            { max: INPUT_TITLE_MAX, message: `Maximum ${INPUT_TITLE_MAX} characters` },
          ]}
          extra="Link to your product documentation"
        >
          <Input placeholder="https://example.com/documentation/" size="large" />
        </Form.Item>

        {/* Tags */}
        <div>
          <label className="block font-medium mb-2">
            Tags <span className="text-red-500">*</span>
          </label>
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Enter tags (Press Enter to add)"
            size="large"
            maxLength={INPUT_TAG_MAX}
            disabled={tags.length >= 15}
          />
          <p className="text-xs text-gray-500 mt-1">
            Add up to 15 relevant keywords separated by Enter. Tags help buyers find your product.
          </p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <Tag
                  key={tag}
                  closable
                  onClose={() => handleRemoveTag(tag)}
                  className="px-3 py-1 text-sm"
                >
                  {tag}
                </Tag>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-400 mt-2">{tags.length}/15 tags added</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t border-gray-100">
          <Button size="large" onClick={onBack}>
            Previous
          </Button>
          <Button type="primary" htmlType="submit" size="large" loading={isLoading}>
            Save & Continue
          </Button>
        </div>
      </div>
    </Form>
  );
}
