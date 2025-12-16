"use client";
import { Card, Button, Tag, Avatar, Skeleton, Upload, message, Input } from "antd";
import { ChevronLeft, Clock, X, Image as ImageIcon } from "lucide-react";
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
  message: "<p>I purchased a product yesterday but I'm unable to download it. The download button doesn't work and I get an error message. Please help me resolve this issue.</p>",
  priority: "HIGH",
  status: "IN_PROGRESS",
  support_center: "PRODUCT-SUPPORT-CENTER",
  problemCategoryData: JSON.stringify({ title: "Download Issue" }),
  product_data: JSON.stringify({ product_id: "prod-001", product_name: "Premium React Dashboard" }),
  attachment: [],
  created_at: "2024-12-15T10:30:00Z",
  updated_at: "2024-12-16T14:20:00Z",
};

const mockReplies = [
  {
    id: "reply-001",
    reply: "<p>Thank you for contacting us. We are looking into your issue and will get back to you shortly.</p>",
    user_meta: {
      first_name: "Support",
      last_name: "Team",
      profile_image: null,
    },
    images: [],
    updated_at: "2024-12-15T11:00:00Z",
  },
  {
    id: "reply-002",
    reply: "<p>We have identified the issue. Please try clearing your browser cache and try again. Let us know if the problem persists.</p>",
    user_meta: {
      first_name: "Tech",
      last_name: "Support",
      profile_image: null,
    },
    images: [],
    updated_at: "2024-12-16T09:30:00Z",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "orange";
    case "IN_PROGRESS":
      return "blue";
    case "SOLVED":
    case "CLOSED":
      return "green";
    default:
      return "default";
  }
};

const getSupportCenterLabel = (center: string) => {
  if (center === "PRODUCT-SUPPORT-CENTER") return "Product";
  if (center === "SELLER-SUPPORT-CENTER") return "Seller";
  return "PMC";
};

