"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Upload, Alert, Progress } from "antd";
import type { UploadFile } from "antd";
import { Image, Video, Upload as UploadIcon, X, CheckCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { ServiceDraft } from "../page";
import { useSubmitFinalStepMutation } from "@/state/services/seller-service/service.service";
import { useSaveMediaMutation } from "@/state/services/media.service";

interface GalleryFormProps {
  draft: ServiceDraft;
  onBack: () => void;
  updateDraft: (data: Partial<ServiceDraft>) => void;
}

const REQUIRED_DIMENSIONS = { width: 785, height: 450 };
const MAX_THUMBNAIL_SIZE = 1 * 1024 * 1024; // 1MB
const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200MB
const MAX_GALLERY_FILES = 5;

export default function GalleryForm({ draft, onBack, updateDraft }: GalleryFormProps) {
  const router = useRouter();

  const [thumbnail, setThumbnail] = useState<UploadFile | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);

  const [gallery, setGallery] = useState<UploadFile[]>([]);
  const [galleryErrors, setGalleryErrors] = useState<string[]>([]);

  const [video, setVideo] = useState<UploadFile | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [submitFinalStep] = useSubmitFinalStepMutation();
  const [saveMedia] = useSaveMediaMutation();

  // Validate image dimensions
  const validateImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const isValid =
          img.width === REQUIRED_DIMENSIONS.width && img.height === REQUIRED_DIMENSIONS.height;
        resolve(isValid);
      };
      img.onerror = () => resolve(false);
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle thumbnail upload
  const handleThumbnailChange = async (info: any) => {
    const file = info.file.originFileObj || info.file;
    setThumbnailError(null);

    if (!file) return;

    // Check file size
    if (file.size > MAX_THUMBNAIL_SIZE) {
      setThumbnailError("File size must be less than 1MB");
      return;
    }

    // Check file type
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setThumbnailError("Only JPG and PNG files are allowed");
      return;
    }

    // Check dimensions
    const isValidDimensions = await validateImageDimensions(file);
    if (!isValidDimensions) {
      setThumbnailError(`Image must be exactly ${REQUIRED_DIMENSIONS.width}×${REQUIRED_DIMENSIONS.height}px`);
      return;
    }

    setThumbnail({
      uid: file.uid || Date.now().toString(),
      name: file.name,
      status: "done",
      originFileObj: file,
    });
  };

  // Handle gallery upload
  const handleGalleryChange = async (info: any) => {
    const file = info.file.originFileObj || info.file;
    setGalleryErrors([]);

    if (!file) return;

    if (gallery.length >= MAX_GALLERY_FILES) {
      toast.error(`Maximum ${MAX_GALLERY_FILES} images allowed`);
      return;
    }

    // Check file size
    if (file.size > MAX_THUMBNAIL_SIZE) {
      setGalleryErrors((prev) => [...prev, `${file.name}: File size must be less than 1MB`]);
      return;
    }

    // Check file type
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setGalleryErrors((prev) => [...prev, `${file.name}: Only JPG and PNG files are allowed`]);
      return;
    }

    // Check dimensions
    const isValidDimensions = await validateImageDimensions(file);
    if (!isValidDimensions) {
      setGalleryErrors((prev) => [
        ...prev,
        `${file.name}: Image must be exactly ${REQUIRED_DIMENSIONS.width}×${REQUIRED_DIMENSIONS.height}px`,
      ]);
      return;
    }

    setGallery((prev) => [
      ...prev,
      {
        uid: file.uid || Date.now().toString(),
        name: file.name,
        status: "done",
        originFileObj: file,
      },
    ]);
  };

  // Handle video upload
  const handleVideoChange = (info: any) => {
    const file = info.file.originFileObj || info.file;
    setVideoError(null);

    if (!file) return;

    // Check file size
    if (file.size > MAX_VIDEO_SIZE) {
      setVideoError("Video must be less than 200MB");
      return;
    }

    // Check file type
    if (file.type !== "video/mp4") {
      setVideoError("Only MP4 videos are allowed");
      return;
    }

    setVideo({
      uid: file.uid || Date.now().toString(),
      name: file.name,
      status: "done",
      originFileObj: file,
    });
  };

  // Remove files
  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailError(null);
  };

  const removeGalleryImage = (uid: string) => {
    setGallery((prev) => prev.filter((f) => f.uid !== uid));
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoError(null);
  };

  // Upload file to media service
  const uploadFile = async (file: File, fileGroup: string): Promise<number | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("meta_file_group", fileGroup);
      formData.append("model_reference", "SERVICE");
      formData.append("model_reference_key", draft.id || "");

      const result = await saveMedia(formData).unwrap();
      return result?.data?.id || result?.id || null;
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  };

  // Submit handler
  const handleSubmit = async () => {
    // Validation
    if (!thumbnail) {
      toast.error("Please upload a service preview image");
      return;
    }

    if (gallery.length === 0) {
      toast.error("Please upload at least one gallery image");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const totalFiles = 1 + gallery.length + (video ? 1 : 0);
      let uploadedCount = 0;

      // Upload thumbnail
      const thumbnailId = await uploadFile(thumbnail.originFileObj as File, "THUMBNAIL");
      if (!thumbnailId) throw new Error("Failed to upload thumbnail");
      uploadedCount++;
      setUploadProgress(Math.round((uploadedCount / totalFiles) * 100));

      // Upload gallery images
      const galleryIds: number[] = [];
      for (const img of gallery) {
        const imgId = await uploadFile(img.originFileObj as File, "GALLERY");
        if (imgId) {
          galleryIds.push(imgId);
        }
        uploadedCount++;
        setUploadProgress(Math.round((uploadedCount / totalFiles) * 100));
      }

      if (galleryIds.length === 0) throw new Error("Failed to upload gallery images");

      // Upload video (optional)
      let videoId: number | undefined;
      if (video) {
        videoId = (await uploadFile(video.originFileObj as File, "VIDEO")) || undefined;
        uploadedCount++;
        setUploadProgress(Math.round((uploadedCount / totalFiles) * 100));
      }

      // Submit final step
      const payload = {
        id: draft.id,
        thumbnail: thumbnailId,
        gallery: galleryIds,
        ...(videoId && { thumbnail_video: videoId }),
      };

      const result = await submitFinalStep(payload).unwrap();

      if (result?.statusCode === 200 || result?.data) {
        toast.success("Service created successfully!");
        router.push("/seller/service-list");
      } else {
        throw new Error(result?.message || "Failed to submit service");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit service");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Service Preview (Thumbnail) */}
      <div>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">
            Service Preview <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-gray-500">
            Upload a cover image for your service ({REQUIRED_DIMENSIONS.width}×{REQUIRED_DIMENSIONS.height}px, JPG/PNG, max 1MB)
          </p>
        </div>

        {thumbnail ? (
          <Card size="small" className="bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" size={20} />
                <span className="font-medium">{thumbnail.name}</span>
              </div>
              <Button type="text" danger icon={<X size={16} />} onClick={removeThumbnail} />
            </div>
          </Card>
        ) : (
          <Upload.Dragger
            accept=".jpg,.jpeg,.png"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleThumbnailChange}
            className={thumbnailError ? "border-red-300" : ""}
          >
            <div className="py-8">
              <Image size={40} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">Click or drag image to upload</p>
              <p className="text-xs text-gray-400 mt-1">
                {REQUIRED_DIMENSIONS.width}×{REQUIRED_DIMENSIONS.height}px • JPG, PNG • Max 1MB
              </p>
            </div>
          </Upload.Dragger>
        )}

        {thumbnailError && (
          <Alert type="error" message={thumbnailError} showIcon className="mt-2" />
        )}
      </div>

      {/* Gallery Screenshots */}
      <div>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">
            Gallery Screenshots <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-gray-500">
            Upload up to {MAX_GALLERY_FILES} images ({REQUIRED_DIMENSIONS.width}×{REQUIRED_DIMENSIONS.height}px each)
          </p>
        </div>

        {gallery.length > 0 && (
          <div className="space-y-2 mb-4">
            {gallery.map((file) => (
              <Card key={file.uid} size="small" className="bg-green-50 border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-500" size={20} />
                    <span className="font-medium">{file.name}</span>
                  </div>
                  <Button
                    type="text"
                    danger
                    icon={<X size={16} />}
                    onClick={() => removeGalleryImage(file.uid)}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}

        {gallery.length < MAX_GALLERY_FILES && (
          <Upload.Dragger
            accept=".jpg,.jpeg,.png"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleGalleryChange}
            multiple
          >
            <div className="py-8">
              <UploadIcon size={40} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">Click or drag images to upload</p>
              <p className="text-xs text-gray-400 mt-1">
                {gallery.length}/{MAX_GALLERY_FILES} images uploaded
              </p>
            </div>
          </Upload.Dragger>
        )}

        {galleryErrors.length > 0 && (
          <div className="mt-2 space-y-1">
            {galleryErrors.map((error, index) => (
              <Alert key={index} type="error" message={error} showIcon />
            ))}
          </div>
        )}
      </div>

      {/* Service Video (Optional) */}
      <div>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">Service Video (Optional)</h3>
          <p className="text-sm text-gray-500">Upload an MP4 video to showcase your service (max 200MB)</p>
        </div>

        {video ? (
          <Card size="small" className="bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" size={20} />
                <span className="font-medium">{video.name}</span>
              </div>
              <Button type="text" danger icon={<X size={16} />} onClick={removeVideo} />
            </div>
          </Card>
        ) : (
          <Upload.Dragger
            accept=".mp4"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleVideoChange}
            className={videoError ? "border-red-300" : ""}
          >
            <div className="py-8">
              <Video size={40} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">Click or drag video to upload</p>
              <p className="text-xs text-gray-400 mt-1">MP4 • Max 200MB</p>
            </div>
          </Upload.Dragger>
        )}

        {videoError && <Alert type="error" message={videoError} showIcon className="mt-2" />}
      </div>

      {/* Upload Progress */}
      {isSubmitting && uploadProgress > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <Progress type="circle" percent={uploadProgress} size={50} />
            <div>
              <p className="font-medium text-blue-900">Uploading files...</p>
              <p className="text-sm text-blue-700">Please wait while we upload your media</p>
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-4 border-t border-gray-100">
        <Button size="large" onClick={onBack} disabled={isSubmitting}>
          Previous
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={!thumbnail || gallery.length === 0}
        >
          {isSubmitting ? "Submitting..." : "Submit Service"}
        </Button>
      </div>
    </div>
  );
}
