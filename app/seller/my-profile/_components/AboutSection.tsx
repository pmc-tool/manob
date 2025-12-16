'use client';

import { useState, useEffect } from 'react';
import { Modal, Form, message } from 'antd';
import { Pencil } from 'lucide-react';
import TextArea from 'antd/es/input/TextArea';
import { useUpdateProfileMutation } from '@/state/services/user.service';

interface AboutSectionProps {
  title: string;
  initialText: string;
  wordLimit?: number;
  modifyButton?: boolean;
}

export default function AboutSection({
  title,
  initialText,
  wordLimit = 50,
  modifyButton = true,
}: AboutSectionProps) {
  const [form] = Form.useForm();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [aboutText, setAboutText] = useState(initialText);

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  useEffect(() => {
    setAboutText(initialText);
    form.setFieldsValue({ about_me: initialText });
  }, [initialText, form]);

  const words = initialText?.split(' ') || [];
  const visibleText = words.slice(0, wordLimit).join(' ');
  const remainingText = words.slice(wordLimit).join(' ');

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const result = await updateProfile(values).unwrap();
      if (result?.statusCode === 200) {
        message.success('About section updated successfully');
        setShowModal(false);
      }
    } catch (error) {
      message.error('Failed to update about section');
    }
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h5 className="text-lg font-semibold text-gray-900">{title}</h5>
          {modifyButton && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Edit About Me"
            >
              <Pencil size={16} className="text-primary" />
            </button>
          )}
        </div>
        <div className="text-gray-600 leading-relaxed">
          {initialText ? (
            <>
              {visibleText}
              {!isExpanded && words.length > wordLimit && (
                <>
                  ...{' '}
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="text-primary font-medium hover:underline"
                  >
                    Read More
                  </button>
                </>
              )}
              {isExpanded && (
                <>
                  {remainingText}{' '}
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-primary font-medium hover:underline"
                  >
                    Read Less
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No information available</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit About Modal */}
      <Modal
        title="About Me"
        open={showModal}
        onOk={handleSave}
        onCancel={() => setShowModal(false)}
        confirmLoading={isLoading}
        okText="Save Changes"
        centered
        width={500}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="about_me"
            label="About Me"
            rules={[
              { required: true, message: 'This field is required' },
              { min: 50, message: 'About must be at least 50 characters' },
              { max: 600, message: 'About cannot exceed 600 characters' },
            ]}
          >
            <TextArea
              rows={6}
              placeholder="Write something about yourself..."
              showCount
              maxLength={600}
              onChange={(e) => setAboutText(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