export default function MySupportDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [htmlDescription, setHtmlDescription] = useState("");
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

  const handleFileUpload = (file: File) => {
    if (file.type.startsWith("image/")) {
      setFilesData([...filesData, file]);
      setPreviewUrls([...previewUrls, URL.createObjectURL(file)]);
    } else {
      message.error("Please upload a valid image file.");
    }
    return false; // Prevent auto upload
  };

  const handleRemoveImage = (index: number) => {
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
    setFilesData(filesData.filter((_, i) => i !== index));
  };

  const replyHandler = async () => {
    if (!htmlDescription.trim()) {
      setMessageError("Reply is required");
      return;
    }

    const formData = new FormData();
    formData.append("reply_data", `<p>${htmlDescription}</p>`);
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
      setHtmlDescription("");
      setFilesData([]);
      setPreviewUrls([]);
      setIsSaving(false);
      message.success("Reply has been sent successfully");
    }
  }, [replySubmitted]);

  useEffect(() => {
    if (htmlDescription.trim()) {
      setMessageError("");
    }
  }, [htmlDescription]);

  if (detailsLoading) {
    return (
      <section className="pt-4 pb-8">
        <div className="container mx-auto px-4">
          <Skeleton active paragraph={{ rows: 2 }} />
          <Card className="mt-4">
            <Skeleton active paragraph={{ rows: 6 }} />
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-4 pb-8">
      <div className="container mx-auto px-4">
        {/* Back Link */}
        <Link
          href="/support-requests"
          className="inline-flex items-center gap-2 font-semibold text-gray-700 hover:text-primary mb-4"
        >
          <ChevronLeft size={20} />
          Ticket Details
        </Link>

        {/* Ticket Info Card */}
        <Card className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Name:</span>
                <span className="font-semibold">{supportDetails?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email Address:</span>
                <span className="font-semibold">{supportDetails?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Category:</span>
                <span className="font-semibold">{problemCate?.title || "General"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Priority:</span>
                <span className="font-semibold">{supportDetails?.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Support Center:</span>
                <span className="font-semibold">
                  {getSupportCenterLabel(supportDetails?.support_center)}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block border-l border-gray-200" />

            {/* Right Column */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Ticket Id:</span>
                <span className="font-semibold">{supportDetails?.ticket_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created At:</span>
                <span className="font-semibold">
                  {new Date(supportDetails?.created_at).toDateString()},{" "}
                  <span className="text-gray-500 font-normal">
                    {new Date(supportDetails?.created_at).toLocaleTimeString()}
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Activity:</span>
                <span className="font-semibold">
                  {new Date(supportDetails?.updated_at).toDateString()},{" "}
                  <span className="text-gray-500 font-normal">
                    {new Date(supportDetails?.updated_at).toLocaleTimeString()}
                  </span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status:</span>
                <Tag color={getStatusColor(supportDetails?.status)}>
                  {supportDetails?.status?.replaceAll("_", " ")}
                </Tag>
              </div>
            </div>
          </div>
        </Card>

        {/* Product Information */}
        {productData?.product_id && (
          <Card className="mb-4" title="Product">
            <Link
              href={`/product-details/${productData.product_id}`}
              target="_blank"
              className="text-lg font-semibold text-primary hover:underline"
            >
              {productData.product_name}
            </Link>
          </Card>
        )}

        {/* Original Message */}
        <Card className="mb-4" title={supportDetails?.name}>
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Subject</h4>
            <p className="text-gray-700">{supportDetails?.subject}</p>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2">Full Description</h4>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: supportDetails?.message }}
            />
          </div>

          {supportDetails?.attachment?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {supportDetails.attachment.map((item: any, index: number) => (
                <div key={index} className="relative">
                  <div className="border rounded overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_S3BUCKET}/${item?.url}`}
                      alt={`Attachment ${index + 1}`}
                      width={192}
                      height={135}
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Reply History */}
        <Card className="mb-4" title="Ticket Reply History">
          {replies?.length === 0 ? (
            <p className="text-gray-500">No replies yet.</p>
          ) : (
            <div className="space-y-6">
              {replies.map((reply: any) => (
                <div key={reply.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar
                      size={48}
                      src={
                        reply.user_meta?.profile_image
                          ? `${process.env.NEXT_PUBLIC_S3BUCKET}/${reply.user_meta.profile_image}`
                          : "/images/user-placeholder.jpg"
                      }
                    />
                    <div>
                      <h5 className="font-semibold">
                        {reply.user_meta?.first_name} {reply.user_meta?.last_name}
                      </h5>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Clock size={14} />
                        <span>
                          {new Date(reply.updated_at).toDateString()},{" "}
                          {new Date(reply.updated_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="prose prose-sm max-w-none ml-14"
                    dangerouslySetInnerHTML={{ __html: reply.reply }}
                  />

                  {reply.images?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 ml-14">
                      {reply.images.map((img: any, index: number) => (
                        <div key={index} className="border rounded overflow-hidden">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_S3BUCKET}/${img?.url}`}
                            alt={`Reply image ${index + 1}`}
                            width={192}
                            height={135}
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Reply Form */}
        <Card title="Reply">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
            {/* Upload Area */}
            <div className="lg:col-span-1">
              <Upload.Dragger
                accept="image/jpeg,image/png"
                beforeUpload={handleFileUpload}
                showUploadList={false}
                className="!border-dashed"
              >
                <div className="p-4">
                  <ImageIcon size={40} className="mx-auto text-primary mb-2" strokeWidth={1} />
                  <p className="text-sm text-gray-600">Drag preview images here...</p>
                  <p className="text-xs text-gray-400">(Only *.png, *.jpg files)</p>
                </div>
              </Upload.Dragger>
            </div>

            {/* Preview Images */}
            <div className="lg:col-span-3">
              <div className="flex flex-wrap gap-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <div className="border rounded overflow-hidden">
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        width={192}
                        height={135}
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reply Text Area */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2">
              Reply Ticket<span className="text-red-500">*</span>
            </h4>
            <TextArea
              rows={6}
              value={htmlDescription}
              onChange={(e) => setHtmlDescription(e.target.value)}
              placeholder="Type your reply here..."
              className="!resize-none"
            />
            {messageError && <p className="text-red-500 text-sm mt-1">{messageError}</p>}
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <Button
              type="primary"
              size="large"
              loading={isSaving}
              onClick={replyHandler}
            >
              {isSaving ? "Saving..." : "Submit"}
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
