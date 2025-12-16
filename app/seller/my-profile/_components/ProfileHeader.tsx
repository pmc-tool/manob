'use client';

import { useState, useEffect } from 'react';
import { Modal, Form, Input, Progress, Rate, Upload, message } from 'antd';
import { Pencil, Camera } from 'lucide-react';
import Image from 'next/image';
import {
  useUpdateProfileMutation,
  useUploadImgMutation,
} from '@/state/services/user.service';

interface ProfileHeaderProps {
  id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  completionPercentage?: number;
  modifyButton?: boolean;
  badges?: Array<{ badge_icon: string; badge_name: string }>;
}

export default function ProfileHeader({
  firstName,
  lastName,
  email,
  avatar,
  rating,
  reviewsCount,
  completionPercentage,
  modifyButton = true,
  badges = [],
}: ProfileHeaderProps) {
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [updateProfile, { isLoading: updateLoading }] = useUpdateProfileMutation();
  const [uploadImage] = useUploadImgMutation();

  useEffect(() => {
    if (firstName) {
      form.setFieldsValue({
        first_name: firstName,
        last_name: lastName,
      });
    }
  }, [firstName, lastName, form]);

  const handleImageChange = async (file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      message.error('Please upload a valid image file (PNG, JPEG, JPG).');
      return false;
    }

    if (file.size > 1 * 1024 * 1024) {
      message.error('File size exceeds 1MB limit.');
      return false;
    }

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const result = await uploadImage(file).unwrap();
      if (result?.statusCode === 200) {
        message.success('Profile image updated successfully');
      }
    } catch (error) {
      message.error('Failed to upload image');
    }

    return false; // Prevent default upload
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const result = await updateProfile(values).unwrap();
      if (result?.statusCode === 200) {
        message.success('Display name updated successfully');
        setShowModal(false);
      }
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  const displayName = `${firstName} ${lastName}`.trim() || 'User';

  return (
    <>
      <div className="bg-gray-50 px-4 py-5 md:py-6 rounded-xl mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
          {/* Avatar Section */}
          <div className="flex-shrink-0">
            <div className="relative inline-block">
              <div className="w-[90px] h-[90px] rounded-full overflow-hidden bg-gray-200">
                {(imagePreview || avatar) ? (
                  <Image
                    src={imagePreview || avatar}
                    alt={displayName}
                    width={90}
                    height={90}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-gray-500 bg-gray-300">
                    {firstName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              {modifyButton && (
                <Upload
                  accept=".png,.jpg,.jpeg"
                  showUploadList={false}
                  beforeUpload={handleImageChange}
                  className="absolute bottom-0 right-0"
                >
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Camera size={14} className="text-gray-600" />
                  </button>
                </Upload>
              )}
              <span className="absolute bottom-1 right-8 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-grow">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <h4 className="text-xl font-medium text-gray-900">{displayName}</h4>
              {modifyButton && (
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  title="Edit Profile Name"
                >
                  <Pencil size={16} className="text-primary" />
                </button>
              )}
            </div>

            {email && <p className="text-gray-600 mb-2">{email}</p>}

            {/* Rating */}
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm">
              <Rate disabled allowHalf value={rating} className="text-sm" />
              <span className="text-gray-600">
                {rating.toFixed(1)} ({reviewsCount} reviews)
              </span>
            </div>

            {/* Badges */}
            {badges.length > 0 && (
              <div className="flex gap-2 mt-3 justify-center md:justify-start">
                {badges.map((badge, index) => (
                  <Image
                    key={index}
                    src={badge.badge_icon}
                    alt={badge.badge_name}
                    width={30}
                    height={30}
                    title={badge.badge_name}
                    unoptimized
                  />
                ))}
              </div>
            )}
          </div>

          {/* Completion Percentage */}
          {completionPercentage !== undefined && completionPercentage > 0 && (
            <div className="flex-shrink-0 w-full md:w-auto md:max-w-[200px]">
              <h4 className="text-2xl font-semibold text-gray-900 mb-1">
                {completionPercentage}%
              </h4>
              <Progress
                percent={completionPercentage}
                showInfo={false}
                strokeColor="#22c55e"
                trailColor="#e5e7eb"
                size="small"
              />
              <p className="text-xs text-gray-500 mt-1">Account Completion</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Name Modal */}
      <Modal
        title="Edit Display Name"
        open={showModal}
        onOk={handleSave}
        onCancel={() => setShowModal(false)}
        confirmLoading={updateLoading}
        okText="Save Changes"
        centered
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="first_name"
            label="First Name"
            rules={[
              { required: true, message: 'First name is required' },
              { min: 2, message: 'First name must be at least 2 characters' },
              { max: 50, message: 'First name cannot exceed 50 characters' },
            ]}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[
              { required: true, message: 'Last name is required' },
              { min: 2, message: 'Last name must be at least 2 characters' },
              { max: 50, message: 'Last name cannot exceed 50 characters' },
            ]}
          >
            <Input placeholder="Enter last name" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
