"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Card, Modal, Radio, Checkbox, Empty } from "antd";
import { Plus, Trash2, MessageSquare, FileText, CheckSquare, File } from "lucide-react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { ServiceDraft, FaqItem, RequirementItem } from "../page";
import { useSaveServiceThirdStepMutation } from "@/state/services/seller-service/service.service";

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface DescriptionFaqFormProps {
  draft: ServiceDraft;
  onNext: (data: Partial<ServiceDraft>) => void;
  onBack: () => void;
  updateDraft: (data: Partial<ServiceDraft>) => void;
}

const requirementTypes = [
  { value: "FREE_TEXT", label: "Free Text", icon: FileText, description: "Buyer enters text response" },
  { value: "CHECKBOX", label: "Multiple Choice", icon: CheckSquare, description: "Buyer selects from options" },
  { value: "FILE", label: "File Attachment", icon: File, description: "Buyer uploads a file" },
];

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

export default function DescriptionFaqForm({ draft, onNext, onBack, updateDraft }: DescriptionFaqFormProps) {
  const [form] = Form.useForm();
  const [description, setDescription] = useState(draft.description || "");
  const [faqs, setFaqs] = useState<FaqItem[]>(draft.faqs || []);
  const [requirements, setRequirements] = useState<RequirementItem[]>(draft.order_requirements || []);

  // FAQ Modal State
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [faqForm] = Form.useForm();

  // Requirement Modal State
  const [reqModalOpen, setReqModalOpen] = useState(false);
  const [reqForm] = Form.useForm();
  const [reqType, setReqType] = useState<"FREE_TEXT" | "CHECKBOX" | "FILE">("FREE_TEXT");
  const [checkboxOptions, setCheckboxOptions] = useState<string[]>([""]);

  const [saveThirdStep, { isLoading }] = useSaveServiceThirdStepMutation();

  // Add FAQ
  const handleAddFaq = (values: { que: string; description: string }) => {
    setFaqs([...faqs, { que: values.que, description: values.description }]);
    faqForm.resetFields();
    setFaqModalOpen(false);
    toast.success("FAQ added");
  };

  // Remove FAQ
  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  // Add Requirement
  const handleAddRequirement = (values: any) => {
    const existingTitles = requirements.map((r) => r.title.toLowerCase());
    if (existingTitles.includes(values.title.toLowerCase())) {
      toast.error("A requirement with this title already exists");
      return;
    }

    const newReq: RequirementItem = {
      type: reqType,
      title: values.title,
      name: values.title.toLowerCase().replace(/\s+/g, "_"),
      is_required: values.is_required || false,
      ...(reqType === "CHECKBOX" && { values: checkboxOptions.filter((o) => o.trim()) }),
    };

    setRequirements([...requirements, newReq]);
    reqForm.resetFields();
    setReqType("FREE_TEXT");
    setCheckboxOptions([""]);
    setReqModalOpen(false);
    toast.success("Requirement added");
  };

  // Remove Requirement
  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  // Add checkbox option
  const addCheckboxOption = () => {
    setCheckboxOptions([...checkboxOptions, ""]);
  };

  // Update checkbox option
  const updateCheckboxOption = (index: number, value: string) => {
    const newOptions = [...checkboxOptions];
    newOptions[index] = value;
    setCheckboxOptions(newOptions);
  };

  // Remove checkbox option
  const removeCheckboxOption = (index: number) => {
    if (checkboxOptions.length > 1) {
      setCheckboxOptions(checkboxOptions.filter((_, i) => i !== index));
    }
  };

  const onFinish = async () => {
    // Validate description
    const cleanDescription = description.replace(/<p><br><\/p>/g, "").trim();
    if (!cleanDescription || cleanDescription === "<p></p>") {
      toast.error("Please add a service description");
      return;
    }

    const payload = {
      id: draft.id,
      description: description,
      faqs: faqs,
      order_requirements: requirements,
    };

    try {
      const result = await saveThirdStep(payload).unwrap();

      if (result?.statusCode === 200 || result?.data) {
        toast.success("Description & FAQs saved");
        onNext({
          description,
          faqs,
          order_requirements: requirements,
        });
      } else {
        toast.error(result?.message || "Failed to save");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save");
    }
  };

  return (
    <div className="space-y-6">
      {/* Requirements Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Order Requirements</h3>
            <p className="text-sm text-gray-500">
              Information you need from buyers to start the order
            </p>
          </div>
          <Button icon={<Plus size={16} />} onClick={() => setReqModalOpen(true)}>
            Add Requirement
          </Button>
        </div>

        {requirements.length > 0 ? (
          <div className="space-y-2">
            {requirements.map((req, index) => (
              <Card key={index} size="small" className="bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
                      {req.type === "FREE_TEXT" && <FileText size={16} className="text-gray-600" />}
                      {req.type === "CHECKBOX" && <CheckSquare size={16} className="text-gray-600" />}
                      {req.type === "FILE" && <File size={16} className="text-gray-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{req.title}</p>
                      <p className="text-xs text-gray-500">
                        {req.type.replace("_", " ")} • {req.is_required ? "Required" : "Optional"}
                      </p>
                      {req.type === "CHECKBOX" && req.values && (
                        <p className="text-xs text-gray-400 mt-1">
                          Options: {req.values.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    type="text"
                    danger
                    icon={<Trash2 size={16} />}
                    onClick={() => handleRemoveRequirement(index)}
                  />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-50 text-center py-6">
            <p className="text-gray-500 text-sm">No requirements added yet</p>
          </Card>
        )}
      </div>

      {/* Description Section */}
      <div>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">
            Service Description <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-gray-500">
            Describe your service in detail. What will buyers receive?
          </p>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            modules={quillModules}
            placeholder="Describe your service in detail..."
            className="bg-white"
            style={{ minHeight: "200px" }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Minimum 150 characters recommended for better visibility
        </p>
      </div>

      {/* FAQs Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Frequently Asked Questions</h3>
            <p className="text-sm text-gray-500">
              Help buyers with common questions about your service
            </p>
          </div>
          <Button icon={<Plus size={16} />} onClick={() => setFaqModalOpen(true)}>
            Add FAQ
          </Button>
        </div>

        {faqs.length > 0 ? (
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <Card key={index} size="small" className="bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
                      <MessageSquare size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{faq.que}</p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{faq.description}</p>
                    </div>
                  </div>
                  <Button
                    type="text"
                    danger
                    icon={<Trash2 size={16} />}
                    onClick={() => handleRemoveFaq(index)}
                  />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-50 text-center py-6">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No FAQs added yet"
            />
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4 border-t border-gray-100">
        <Button size="large" onClick={onBack}>
          Previous
        </Button>
        <Button type="primary" size="large" onClick={onFinish} loading={isLoading}>
          Save & Continue
        </Button>
      </div>

      {/* FAQ Modal */}
      <Modal
        title="Add FAQ"
        open={faqModalOpen}
        onCancel={() => {
          setFaqModalOpen(false);
          faqForm.resetFields();
        }}
        footer={null}
        centered
      >
        <Form form={faqForm} layout="vertical" onFinish={handleAddFaq}>
          <Form.Item
            name="que"
            label="Question"
            rules={[{ required: true, message: "Question is required" }]}
          >
            <Input placeholder="e.g., What file formats do you deliver?" size="large" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Answer"
            rules={[{ required: true, message: "Answer is required" }]}
          >
            <Input.TextArea
              placeholder="Provide a detailed answer..."
              rows={4}
              maxLength={500}
              showCount
            />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setFaqModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Add FAQ
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Requirement Modal */}
      <Modal
        title="Add Requirement"
        open={reqModalOpen}
        onCancel={() => {
          setReqModalOpen(false);
          reqForm.resetFields();
          setReqType("FREE_TEXT");
          setCheckboxOptions([""]);
        }}
        footer={null}
        centered
        width={500}
      >
        <Form form={reqForm} layout="vertical" onFinish={handleAddRequirement}>
          <Form.Item
            name="title"
            label="Requirement Title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input placeholder="e.g., Project brief or brand guidelines" size="large" />
          </Form.Item>

          <Form.Item label="Response Type">
            <Radio.Group value={reqType} onChange={(e) => setReqType(e.target.value)}>
              <div className="space-y-2">
                {requirementTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                      reqType === type.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Radio value={type.value} />
                    <type.icon size={18} className="text-gray-600" />
                    <div>
                      <p className="font-medium text-sm">{type.label}</p>
                      <p className="text-xs text-gray-500">{type.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </Radio.Group>
          </Form.Item>

          {/* Checkbox Options */}
          {reqType === "CHECKBOX" && (
            <Form.Item label="Options">
              <div className="space-y-2">
                {checkboxOptions.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateCheckboxOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    {checkboxOptions.length > 1 && (
                      <Button
                        type="text"
                        danger
                        icon={<Trash2 size={16} />}
                        onClick={() => removeCheckboxOption(index)}
                      />
                    )}
                  </div>
                ))}
                <Button type="dashed" onClick={addCheckboxOption} block>
                  Add Option
                </Button>
              </div>
            </Form.Item>
          )}

          <Form.Item name="is_required" valuePropName="checked">
            <Checkbox>This requirement is mandatory</Checkbox>
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={() => setReqModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Add Requirement
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
