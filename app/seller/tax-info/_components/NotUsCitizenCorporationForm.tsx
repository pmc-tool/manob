"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Form, Input, Select, Radio, Checkbox, Button, Upload, Card } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { ImagePlus, FileUp, X } from "lucide-react";
import toast from "react-hot-toast";
import Countries from "@/lib/data/countries.json";
import { useSaveNonUsCorporationTaxInfoMutation } from "@/state/services/seller-service/tax-info.service";
import CertificationModal from "./CertificationModal";

const { Dragger } = Upload;

const chapter3StatusOptions = [
  "Corporation",
  "Disregarded entity",
  "Simple trust",
  "Grantor trust",
  "Complex trust",
  "Estate",
  "Government",
  "Central Bank of Issue",
  "Tax-exempt organization",
  "Private foundation",
];

interface FormValues {
  businessName: string;
  country: string;
  firstName: string;
  lastName: string;
  nameOfDisregardedEntity: string;
  chapter3Status: string;
  address: string;
  cityOrTown: string;
  stateOrProvince: string;
  zipOrPostalCode: string;
  residenceCountry: string;
  isSameMailingAddress: boolean;
  mailingAddress?: string;
  mailingCityTown?: string;
  mailingStateProvince?: string;
  mailingZipOrPostalCode?: string;
  mailingCountry?: string;
  taxIdType: string;
  taxIdNumber: string;
  isReadAcknowledge: boolean;
}

