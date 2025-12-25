"use client";
import { Card, Button, Tag, Avatar, Skeleton, Upload, message, Input, Descriptions } from "antd";
import { ChevronLeft, Clock, X, ImagePlus, Headset, MessageSquare, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  useGetDetailsQuery,
  useGetSupportRepliesQuery,
  useReplyToMutation,
} from "@/state/services/support-service/user-support.service";

const { TextArea } = Input;

// Mock data for development
const mockSupportDetails = {
  id: "support-001",
  ticket_id: "TKT-2024-001",
  name: "John Doe",
  email: "john@example.com",
  subject: "Unable to download purchased product",
  message: "<p>I purchased a product yesterday but I'm unable to download it. The download button doesn't work and I get an error message saying 'Download failed'. I've tried multiple browsers but the issue persists.</p><p>Please help me resolve this issue as soon as possible.</p>",
  priority: "HIGH",
  status: "IN_PROGRESS",
  support_center: "PRODUCT-SUPPORT-CENTER",
  problemCategoryData: JSON.stringify({ title: "Download Issue" }),
  product_data: JSON.stringify({ product_id: "prod-001", product_name: "Premium React Dashboard Template" }),
  attachment: [],
  created_at: "2024-12-15T10:30:00Z",
  updated_at: "2024-12-16T14:20:00Z",
};

const mockReplies = [
  {
    id: "reply-001",
    reply: "<p>Thank you for contacting us. We are looking into your issue and will get back to you shortly. Our team is investigating the download server.</p>",
    user_meta: {
      first_name: "Sarah",
      last_name: "Johnson",
      profile_image: null,
    },
    images: [],
    updated_at: "2024-12-15T11:00:00Z",
  },
  {
    id: "reply-002",
    reply: "<p>We have identified the issue with the download server. It has been fixed now. Please try clearing your browser cache and attempt the download again.</p><p>If the problem persists, please let us know and we'll provide you with an alternative download link.</p>",
    user_meta: {
      first_name: "Mike",
      last_name: "Chen",
      profile_image: null,
    },
    images: [],
    updated_at: "2024-12-16T09:30:00Z",
  },
];

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return "orange";
    case "IN_PROGRESS":
      return "processing";
    case "SOLVED":
    case "CLOSED":
      return "success";
    case "REJECTED":
      return "error";
    default:
      return "default";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority?.toUpperCase()) {
    case "HIGH":
      return "red";
    case "MEDIUM":
      return "orange";
    case "LOW":
      return "green";
    default:
      return "default";
  }
};

const getSupportCenterLabel = (center: string) => {
  if (center === "PRODUCT-SUPPORT-CENTER") return "Product Support";
  if (center === "SELLER-SUPPORT-CENTER") return "Seller Support";
  return "PMC Support";
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
};

