"use client";

import { useState } from "react";
import { Button, Card, Upload, Alert, Progress } from "antd";
import type { UploadFile } from "antd";
import { Image, FileArchive, Upload as UploadIcon, X, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

interface GalleryUploadFormProps {
  productId: string;
  onNext: () => void;
  onBack: () => void;
}

const THUMBNAIL_DIMENSIONS = { width: 785, height: 400 };
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_ZIP_SIZE = 200 * 1024 * 1024; // 200MB
const MAX_SCREENSHOTS = 5;

export default function GalleryUploadForm({ productId, onNext, onBack }: GalleryUploadFormProps) {
  const [thumbnailFile, setThumbnailFile] = useState<UploadFile | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);

  const [screenshotFiles, setScreenshotFiles] = useState<UploadFile[]>([]);
  const [screenshotErrors, setScreenshotErrors] = useState<string[]>([]);

  const [mainZipFile, setMainZipFile] = useState<UploadFile | null>(null);
  const [mainZipError, setMainZipError] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Mock draft product info
  const draftProductInfo: any = null;

  // Validate image dimensions
  const validateImageDimensions = (
    file: File,
    required: { width: number; height: number }
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const isValid = img.width === required.width && img.height === required.height;
        URL.revokeObjectURL(img.src);
        resolve(isValid);
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        resolve(false);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle thumbnail upload
  const handleThumbnailChange = async (info: any) => {
    const file = info.file.originFileObj || info.file;
    setThumbnailError(null);

    if (!file || file.uid === "existing-thumbnail") return;

    // Check file size
    if (file.size > MAX_IMAGE_SIZE) {
      setThumbnailError("File size must be less than 5MB");
      return;
    }

    // Check file type
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setThumbnailError("Only JPG and PNG files are allowed");
      return;
    }

    // Check dimensions
    const isValidDimensions = await validateImageDimensions(file, THUMBNAIL_DIMENSIONS);
    if (!isValidDimensions) {
      setThumbnailError(
        `Image must be exactly ${THUMBNAIL_DIMENSIONS.width}×${THUMBNAIL_DIMENSIONS.height}px`
      );
      return;
    }

    setThumbnailFile({
      uid: file.uid || Date.now().toString(),
      name: file.name,
      status: "done",
      originFileObj: file,
    });
  };

  // Handle screenshot upload
  const handleScreenshotChange = async (info: any) => {
    const file = info.file.originFileObj || info.file;
    setScreenshotErrors([]);

    if (!file) return;

    if (screenshotFiles.length >= MAX_SCREENSHOTS) {
      toast.error(`Maximum ${MAX_SCREENSHOTS} screenshots allowed`);
      return;
    }

    // Check file size
    if (file.size > MAX_IMAGE_SIZE) {
      setScreenshotErrors((prev) => [...prev, `${file.name}: File size must be less than 5MB`]);
      return;
    }

    // Check file type
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setScreenshotErrors((prev) => [...prev, `${file.name}: Only JPG and PNG files are allowed`]);
      return;
    }

    setScreenshotFiles((prev) => [
      ...prev,
      {
        uid: file.uid || Date.now().toString(),
        name: file.name,
        status: "done",
        originFileObj: file,
      },
    ]);
  };

  // Handle main ZIP file upload
  const handleMainZipChange = (info: any) => {
    const file = info.file.originFileObj || info.file;
    setMainZipError(null);

    if (!file || file.uid === "existing-main") return;

    // Check file size
    if (file.size > MAX_ZIP_SIZE) {
      setMainZipError("File size must be less than 200MB");
      return;
    }

    // Check file type
    if (file.type !== "application/zip" && !file.name.endsWith(".zip")) {
      setMainZipError("Only ZIP files are allowed");
      return;
    }

    setMainZipFile({
      uid: file.uid || Date.now().toString(),
      name: file.name,
      status: "done",
      originFileObj: file,
    });
  };

  // Remove functions
  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailError(null);
  };

  const removeScreenshot = (uid: string) => {
    setScreenshotFiles((prev) => prev.filter((f) => f.uid !== uid));
  };

  const removeMainZip = () => {
    setMainZipFile(null);
    setMainZipError(null);
  };

  // Submit handler (mock mode)
  const handleSubmit = async () => {
    // Validation
    if (!thumbnailFile) {
      toast.error("Please upload a thumbnail image");
      return;
    }

    if (!mainZipFile) {
      toast.error("Please upload the main ZIP file");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const totalFiles = 1 + (screenshotFiles.length > 0 ? 1 : 0) + 1;
    let progress = 0;

    const progressInterval = setInterval(() => {
      progress += 25;
      setUploadProgress(Math.min(progress, 100));
    }, 200);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    clearInterval(progressInterval);
    setUploadProgress(100);

    console.log("Mock upload:", {
      thumbnail: thumbnailFile?.name,
      screenshots: screenshotFiles.map((f) => f.name),
      mainFile: mainZipFile?.name,
    });

    await new Promise((resolve) => setTimeout(resolve, 300));

    setIsUploading(false);
    setUploadProgress(0);
    toast.success("Gallery uploaded successfully!");
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Thumbnail Image */}
      <div>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">
            Thumbnail Image <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-gray-500">
            Upload a {THUMBNAIL_DIMENSIONS.width}×{THUMBNAIL_DIMENSIONS.height}px JPG or PNG preview
            image. This represents your product in listings.
          </p>
        </div>

        {thumbnailFile ? (
          <Card size="small" className="bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" size={20} />
                <span className="font-medium">{thumbnailFile.name}</span>
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
                {THUMBNAIL_DIMENSIONS.width}×{THUMBNAIL_DIMENSIONS.height}px • JPG, PNG • Max 5MB
              </p>
            </div>
          </Upload.Dragger>
        )}

        {thumbnailError && <Alert type="error" message={thumbnailError} showIcon className="mt-2" />}
      </div>

      {/* Screenshots */}
      <div>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">Screenshots (Optional)</h3>
          <p className="text-sm text-gray-500">
            Upload up to {MAX_SCREENSHOTS} additional images to showcase your product details.
            Images should be 820px wide.
          </p>
        </div>

        {screenshotFiles.length > 0 && (
          <div className="space-y-2 mb-4">
            {screenshotFiles.map((file) => (
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
                    onClick={() => removeScreenshot(file.uid)}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}

        {screenshotFiles.length < MAX_SCREENSHOTS && (
          <Upload.Dragger
            accept=".jpg,.jpeg,.png"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleScreenshotChange}
            multiple
          >
            <div className="py-8">
              <UploadIcon size={40} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">Click or drag images to upload</p>
              <p className="text-xs text-gray-400 mt-1">
                {screenshotFiles.length}/{MAX_SCREENSHOTS} screenshots • JPG, PNG • Max 5MB each
              </p>
            </div>
          </Upload.Dragger>
        )}

        {screenshotErrors.length > 0 && (
          <div className="mt-2 space-y-1">
            {screenshotErrors.map((error, index) => (
              <Alert key={index} type="error" message={error} showIcon />
            ))}
          </div>
        )}
      </div>

      {/* Main ZIP File */}
      <div>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">
            Main File(s) <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-gray-500">
            Upload a ZIP file containing all deliverables (source code, documentation, etc.). This
            is what buyers will download after purchase.
          </p>
        </div>

        {mainZipFile ? (
          <Card size="small" className="bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" size={20} />
                <FileArchive size={20} className="text-gray-600" />
                <span className="font-medium">{mainZipFile.name}</span>
              </div>
              <Button type="text" danger icon={<X size={16} />} onClick={removeMainZip} />
            </div>
          </Card>
        ) : (
          <Upload.Dragger
            accept=".zip"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleMainZipChange}
            className={mainZipError ? "border-red-300" : ""}
          >
            <div className="py-8">
              <FileArchive size={40} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">Click or drag ZIP file to upload</p>
              <p className="text-xs text-gray-400 mt-1">Only *.zip files • Max 200MB</p>
            </div>
          </Upload.Dragger>
        )}

        {mainZipError && <Alert type="error" message={mainZipError} showIcon className="mt-2" />}

        <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 space-y-1">
          <p>
            <strong>Tip:</strong> Make sure your main file is well-organized and includes
            documentation if needed.
          </p>
          <p>Maximum file size: 200MB. For larger files, FTP upload is recommended.</p>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && uploadProgress > 0 && (
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
        <Button size="large" onClick={onBack} disabled={isUploading}>
          Previous
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={handleSubmit}
          loading={isLoading || isUploading}
        >
          {isUploading ? "Uploading..." : "Save & Continue"}
        </Button>
      </div>
    </div>
  );
}