export default function NotUsCitizenCorporationForm() {
  const [form] = Form.useForm<FormValues>();
  const [showModal, setShowModal] = useState(false);
  const [signatureFile, setSignatureFile] = useState<UploadFile[]>([]);
  const [identityFiles, setIdentityFiles] = useState<UploadFile[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isMailingSame, setIsMailingSame] = useState(false);

  const [saveNonUsCorporation, { data, isLoading }] = useSaveNonUsCorporationTaxInfoMutation();

  const handleSignatureChange: UploadProps["onChange"] = ({ fileList }) => {
    setSignatureFile(fileList);
    if (fileList.length > 0 && fileList[0].originFileObj) {
      const url = URL.createObjectURL(fileList[0].originFileObj);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleIdentityChange: UploadProps["onChange"] = ({ fileList }) => {
    setIdentityFiles(fileList.slice(0, 5));
  };

  const onFinish = async (values: FormValues) => {
    if (signatureFile.length === 0) {
      toast.error("Please upload a signature file");
      return;
    }
    if (identityFiles.length === 0) {
      toast.error("Please upload identity verification files");
      return;
    }

    const formData = new FormData();
    formData.append("businessName", values.businessName);
    formData.append("country", values.country);
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("nameOfDisregardedEntity", values.nameOfDisregardedEntity);
    formData.append("chapter3Status", values.chapter3Status);
    formData.append("address", values.address);
    formData.append("cityOrTown", values.cityOrTown);
    formData.append("stateOrProvince", values.stateOrProvince);
    formData.append("zipOrPostalCode", values.zipOrPostalCode);
    formData.append("residenceCountry", values.residenceCountry);
    formData.append("isSameMailingAddress", String(values.isSameMailingAddress || isMailingSame));

    if (!isMailingSame) {
      if (values.mailingAddress) formData.append("mailingAddress", values.mailingAddress);
      if (values.mailingCityTown) formData.append("mailingCityTown", values.mailingCityTown);
      if (values.mailingStateProvince) formData.append("mailingStateProvince", values.mailingStateProvince);
      if (values.mailingZipOrPostalCode) formData.append("mailingZipOrPostalCode", values.mailingZipOrPostalCode);
      if (values.mailingCountry) formData.append("mailingCountry", values.mailingCountry);
    }

    formData.append("taxIdType", values.taxIdType);
    formData.append("taxIdNumber", values.taxIdNumber);
    formData.append("isReadAcknowledge", String(values.isReadAcknowledge));

    if (signatureFile[0]?.originFileObj) {
      formData.append("signature_file", signatureFile[0].originFileObj);
    }

    identityFiles.forEach((file) => {
      if (file.originFileObj) {
        formData.append("identity_files", file.originFileObj);
      }
    });

    await saveNonUsCorporation(formData);
  };

  useEffect(() => {
    if (data?.statusCode === 201) {
      toast.success("Your information has been submitted!");
      form.resetFields();
      setSignatureFile([]);
      setIdentityFiles([]);
      setPreviewUrl(null);
      setIsMailingSame(false);
    } else if (data?.message) {
      toast.error(data.message);
    }
  }, [data, form]);

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ taxIdType: "U.S. Social Security Number (SSN)" }}
      >
        {/* Organization Name */}
        <Form.Item
          label={<span className="font-medium">Name of Organization that is the Beneficial Owner <span className="text-red-500">*</span></span>}
          name="businessName"
          rules={[
            { required: true, message: "Organization name is required" },
            { min: 2, message: "Organization name must be at least 2 characters" },
            { max: 200, message: "Organization name cannot exceed 200 characters" },
          ]}
        >
          <Input placeholder="Enter Organization Name" size="large" />
        </Form.Item>

        {/* Country */}
        <Form.Item
          label={<span className="font-medium">Country <span className="text-red-500">*</span></span>}
          name="country"
          rules={[{ required: true, message: "Country is required" }]}
        >
          <Select
            placeholder="Select Country"
            size="large"
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={Countries.map((c) => ({ value: c.name, label: c.name }))}
          />
        </Form.Item>

        {/* Name of Authorized Individual */}
        <Card className="mb-4 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-4">Name of Authorized Individual</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label={<span className="font-medium">First Name <span className="text-red-500">*</span></span>}
              name="firstName"
              rules={[
                { required: true, message: "First name is required" },
                { min: 2, message: "First name must be at least 2 characters" },
                { max: 50, message: "First name cannot exceed 50 characters" },
              ]}
              extra="Must match name as shown on your income tax return"
            >
              <Input placeholder="Enter First Name" size="large" />
            </Form.Item>

            <Form.Item
              label={<span className="font-medium">Last Name <span className="text-red-500">*</span></span>}
              name="lastName"
              rules={[
                { required: true, message: "Last name is required" },
                { min: 2, message: "Last name must be at least 2 characters" },
                { max: 50, message: "Last name cannot exceed 50 characters" },
              ]}
            >
              <Input placeholder="Enter Last Name" size="large" />
            </Form.Item>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name of Disregarded Entity */}
          <Form.Item
            label={<span className="font-medium">Name of Disregarded Entity <span className="text-red-500">*</span></span>}
            name="nameOfDisregardedEntity"
            rules={[
              { required: true, message: "Name of disregarded entity is required" },
              { max: 100, message: "Name cannot exceed 100 characters" },
            ]}
          >
            <Input placeholder="Enter Name of Disregarded Entity" size="large" />
          </Form.Item>

          {/* Chapter 3 Status */}
          <Form.Item
            label={<span className="font-medium">Chapter 3 Status <span className="text-red-500">*</span></span>}
            name="chapter3Status"
            rules={[{ required: true, message: "Chapter 3 status is required" }]}
          >
            <Select
              placeholder="Select Option"
              size="large"
              options={chapter3StatusOptions.map((opt) => ({ value: opt, label: opt }))}
            />
          </Form.Item>

          {/* Permanent Residence Address */}
          <Form.Item
            label={<span className="font-medium">Permanent Residence Address <span className="text-red-500">*</span></span>}
            name="address"
            rules={[
              { required: true, message: "Address is required" },
              { max: 200, message: "Address cannot exceed 200 characters" },
            ]}
          >
            <Input placeholder="Enter Permanent Residence Address" size="large" />
          </Form.Item>

          {/* City/Town */}
          <Form.Item
            label={<span className="font-medium">City/Town <span className="text-red-500">*</span></span>}
            name="cityOrTown"
            rules={[
              { required: true, message: "City/Town is required" },
              { max: 100, message: "City/Town cannot exceed 100 characters" },
            ]}
          >
            <Input placeholder="Enter City/Town" size="large" />
          </Form.Item>

          {/* State/Province */}
          <Form.Item
            label={<span className="font-medium">State/Province <span className="text-red-500">*</span></span>}
            name="stateOrProvince"
            rules={[
              { required: true, message: "State/Province is required" },
              { max: 100, message: "State/Province cannot exceed 100 characters" },
            ]}
          >
            <Input placeholder="Enter State/Province" size="large" />
          </Form.Item>

          {/* Zip/Postal Code */}
          <Form.Item
            label={<span className="font-medium">Zip/Postal Code <span className="text-red-500">*</span></span>}
            name="zipOrPostalCode"
            rules={[
              { required: true, message: "Zip/Postal code is required" },
              { max: 20, message: "Zip/Postal code cannot exceed 20 characters" },
            ]}
          >
            <Input placeholder="Enter Zip/Postal Code" size="large" />
          </Form.Item>
        </div>

        {/* Country of Residence */}
        <Form.Item
          label={<span className="font-medium">Country of Residence <span className="text-red-500">*</span></span>}
          name="residenceCountry"
          rules={[{ required: true, message: "Country of residence is required" }]}
        >
          <Select
            placeholder="Select Country of Residence"
            size="large"
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={Countries.map((c) => ({ value: c.name, label: c.name }))}
          />
        </Form.Item>

        {/* Same Mailing Address Checkbox */}
        <Form.Item name="isSameMailingAddress" valuePropName="checked">
          <Checkbox onChange={(e) => setIsMailingSame(e.target.checked)}>
            Mailing address is the same as above
          </Checkbox>
        </Form.Item>

        {/* Mailing Address Fields (conditional) */}
        {!isMailingSame && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg mb-4 bg-gray-50">
            <Form.Item
              label={<span className="font-medium">Mailing Address</span>}
              name="mailingAddress"
              rules={[
                { required: !isMailingSame, message: "Mailing address is required" },
                { max: 200, message: "Address cannot exceed 200 characters" },
              ]}
            >
              <Input placeholder="Enter Mailing Address" size="large" />
            </Form.Item>

            <Form.Item
              label={<span className="font-medium">Mailing City/Town</span>}
              name="mailingCityTown"
              rules={[
                { required: !isMailingSame, message: "City/Town is required" },
                { max: 100, message: "City/Town cannot exceed 100 characters" },
              ]}
            >
              <Input placeholder="Enter Mailing City/Town" size="large" />
            </Form.Item>

            <Form.Item
              label={<span className="font-medium">Mailing State/Province</span>}
              name="mailingStateProvince"
              rules={[
                { required: !isMailingSame, message: "State/Province is required" },
                { max: 100, message: "State/Province cannot exceed 100 characters" },
              ]}
            >
              <Input placeholder="Enter Mailing State/Province" size="large" />
            </Form.Item>

            <Form.Item
              label={<span className="font-medium">Mailing Zip/Postal Code</span>}
              name="mailingZipOrPostalCode"
              rules={[
                { required: !isMailingSame, message: "Zip/Postal code is required" },
                { max: 20, message: "Zip/Postal code cannot exceed 20 characters" },
              ]}
            >
              <Input placeholder="Enter Mailing Zip/Postal Code" size="large" />
            </Form.Item>

            <div className="md:col-span-2">
              <Form.Item
                label={<span className="font-medium">Mailing Country</span>}
                name="mailingCountry"
                rules={[{ required: !isMailingSame, message: "Country is required" }]}
              >
                <Select
                  placeholder="Select Country"
                  size="large"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                  options={Countries.map((c) => ({ value: c.name, label: c.name }))}
                />
              </Form.Item>
            </div>
          </div>
        )}

        {/* Tax ID Type */}
        <Form.Item
          label={<span className="font-medium">Tax ID Type <span className="text-red-500">*</span></span>}
          name="taxIdType"
          rules={[{ required: true, message: "Tax ID type is required" }]}
        >
          <Radio.Group className="flex flex-col gap-2">
            <Radio value="U.S. Social Security Number (SSN)">
              U.S. Social Security Number (SSN)
            </Radio>
            <Radio value="Individual Taxpayer Identification Number (ITIN)">
              Individual Taxpayer Identification Number (ITIN)
            </Radio>
          </Radio.Group>
        </Form.Item>

        {/* Tax ID Number */}
        <Form.Item
          label={<span className="font-medium">Tax ID Number <span className="text-red-500">*</span></span>}
          name="taxIdNumber"
          rules={[{ required: true, message: "Tax ID number is required" }]}
        >
          <Input placeholder="Enter Tax ID Number" size="large" />
        </Form.Item>

        {/* Certification Checkbox */}
        <Form.Item
          name="isReadAcknowledge"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error("You must acknowledge the certification")),
            },
          ]}
        >
          <Checkbox>
            <span className="font-medium">
              I have read and acknowledge the{" "}
              <button
                type="button"
                className="text-primary underline font-semibold uppercase text-xs"
                onClick={() => setShowModal(true)}
              >
                certification
              </button>
            </span>
          </Checkbox>
        </Form.Item>
        <p className="text-gray-500 text-sm mb-4">
          By signing, you declare that the information provided is true and
          correct and you are properly authorised to sign this agreement on
          behalf of the party for which you are signing
        </p>

        {/* Signature Upload */}
        <div className="mb-6">
          <label className="font-medium block mb-2">
            Signature <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Dragger
              accept=".jpg,.jpeg,.png"
              maxCount={1}
              fileList={signatureFile}
              onChange={handleSignatureChange}
              beforeUpload={() => false}
              showUploadList={false}
            >
              <div className="p-4">
                <ImagePlus size={40} className="mx-auto text-primary mb-2" />
                <p className="text-gray-600">Drag the preview images here...</p>
                <p className="text-gray-400 text-xs mt-1">(Only *.png, *.jpg files will be accepted)</p>
              </div>
            </Dragger>
            <div className="border rounded-lg flex items-center justify-center bg-gray-50 min-h-[140px] relative">
              {previewUrl ? (
                <>
                  <Image
                    src={previewUrl}
                    alt="Signature preview"
                    width={292}
                    height={135}
                    className="object-contain rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSignatureFile([]);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <Image
                  src="/images/sign.png"
                  alt="Signature placeholder"
                  width={292}
                  height={135}
                  className="object-contain opacity-50"
                />
              )}
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Drag &apos;n&apos; drop preview images here, or click to select files
          </p>
        </div>

        {/* Identity Verification Upload */}
        <div className="mb-6">
          <label className="font-medium block mb-2">
            Identity Verification <span className="text-red-500">*</span>
          </label>
          <Dragger
            accept=".jpg,.jpeg,.png,.pdf"
            multiple
            maxCount={5}
            fileList={identityFiles}
            onChange={handleIdentityChange}
            beforeUpload={() => false}
          >
            <div className="p-4">
              <FileUp size={50} className="mx-auto text-primary mb-2" />
              <p className="text-gray-600">Drag the preview images or PDF file here...</p>
              <p className="text-gray-400 text-xs mt-1">(Only *.png, *.jpg, *.pdf files will be accepted)</p>
            </div>
          </Dragger>
          <p className="text-gray-500 text-sm mt-2">
            Please provide a government issued photo ID for identity
            verification. Either a scanned copy or a high quality photo of a
            document is acceptable. Make sure the document is clear and
            readable. The name on the document must match the name provided
            with the taxpayer&apos;s information. Limit up to 5 files.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-start">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={isLoading}
            className="min-w-[200px]"
          >
            Submit
          </Button>
        </div>
      </Form>

      <CertificationModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
