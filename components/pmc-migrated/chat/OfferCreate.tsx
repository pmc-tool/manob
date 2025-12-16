"use client";

import { useState } from "react";
import { Form, Input, Select, InputNumber, Button } from "antd";
import { useGetMyServicesMinimalQuery } from "@/state/services/seller-service/service.service";
import { useCreateCustomOfferMutation } from "@/state/services/chat-service/chat-user-service";
import { useAppSelector } from "@/state/hooks";
import { useSocket } from "@/context/SocketProvider";
import Modal from "../shared/modal/Modal";

const { TextArea } = Input;
const { Option } = Select;

interface OfferCreateProps {
  showModal: () => void;
  handleCloseModal: () => void;
  handleSave: () => void;
}

export default function OfferCreate({
  showModal,
  handleCloseModal,
  handleSave,
}: OfferCreateProps) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: myServices } = useGetMyServicesMinimalQuery("");
  const [saveCustomOffer] = useCreateCustomOfferMutation();
  const chatActiveUser = useAppSelector((state) => state.chatStore.active_user);
  const authUser: any = useAppSelector((state) => state.auth.userInfo);
  const socket = useSocket();

  async function onSubmit(values: any) {
    setIsSubmitting(true);
    try {
      const res: any = await saveCustomOffer(values);
      if (res?.data?.status === true) {
        sendMessage(res?.data?.data);
        form.resetFields();
        handleCloseModal();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function sendMessage(res: any) {
    const obj: any = {
      receiver_id: chatActiveUser?.receiver_id,
      sender_id: authUser?.id,
      message: "Custom Offer Sent",
      message_type: "ORDER",
      message_data: {
        ...res,
      },
    };

    socket?.emit("sendMessage", obj);
  }

  return (
    <Modal
      id="customOfferModalLabel"
      title="Create Custom Offer"
      saveButtonText="Send Offer"
      onSave={() => form.submit()}
      show={true}
      onClose={handleCloseModal}
      dialogClassName="modal-dialog-centered"
      backdropStatic={true}
      isSaving={isSubmitting}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        id="customOfferForm"
      >
        <Form.Item
          label="Select Your Service"
          name="service_id"
          rules={[{ required: true, message: "Please select a service" }]}
        >
          <Select placeholder="Select Service" size="large">
            {myServices?.map((item: any) => (
              <Option key={item.id} value={item.id}>
                {item.service_title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Add Description"
          name="cover_letter"
          rules={[{ required: true, message: "Please add a description" }]}
        >
          <TextArea
            rows={4}
            placeholder="Click here to add job details"
            maxLength={1000}
          />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please enter a price" }]}
        >
          <InputNumber
            className="w-full"
            size="large"
            min={1}
            placeholder="$"
            prefix="$"
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Delivery Time"
            name="delivery_time"
            rules={[{ required: true, message: "Required" }]}
          >
            <InputNumber
              className="w-full"
              size="large"
              min={1}
              placeholder="Enter delivery time"
            />
          </Form.Item>

          <Form.Item
            label="Delivery Duration"
            name="delivery_type"
            initialValue="DAY"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select size="large">
              <Option value="DAY">Days</Option>
              <Option value="HOUR">Hours</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          label="Revisions"
          name="revisions"
          initialValue={1}
          rules={[{ required: true, message: "Required" }]}
        >
          <Select size="large">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Option key={num} value={num}>
                {num}
              </Option>
            ))}
            <Option value={100}>Unlimited</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
