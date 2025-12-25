'use client';

import { useState } from 'react';
import { Modal, Form, Input, DatePicker, Checkbox, message, Popconfirm } from 'antd';
import { FilePlus, Pencil, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import {
  useAddEducationMutation,
  useDeleteEducationMutation,
  useEducationEditMutation,
} from '@/state/services/user.service';

const { TextArea } = Input;

interface Education {
  id: number;
  company_name: string; // institute name (mapped from institute)
  designation: string; // level of education
  major?: string;
  start_date: string;
  end_date: string | null;
  description: string;
  currently_working: boolean; // currently studying
}

interface EducationSectionProps {
  educations: Education[];
  modifyButton?: boolean;
}

export default function EducationSection({
  educations,
  modifyButton = true,
}: EducationSectionProps) {
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(false);

  const [addEducation, { isLoading: addLoading }] = useAddEducationMutation();
  const [updateEducation, { isLoading: updateLoading }] = useEducationEditMutation();
  const [deleteEducation] = useDeleteEducationMutation();

  const openAddModal = () => {
    form.resetFields();
    setEditingEducation(null);
    setIsCurrentlyStudying(false);
    setShowModal(true);
  };

  const openEditModal = (edu: Education) => {
    setEditingEducation(edu);
    setIsCurrentlyStudying(edu.currently_working);
    form.setFieldsValue({
      institute: edu.company_name,
      level_of_education: edu.designation,
      major: edu.major,
      starting_year: edu.start_date ? dayjs(edu.start_date) : null,
      passing_year: edu.end_date ? dayjs(edu.end_date) : null,
      about_education: edu.description,
      currently_studying: edu.currently_working,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEducation(id).unwrap();
      message.success('Education deleted successfully');
    } catch (error) {
      message.error('Failed to delete education');
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        institute: values.institute,
        level_of_education: values.level_of_education,
        major: values.major,
        starting_year: values.starting_year?.format('YYYY'),
        passing_year: isCurrentlyStudying ? null : values.passing_year?.format('YYYY'),
        about_education: values.about_education,
        currently_studying: isCurrentlyStudying,
      };

      if (editingEducation) {
        const result = await updateEducation({ ...data, id: editingEducation.id }).unwrap();
        if (result?.statusCode === 200) {
          message.success('Education updated successfully');
          setShowModal(false);
        }
      } else {
        const result = await addEducation(data).unwrap();
        if (result?.statusCode === 201) {
          message.success('Education added successfully');
          setShowModal(false);
        }
      }
    } catch (error) {
      message.error('Failed to save education');
    }
  };

  const formatYear = (dateString: string | null) => {
    if (!dateString) return 'Present';
    // Handle both full date and year-only formats
    if (dateString.length === 4) return dateString;
    return dayjs(dateString).format('YYYY');
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h5 className="text-lg font-semibold text-gray-900">Education</h5>
          {modifyButton && (
            <button
              type="button"
              onClick={openAddModal}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Add Education"
            >
              <FilePlus size={18} className="text-primary" />
            </button>
          )}
        </div>

        {educations?.length > 0 ? (
          <div className="space-y-4">
            {educations.map((edu) => (
              <div
                key={edu.id}
                className="relative pl-6 pb-4 border-l-2 border-gray-200 last:pb-0"
              >
                <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-primary" />
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-grow">
                    <h6 className="font-medium text-gray-900">
                      {edu.designation}
                      {edu.major && <span className="font-normal"> in {edu.major}</span>}
                    </h6>
                    <p className="text-sm text-gray-600">{edu.company_name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatYear(edu.start_date)} - {formatYear(edu.end_date)}
                    </p>
                    {edu.description && (
                      <p className="text-sm text-gray-600 mt-2">{edu.description}</p>
                    )}
                  </div>
                  {modifyButton && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditModal(edu)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} className="text-gray-500" />
                      </button>
                      <Popconfirm
                        title="Delete Education"
                        description="Are you sure you want to delete this education?"
                        onConfirm={() => handleDelete(edu.id)}
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
          <p className="text-gray-500 text-sm">No education added yet.</p>
        )}
      </div>

      {/* Add/Edit Education Modal */}
      <Modal
        title={editingEducation ? 'Edit Education' : 'Add Education'}
        open={showModal}
        onOk={handleSave}
        onCancel={() => setShowModal(false)}
        confirmLoading={addLoading || updateLoading}
        okText="Save"
        centered
        width={600}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="institute"
            label="Institute Name"
            rules={[{ required: true, message: 'Institute name is required' }]}
          >
            <Input placeholder="Enter institute name" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="level_of_education"
              label="Level of Education"
              rules={[{ required: true, message: 'Level of education is required' }]}
            >
              <Input placeholder="e.g., Bachelor's, Master's" />
            </Form.Item>
            <Form.Item
              name="major"
              label="Major/Field of Study"
            >
              <Input placeholder="e.g., Computer Science" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="starting_year"
              label="Start Year"
              rules={[{ required: true, message: 'Start year is required' }]}
            >
              <DatePicker className="w-full" picker="year" />
            </Form.Item>
            <Form.Item
              name="passing_year"
              label="End Year"
              rules={[
                {
                  required: !isCurrentlyStudying,
                  message: 'End year is required',
                },
              ]}
            >
              <DatePicker
                className="w-full"
                picker="year"
                disabled={isCurrentlyStudying}
              />
            </Form.Item>
          </div>
          <Form.Item name="currently_studying" valuePropName="checked">
            <Checkbox
              checked={isCurrentlyStudying}
              onChange={(e) => setIsCurrentlyStudying(e.target.checked)}
            >
              I am currently studying here
            </Checkbox>
          </Form.Item>
          <Form.Item
            name="about_education"
            label="Description"
          >
            <TextArea rows={4} placeholder="Describe your education..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
