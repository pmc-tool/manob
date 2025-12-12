// MIGRATION: Seller product form from PMC
// VIPER: Visual consistency with Engine design system
// CONTRACT: Uses sellerApi for data operations

'use client';

import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Upload,
  message,
  Card,
  Space,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { sellerApi } from '@/lib/api/seller';
import { productsApi } from '@/lib/api/products';
import type { Product, ProductCreateRequest, Category } from '@/lib/api/types';
import { handleError } from '@/lib/api/error-handler';
import { LoadingState } from '@/components/pmc-migrated/shared/LoadingState';

const { TextArea } = Input;
const { Option } = Select;

interface SellerProductFormProps {
  productId?: string;
  initialData?: Product;
}

/**
 * Seller Product Form Component
 * MIGRATION: Create/edit product form with image upload
 */
export function SellerProductForm({ productId, initialData }: SellerProductFormProps) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!!productId && !initialData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [uploading, setUploading] = useState(false);

  const isEditing = !!productId;

  // Fetch categories and product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesData = await productsApi.getCategories();
        setCategories(categoriesData.categories);

        // Fetch product if editing and no initial data
        if (productId && !initialData) {
          const product = await sellerApi.getProduct(productId);
          form.setFieldsValue({
            title: product.title,
            description: product.description,
            price: product.price,
            currency: product.currency,
            categoryId: product.categoryId,
            stock: product.stock,
            tags: product.tags,
          });
          setImages(product.images);
        } else if (initialData) {
          form.setFieldsValue({
            title: initialData.title,
            description: initialData.description,
            price: initialData.price,
            currency: initialData.currency,
            categoryId: initialData.categoryId,
            stock: initialData.stock,
            tags: initialData.tags,
          });
        }
      } catch (err) {
        handleError(err as Parameters<typeof handleError>[0], { showToast: true });
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [productId, initialData, form]);

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const result = await sellerApi.uploadImage(file);
      setImages((prev) => [...prev, result.url]);
      message.success('Image uploaded successfully');
    } catch (err) {
      handleError(err as Parameters<typeof handleError>[0], { showToast: true });
    } finally {
      setUploading(false);
    }
    return false; // Prevent default upload behavior
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values: ProductCreateRequest) => {
    if (images.length === 0) {
      message.error('Please upload at least one image');
      return;
    }

    try {
      setLoading(true);
      const data = { ...values, images };

      if (isEditing) {
        await sellerApi.updateProduct(productId!, data);
        message.success('Product updated successfully');
      } else {
        await sellerApi.createProduct(data);
        message.success('Product created successfully');
      }

      router.push('/dashboard/products');
    } catch (err) {
      handleError(err as Parameters<typeof handleError>[0], { showToast: true });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <LoadingState message="Loading product data..." />;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        currency: 'USD',
        stock: 0,
        tags: [],
      }}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Product Information" className="rounded-2xl">
            <Form.Item
              name="title"
              label="Product Title"
              rules={[{ required: true, message: 'Please enter product title' }]}
            >
              <Input placeholder="Enter product title" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter description' }]}
            >
              <TextArea rows={6} placeholder="Enter product description" />
            </Form.Item>

            <Form.Item
              name="categoryId"
              label="Category"
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select placeholder="Select category">
                {categories.map((cat) => (
                  <Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="tags" label="Tags">
              <Select
                mode="tags"
                placeholder="Add tags (press Enter to add)"
                tokenSeparators={[',']}
              />
            </Form.Item>
          </Card>

          {/* Images */}
          <Card title="Product Images" className="rounded-2xl">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {images.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg border border-gray-200"
                >
                  <Image
                    src={url}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-md hover:bg-red-50"
                  >
                    <DeleteOutlined className="text-red-500" />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 rounded bg-blue-600 px-2 py-0.5 text-xs text-white">
                      Main
                    </span>
                  )}
                </div>
              ))}
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={handleImageUpload}
                disabled={uploading}
              >
                <div className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50">
                  <PlusOutlined className="text-2xl text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">
                    {uploading ? 'Uploading...' : 'Add Image'}
                  </span>
                </div>
              </Upload>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              First image will be used as the main product image
            </p>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card title="Pricing" className="rounded-2xl">
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: 'Please enter price' }]}
            >
              <InputNumber
                min={0}
                step={0.01}
                className="w-full"
                placeholder="0.00"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
              />
            </Form.Item>

            <Form.Item name="currency" label="Currency">
              <Select>
                <Option value="USD">USD ($)</Option>
                <Option value="EUR">EUR (€)</Option>
                <Option value="GBP">GBP (£)</Option>
              </Select>
            </Form.Item>
          </Card>

          {/* Inventory */}
          <Card title="Inventory" className="rounded-2xl">
            <Form.Item
              name="stock"
              label="Stock Quantity"
              rules={[{ required: true, message: 'Please enter stock quantity' }]}
            >
              <InputNumber min={0} className="w-full" placeholder="0" />
            </Form.Item>
          </Card>

          {/* Actions */}
          <Card className="rounded-2xl">
            <Space direction="vertical" className="w-full">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                {isEditing ? 'Update Product' : 'Create Product'}
              </Button>
              <Button
                block
                onClick={() => router.push('/dashboard/products')}
              >
                Cancel
              </Button>
            </Space>
          </Card>
        </div>
      </div>
    </Form>
  );
}

export default SellerProductForm;
