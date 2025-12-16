'use client';

import { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Tag, message } from 'antd';
import { MapPin, Globe, Pencil, Plus, X, FilePlus } from 'lucide-react';
import {
  useUpdateProfileMutation,
  useAddLanguageMutation,
} from '@/state/services/user.service';

interface LanguageItem {
  language_id: number;
  language_name: string;
  level?: string;
  language_level?: string;
}

interface LanguageOption {
  id: string;
  language_name: string;
}

interface MetaInfoSectionProps {
  city: string;
  zone: string;
  country: string;
  zipCode: string;
  languages: LanguageItem[];
  languageOptions?: LanguageOption[];
  modifyButton?: boolean;
}

const levelOptions = ['NATIVE', 'FLUENT', 'INTERMEDIATE', 'BEGINNER'];

export default function MetaInfoSection({
  city,
  zone,
  country,
  zipCode,
  languages,
  languageOptions = [],
  modifyButton = true,
}: MetaInfoSectionProps) {
  const [locationForm] = Form.useForm();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [languageTags, setLanguageTags] = useState<LanguageItem[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  const [updateProfile, { isLoading: locationLoading }] = useUpdateProfileMutation();
  const [addLanguage, { isLoading: languageLoading }] = useAddLanguageMutation();

  useEffect(() => {
    locationForm.setFieldsValue({ city, zone, country, zip_code: zipCode });
  }, [city, zone, country, zipCode, locationForm]);

  useEffect(() => {
    setLanguageTags(languages);
  }, [languages]);

  const handleLocationSave = async () => {
    try {
      const values = await locationForm.validateFields();
      const result = await updateProfile(values).unwrap();
      if (result?.statusCode === 200) {
        message.success('Location updated successfully');
        setShowLocationModal(false);
      }
    } catch (error) {
      message.error('Failed to update location');
    }
  };

  const addLanguageTag = () => {
    if (!selectedLanguage || !selectedLevel) {
      message.warning('Please select both language and level.');
      return;
    }

    const langOption = languageOptions.find((l) => l.id === selectedLanguage);
    if (!langOption) return;

    const newLanguage: LanguageItem = {
      language_id: parseInt(selectedLanguage),
      language_name: langOption.language_name,
      level: selectedLevel,
    };

    if (languageTags.some((l) => l.language_id === newLanguage.language_id)) {
      message.warning('Language already added.');
      return;
    }

    setLanguageTags((prev) => [...prev, newLanguage]);
    setSelectedLanguage('');
    setSelectedLevel('');
  };

  const removeLanguageTag = (languageId: number) => {
    setLanguageTags((prev) => prev.filter((l) => l.language_id !== languageId));
  };

  const clearAllLanguages = () => setLanguageTags([]);

  const handleLanguageSave = async () => {
    if (languageTags.length === 0) {
      message.error('Please add at least one language.');
      return;
    }
    try {
      const result = await addLanguage({ languages: languageTags }).unwrap();
      if (result?.statusCode === 201) {
        message.success('Languages updated successfully');
        setShowLanguageModal(false);
      }
    } catch (error) {
      message.error('Failed to update languages');
    }
  };

  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

  const hasLocation = city || zone || country || zipCode;
  const locationText = [city, zone, country, zipCode].filter(Boolean).join(', ');

  return (
    <div>
      <h5 className="text-lg font-semibold text-gray-900 mb-4">Location & Language</h5>

      {/* Location */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 mt-0.5">
          <MapPin size={22} strokeWidth={1.5} className="text-gray-500" />
        </div>
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <h6 className="font-medium text-gray-900">Location</h6>
            {modifyButton && (
              <button
                type="button"
                onClick={() => setShowLocationModal(true)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Edit Location"
              >
                <Pencil size={14} className="text-primary" />
              </button>
            )}
          </div>
          <p className="text-sm text-gray-600">
            {hasLocation ? locationText : 'No location added'}
          </p>
        </div>
      </div>

      {/* Languages */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Globe size={22} strokeWidth={1.5} className="text-gray-500" />
        </div>
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <h6 className="font-medium text-gray-900">Languages</h6>
            {modifyButton && (
              <button
                type="button"
                onClick={() => setShowLanguageModal(true)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Add Language"
              >
                <FilePlus size={14} className="text-primary" />
              </button>
            )}
          </div>
          {languages?.length > 0 ? (
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-600">
              {languages.map((lang, index) => (
                <span key={index}>
                  <span className="font-medium text-gray-800">{lang.language_name}</span>
                  {' '}
                  <span className="text-gray-500">
                    ({capitalize(lang.language_level || lang.level || '')})
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No languages added</p>
          )}
        </div>
      </div>

      {/* Location Modal */}
      <Modal
        title="Edit Location"
        open={showLocationModal}
        onOk={handleLocationSave}
        onCancel={() => setShowLocationModal(false)}
        confirmLoading={locationLoading}
        okText="Save Changes"
        centered
      >
        <Form form={locationForm} layout="vertical" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="city"
              label="City"
              rules={[
                { required: true, message: 'City is required' },
                { min: 2, message: 'City must be at least 2 characters' },
              ]}
            >
              <Input placeholder="Enter city" />
            </Form.Item>
            <Form.Item
              name="zone"
              label="Zone"
              rules={[
                { required: true, message: 'Zone is required' },
                { min: 2, message: 'Zone must be at least 2 characters' },
              ]}
            >
              <Input placeholder="Enter zone" />
            </Form.Item>
            <Form.Item
              name="country"
              label="Country"
              rules={[
                { required: true, message: 'Country is required' },
                { min: 2, message: 'Country must be at least 2 characters' },
              ]}
            >
              <Input placeholder="Enter country" />
            </Form.Item>
            <Form.Item
              name="zip_code"
              label="Zip Code"
              rules={[
                { required: true, message: 'Zip code is required' },
                { min: 2, message: 'Zip code must be at least 2 characters' },
              ]}
            >
              <Input placeholder="Enter zip code" />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Language Modal */}
      <Modal
        title="Languages"
        open={showLanguageModal}
        onOk={handleLanguageSave}
        onCancel={() => setShowLanguageModal(false)}
        confirmLoading={languageLoading}
        okText="Save Language"
        centered
        width={500}
      >
        <div className="mt-4">
          <div className="flex gap-2 items-end">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <Select
                placeholder="Select Language"
                value={selectedLanguage || undefined}
                onChange={setSelectedLanguage}
                className="w-full"
                options={languageOptions.map((lang) => ({
                  value: lang.id,
                  label: lang.language_name,
                }))}
              />
            </div>
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <Select
                placeholder="Select Level"
                value={selectedLevel || undefined}
                onChange={setSelectedLevel}
                className="w-full"
                options={levelOptions.map((level) => ({
                  value: level,
                  label: capitalize(level),
                }))}
              />
            </div>
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={addLanguageTag}
              className="flex items-center justify-center"
            />
          </div>

          {languageTags.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {languageTags.map((lang) => (
                  <div
                    key={lang.language_id}
                    className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                  >
                    <span className="font-medium">{lang.language_name}</span>
                    <span className="text-gray-500">
                      ({capitalize(lang.language_level || lang.level || '')})
                    </span>
                    <button
                      type="button"
                      onClick={() => removeLanguageTag(lang.language_id)}
                      className="p-0.5 hover:bg-gray-200 rounded-full transition-colors ml-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={clearAllLanguages}
                className="mt-2 text-xs text-red-500 font-medium hover:text-red-600"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