export default function MySupportDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [replyText, setReplyText] = useState("");
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [filesData, setFilesData] = useState<File[]>([]);
  const [messageError, setMessageError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { data: apiSupportDetails, isLoading: detailsLoading } = useGetDetailsQuery(id);
  const { data: apiRepliesData } = useGetSupportRepliesQuery({
    supportId: id,
    page: 1,
    limit: 1000,
  });
  const [giveReply, { data: replySubmitted }] = useReplyToMutation();

  // Use mock data if API returns no data
  const supportDetails = apiSupportDetails || mockSupportDetails;
  const replies = apiRepliesData?.replies || mockReplies;

  const problemCate = supportDetails?.problemCategoryData
    ? JSON.parse(supportDetails.problemCategoryData)
    : null;
  const productData = supportDetails?.product_data
    ? JSON.parse(supportDetails.product_data)
    : null;

  const createdDateTime = formatDateTime(supportDetails?.created_at);
  const updatedDateTime = formatDateTime(supportDetails?.updated_at);

  const handleFileUpload = (file: File) => {
    if (file.type.startsWith("image/")) {
      setFilesData([...filesData, file]);
      setPreviewUrls([...previewUrls, URL.createObjectURL(file)]);
    } else {
      message.error("Please upload a valid image file.");
    }
    return false;
  };

  const handleRemoveImage = (index: number) => {
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
    setFilesData(filesData.filter((_, i) => i !== index));
  };

  const replyHandler = async () => {
    if (!replyText.trim()) {
      setMessageError("Reply is required");
      return;
    }

    const formData = new FormData();
    formData.append("reply_data", `<p>${replyText}</p>`);
    filesData.forEach((file) => {
      formData.append("files", file);
    });

    try {
      setIsSaving(true);
      await giveReply({ id, body: formData });
    } catch (error) {
      message.error("Failed to send reply");
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (replySubmitted?.status === true) {
      setReplyText("");
      setFilesData([]);
      setPreviewUrls([]);
      setIsSaving(false);
      message.success("Reply has been sent successfully");
    }
  }, [replySubmitted]);

  useEffect(() => {
    if (replyText.trim()) {
      setMessageError("");
    }
  }, [replyText]);

  if (detailsLoading) {
    return (
      <section className="pt-4 pb-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <Skeleton active paragraph={{ rows: 1 }} className="mb-4" />
          <Card className="mb-4">
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
          <Card>
            <Skeleton active paragraph={{ rows: 6 }} />
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-4 pb-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/support-requests"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="font-medium">Back to Support Requests</span>
          </Link>
          <Tag color={getStatusColor(supportDetails?.status)} className="text-sm px-3 py-1">
            {supportDetails?.status?.replaceAll("_", " ")}
          </Tag>
        </div>

        {/* Ticket Header Card */}
        <Card className="mb-4">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Headset size={24} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-gray-500">Ticket #{supportDetails?.ticket_id}</span>
                <Tag color={getPriorityColor(supportDetails?.priority)} className="m-0">
                  {supportDetails?.priority} Priority
                </Tag>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-1">{supportDetails?.subject}</h1>
              <p className="text-sm text-gray-500">
                {getSupportCenterLabel(supportDetails?.support_center)} • {problemCate?.title || "General Inquiry"}
              </p>
            </div>
          </div>

          <Descriptions column={{ xs: 1, sm: 2, md: 2 }} size="small" className="ticket-info">
            <Descriptions.Item label="Requester">{supportDetails?.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{supportDetails?.email}</Descriptions.Item>
            <Descriptions.Item label="Created">
              {createdDateTime.date} at {createdDateTime.time}
            </Descriptions.Item>
            <Descriptions.Item label="Last Updated">
              {updatedDateTime.date} at {updatedDateTime.time}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Product Reference */}
        {productData?.product_id && (
          <Card className="mb-4" size="small">
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-sm">Related Product:</span>
              <Link
                href={`/product-details/${productData.product_id}`}
                target="_blank"
                className="text-primary hover:underline font-medium"
              >
                {productData.product_name}
              </Link>
            </div>
          </Card>
        )}

        {/* Conversation Thread */}
        <Card
          className="mb-4"
          title={
            <div className="flex items-center gap-2">
              <MessageSquare size={18} />
              <span>Conversation</span>
              <span className="text-gray-400 font-normal text-sm">({replies.length + 1} messages)</span>
            </div>
          }
        >
          {/* Original Message */}
          <div className="pb-6 border-b border-gray-100">
            <div className="flex gap-3">
              <Avatar size={40} className="bg-primary flex-shrink-0">
                {supportDetails?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">{supportDetails?.name}</span>
                  <Tag color="blue" className="m-0 text-xs">Author</Tag>
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                  <Clock size={12} />
                  <span>{createdDateTime.date} at {createdDateTime.time}</span>
                </div>
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: supportDetails?.message }}
                />
                {supportDetails?.attachment?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {supportDetails.attachment.map((item: any, index: number) => (
                      <div key={index} className="border rounded-lg overflow-hidden">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_S3BUCKET}/${item?.url}`}
                          alt={`Attachment ${index + 1}`}
                          width={160}
                          height={120}
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Replies */}
          {replies.map((reply: any) => {
            const replyDateTime = formatDateTime(reply.updated_at);
            return (
              <div key={reply.id} className="py-6 border-b border-gray-100 last:border-0">
                <div className="flex gap-3">
                  <Avatar
                    size={40}
                    src={
                      reply.user_meta?.profile_image
                        ? `${process.env.NEXT_PUBLIC_S3BUCKET}/${reply.user_meta.profile_image}`
                        : undefined
                    }
                    className="bg-green-500 flex-shrink-0"
                  >
                    {reply.user_meta?.first_name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        {reply.user_meta?.first_name} {reply.user_meta?.last_name}
                      </span>
                      <Tag color="green" className="m-0 text-xs">Support</Tag>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                      <Clock size={12} />
                      <span>{replyDateTime.date} at {replyDateTime.time}</span>
                    </div>
                    <div
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: reply.reply }}
                    />
                    {reply.images?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {reply.images.map((img: any, index: number) => (
                          <div key={index} className="border rounded-lg overflow-hidden">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_S3BUCKET}/${img?.url}`}
                              alt={`Reply image ${index + 1}`}
                              width={160}
                              height={120}
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </Card>

        {/* Reply Form */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <Send size={18} />
              <span>Send Reply</span>
            </div>
          }
        >
          {/* Attachments */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-700">Attachments</span>
              <span className="text-xs text-gray-400">(Optional)</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Upload.Dragger
                accept="image/jpeg,image/png"
                beforeUpload={handleFileUpload}
                showUploadList={false}
                className="!w-32 !h-24 !m-0"
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <ImagePlus size={24} className="text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Add Image</span>
                </div>
              </Upload.Dragger>
              {previewUrls.map((url, index) => (
                <div key={index} className="relative w-32 h-24">
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover rounded-lg border"
                    unoptimized
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-sm"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="mb-4">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-sm font-medium text-gray-700">Your Reply</span>
              <span className="text-red-500">*</span>
            </div>
            <TextArea
              rows={5}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
              status={messageError ? "error" : undefined}
            />
            {messageError && <p className="text-red-500 text-xs mt-1">{messageError}</p>}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="primary"
              size="large"
              icon={<Send size={16} />}
              loading={isSaving}
              onClick={replyHandler}
            >
              Send Reply
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
