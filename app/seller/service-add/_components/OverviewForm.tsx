"use client";

import { useState, useEffect } from "react";
import { Form, Input, Select, Button, Tag } from "antd";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { ServiceDraft } from "../page";
import { useSaveServiceFirstStepMutation, useEditServiceFirstStepMutation } from "@/state/services/seller-service/service.service";
import { useGetServiceCategoriesQuery } from "@/state/services/seller-service/category.service";

interface OverviewFormProps {
  draft: ServiceDraft;
  onNext: (data: Partial<ServiceDraft>) => void;
  updateDraft: (data: Partial<ServiceDraft>) => void;
  editId: string | null;
}

// Mock categories for development
const mockCategories = [
  {
    id: 1,
    name: "Graphics & Design",
    sub_categories: [
      { id: 11, name: "Logo Design" },
      { id: 12, name: "Brand Style Guides" },
      { id: 13, name: "Business Cards" },
    ],
  },
  {
    id: 2,
    name: "Programming & Tech",
    sub_categories: [
      { id: 21, name: "Web Development" },
      { id: 22, name: "Mobile Apps" },
      { id: 23, name: "Desktop Applications" },
    ],
  },
  {
    id: 3,
    name: "Digital Marketing",
    sub_categories: [
      { id: 31, name: "Social Media Marketing" },
      { id: 32, name: "SEO" },
      { id: 33, name: "Content Marketing" },
    ],
  },
  {
    id: 4,
    name: "Writing & Translation",
    sub_categories: [
      { id: 41, name: "Articles & Blog Posts" },
      { id: 42, name: "Translation" },
      { id: 43, name: "Proofreading" },
    ],
  },
  {
    id: 5,
    name: "Video & Animation",
    sub_categories: [
      { id: 51, name: "Video Editing" },
      { id: 52, name: "Animation" },
      { id: 53, name: "Intros & Outros" },
    ],
  },
];

export default function OverviewForm({ draft, onNext, updateDraft, editId }: OverviewFormProps) {
  const [form] = Form.useForm();
  const [tags, setTags] = useState<string[]>(draft.search_tags || []);
  const [tagInput, setTagInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(draft.service_category_id || null);
  const [subCategories, setSubCategories] = useState<{ id: number; name: string }[]>([]);

  const { data: categoriesData } = useGetServiceCategoriesQuery();
  const [saveFirstStep, { isLoading: isSaving }] = useSaveServiceFirstStepMutation();
  const [editFirstStep, { isLoading: isEditing }] = useEditServiceFirstStepMutation();

  // Use mock data if API returns no data
  const categories = categoriesData?.data || mockCategories;

  // Set initial form values from draft
  useEffect(() => {
    if (draft.service_title) {
      form.setFieldsValue({
        service_title: draft.service_title,
        service_category_id: draft.service_category_id,
        service_subcategory_id: draft.service_subcategory_id,
      });
    }
  }, [draft, form]);

  // Update subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find((c: any) => c.id === selectedCategory);
      setSubCategories(category?.sub_categories || []);
    } else {
      setSubCategories([]);
    }
  }, [selectedCategory, categories]);

  const handleCategoryChange = (value: number) => {
    setSelectedCategory(value);
    form.setFieldValue("service_subcategory_id", undefined);
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    } else if (tags.length >= 5) {
      toast.error("Maximum 5 tags allowed");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const onFinish = async (values: any) => {
    if (tags.length === 0) {
      toast.error("Please add at least one tag");
      return;
    }

    const payload = {
      service_title: values.service_title,
      service_category_id: values.service_category_id,
      service_subcategory_id: values.service_subcategory_id,
      search_tags: tags,
      service_meta: [], // Would be populated from metadata form
    };

    try {
      let result;
      if (editId || draft.id) {
        result = await editFirstStep({ ...payload, id: editId || draft.id }).unwrap();
      } else {
        result = await saveFirstStep(payload).unwrap();
      }

      if (result?.data?.id || result?.id) {
        const serviceId = result?.data?.id || result?.id;
        toast.success("Service overview saved");
        onNext({
          id: serviceId,
          ...payload,
        });
      } else {
        toast.error(result?.message || "Failed to save service");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save service");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <div className="space-y-6">
        {/* Service Title */}
        <Form.Item
          name="service_title"
          label={<span className="font-medium">Service Title <span className="text-red-500">*</span></span>}
          rules={[
            { required: true, message: "Service title is required" },
            { min: 10, message: "Title must be at least 10 characters" },
            { max: 80, message: "Title cannot exceed 80 characters" },
            {
              pattern: /^[a-zA-Z0-9\s]+$/,
              message: "Only alphanumeric characters and spaces allowed",
            },
          ]}
          extra="Use a clear, descriptive title that tells buyers what you offer"
        >
          <Input
            placeholder="I will design a professional logo for your business"
            size="large"
            showCount
            maxLength={80}
          />
        </Form.Item>

        {/* Category Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="service_category_id"
            label={<span className="font-medium">Category <span className="text-red-500">*</span></span>}
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select
              placeholder="Select a category"
              size="large"
              onChange={handleCategoryChange}
              options={categories.map((cat: any) => ({
                value: cat.id,
                label: cat.name,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="service_subcategory_id"
            label={<span className="font-medium">Sub-category <span className="text-red-500">*</span></span>}
            rules={[{ required: true, message: "Please select a sub-category" }]}
          >
            <Select
              placeholder="Select a sub-category"
              size="large"
              disabled={!selectedCategory}
              options={subCategories.map((sub) => ({
                value: sub.id,
                label: sub.name,
              }))}
            />
          </Form.Item>
        </div>

        {/* Tags */}
        <Form.Item
          label={<span className="font-medium">Search Tags <span className="text-red-500">*</span></span>}
          extra="Add up to 5 tags to help buyers find your service"
        >
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Enter a tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                size="large"
                maxLength={20}
              />
              <Button onClick={handleAddTag} size="large">
                Add Tag
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
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
            <p className="text-xs text-gray-500">{tags.length}/5 tags added</p>
          </div>
        </Form.Item>

        {/* Service Metadata - Placeholder for dynamic fields */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Service Attributes</h4>
          <p className="text-sm text-gray-500">
            Additional service attributes will appear here based on your selected category.
            These help buyers understand what's included in your service.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isSaving || isEditing}
          >
            Save & Continue
          </Button>
        </div>
      </div>
    </Form>
  );
}
