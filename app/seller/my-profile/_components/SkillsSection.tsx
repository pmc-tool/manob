'use client';

import { useState, useEffect, useRef } from 'react';
import { Modal, Input, Tag, message } from 'antd';
import { FilePlus, X, Search } from 'lucide-react';
import { useSkillCreateMutation } from '@/state/services/user.service';
import { useLazyGetSearchSkillsQuery } from '@/state/services/user-service/skills.service';

interface Skill {
  skill_id: number;
  skill_name: string;
}

interface SkillOption {
  id: number;
  name: string;
}

interface SkillsSectionProps {
  title: string;
  skills: Skill[];
  modifyButton?: boolean;
}

export default function SkillsSection({
  title,
  skills,
  modifyButton = true,
}: SkillsSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Skill[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<SkillOption[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const [createSkills, { isLoading }] = useSkillCreateMutation();
  const [searchSkills] = useLazyGetSearchSkillsQuery();

  useEffect(() => {
    if (skills?.length > 0) {
      const previousTags = skills.map((sk) => ({
        skill_id: sk.skill_id,
        skill_name: sk.skill_name,
      }));
      setSelectedTags(previousTags);
    }
  }, [skills]);

  const handleSearch = async (value: string) => {
    setSearchValue(value);
    if (value.trim()) {
      const result = await searchSkills(value.trim());
      setSuggestions(result?.data || []);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion: SkillOption) => {
    if (selectedTags.some((t) => t.skill_id === suggestion.id)) {
      message.warning('This skill has already been added.');
      setSearchValue('');
      setSuggestions([]);
      return;
    }
    setSelectedTags((prev) => [
      ...prev,
      { skill_id: suggestion.id, skill_name: suggestion.name },
    ]);
    setSuggestions([]);
    setSearchValue('');
    inputRef.current?.focus();
  };

  const removeTag = (skillId: number) => {
    setSelectedTags((prev) => prev.filter((t) => t.skill_id !== skillId));
  };

  const clearAllTags = () => setSelectedTags([]);

  const handleSave = async () => {
    if (selectedTags.length === 0) {
      message.error('Please add at least one skill.');
      return;
    }
    try {
      const result = await createSkills({ user_skills: selectedTags }).unwrap();
      if (result?.statusCode === 201) {
        message.success('Skills updated successfully');
        setShowModal(false);
      }
    } catch (error) {
      message.error('Failed to update skills');
    }
  };

  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

  return (
    <>
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h5 className="text-lg font-semibold text-gray-900">{title}</h5>
          {modifyButton && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Add Skill"
            >
              <FilePlus size={18} className="text-primary" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {skills?.length > 0 ? (
            skills.map((skill, index) => (
              <Tag key={index} className="px-3 py-1 text-sm rounded-full bg-gray-100 border-0">
                {capitalize(skill.skill_name)}
              </Tag>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No skills added yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Skills Modal */}
      <Modal
        title="Add Skills"
        open={showModal}
        onOk={handleSave}
        onCancel={() => setShowModal(false)}
        confirmLoading={isLoading}
        okText="Save Changes"
        centered
        width={500}
      >
        <div className="mt-4">
          <div className="relative">
            <Input
              ref={inputRef as any}
              prefix={<Search size={16} className="text-gray-400" />}
              placeholder="Search for a skill..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full"
            />
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                  >
                    {suggestion.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedTags.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <div
                    key={tag.skill_id}
                    className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                  >
                    <span>{capitalize(tag.skill_name)}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag.skill_id)}
                      className="p-0.5 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={clearAllTags}
                className="mt-2 text-xs text-red-500 font-medium hover:text-red-600"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
