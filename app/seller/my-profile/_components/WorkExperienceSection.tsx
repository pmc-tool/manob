'use client';

import { useState } from 'react';
import { Modal, Form, Input, DatePicker, Checkbox, message, Popconfirm } from 'antd';
import { FilePlus, Pencil, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import {
  useAddExperienceMutation,
  useExperienceDeleteMutation,
  useExperienceEditMutation,
} from '@/state/services/user.service';

const { TextArea } = Input;

interface Experience {
  id: number;
  company_name: string;
  designation: string;
  start_date: string;
  end_date: string | null;
  description: string;
  currently_working: boolean;
}

interface WorkExperienceSectionProps {
  experiences: Experience[];
  modifyButton?: boolean;
}

export default function WorkExperienceSection({
  experiences,
  modifyButton = true,
}: WorkExperienceSectionProps) {
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);

  const [addExperience, { isLoading: addLoading }] = useAddExperienceMutation();
  const [updateExperience, { isLoading: updateLoading }] = useExperienceEditMutation();
  const [deleteExperience] = useExperienceDeleteMutation();

  const openAddModal = () => {
    form.resetFields();
    setEditingExperience(null);
    setIsCurrentlyWorking(false);
    setShowModal(true);
  };

  const openEditModal = (exp: Experience) => {
    setEditingExperience(exp);
    setIsCurrentlyWorking(exp.currently_working);
    form.setFieldsValue({
      company_name: exp.company_name,
      designation: exp.designation,
      start_date: exp.start_date ? dayjs(exp.start_date) : null,
      end_date: exp.end_date ? dayjs(exp.end_date) : null,
      description: exp.description,
      currently_working: exp.currently_working,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteExperience(id).unwrap();
      message.success('Experience deleted successfully');
    } catch (error) {
      message.error('Failed to delete experience');
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        company_name: values.company_name,
        designation: values.designation,
        start_date: values.start_date?.format('YYYY-MM-DD'),
        end_date: isCurrentlyWorking ? null : values.end_date?.format('YYYY-MM-DD'),
        description: values.description,
        currently_working: isCurrentlyWorking,
      };

      if (editingExperience) {
        const result = await updateExperience({ ...data, id: editingExperience.id }).unwrap();
        if (result?.statusCode === 200) {
          message.success('Experience updated successfully');
          setShowModal(false);
        }
      } else {
        const result = await addExperience(data).unwrap();
        if (result?.statusCode === 201) {
          message.success('Experience added successfully');
          setShowModal(false);
        }
      }
    } catch (error) {
      message.error('Failed to save experience');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Present';
    return dayjs(dateString).format('MMM YYYY');
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h5 className="text-lg font-semibold text-gray-900">Work & Experience</h5>
          {modifyButton && (
            <button
              type="button"
              onClick={openAddModal}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Add Experience"
            >
              <FilePlus size={18} className="text-primary" />
            </button>
          )}
        </div>

        {experiences?.length > 0 ? (
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="relative pl-6 pb-4 border-l-2 border-gray-200 last:pb-0"
              >
                <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-primary" />
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-grow">
                    <h6 className="font-medium text-gray-900">{exp.designation}</h6>
                    <p className="text-sm text-gray-600">{exp.company_name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                    </p>
                    {exp.description && (
                      <p
                        className="text-sm text-gray-600 mt-2"
                        dangerouslySetInnerHTML={{ __html: exp.description }}
                      />
                    )}
                  </div>
                  {modifyButton && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditModal(exp)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} className="text-gray-500" />
                      </button>
                      <Popconfirm
                        title="Delete Experience"
                        description="Are you sure you want to delete this experience?"
                        onConfirm={() => handleDelete(exp.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <button
                          type="button"
                          className="p-1.5 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </Popconfirm>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No work experience added yet.</p>
        )}
      </div>

      {/* Add/Edit Experience Modal */}
      <Modal
        title={editingExperience ? 'Edit Experience' : 'Add Experience'}
        open={showModal}
        onOk={handleSave}
        onCancel={() => setShowModal(false)}
        confirmLoading={addLoading || updateLoading}
        okText="Save"
        centered
        width={600}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="company_name"
              label="Company Name"
              rules={[{ required: true, message: 'Company name is required' }]}
            >
              <Input placeholder="Enter company name" />
            </Form.Item>
            <Form.Item
              name="designation"
              label="Job Title"
              rules={[{ required: true, message: 'Job title is required' }]}
            >
              <Input placeholder="Enter job title" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="start_date"
              label="Start Date"
              rules={[{ required: true, message: 'Start date is required' }]}
            >
              <DatePicker className="w-full" picker="month" />
            </Form.Item>
            <Form.Item
              name="end_date"
              label="End Date"
              rules={[
                {
                  required: !isCurrentlyWorking,
                  message: 'End date is required',
                },
              ]}
            >
              <DatePicker
                className="w-full"
                picker="month"
                disabled={isCurrentlyWorking}
              />
            </Form.Item>
          </div>
          <Form.Item name="currently_working" valuePropName="checked">
            <Checkbox
              checked={isCurrentlyWorking}
              onChange={(e) => setIsCurrentlyWorking(e.target.checked)}
            >
              I currently work here
            </Checkbox>
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={4} placeholder="Describe your role and responsibilities..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
