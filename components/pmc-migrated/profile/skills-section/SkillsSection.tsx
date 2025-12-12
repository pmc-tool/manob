// MIGRATION: SkillsSection component from PackMyCode
'use client';

import { useState, useEffect, useRef } from 'react';
import { FilePlus, X } from 'lucide-react';
import { Modal } from '@/components/pmc-migrated/shared/modal';
import styles from './SkillsSection.module.css';

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
  onSearch?: (query: string) => Promise<SkillOption[]>;
  onSave?: (skills: Skill[]) => void;
}

export default function SkillsSection({
  title,
  skills,
  modifyButton = true,
  onSearch,
  onSave,
}: SkillsSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Skill[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<SkillOption[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const previousTags = skills.map((sk) => ({
      skill_id: sk.skill_id,
      skill_name: sk.skill_name,
    }));
    setSelectedTags(previousTags);
  }, [skills]);

  const handleSearch = async (value: string) => {
    setSearchValue(value);
    if (value.trim() && onSearch) {
      const results = await onSearch(value.trim());
      setSuggestions(results || []);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion: SkillOption) => {
    if (selectedTags.some((t) => t.skill_id === suggestion.id)) {
      alert('This skill has already been added.');
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

  const handleSave = () => {
    if (selectedTags.length === 0) {
      alert('Please add at least one skill.');
      return;
    }
    onSave?.(selectedTags);
    setShowModal(false);
  };

  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

  return (
    <>
      <div className={styles.section}>
        <div className={styles.header}>
          <h5 className={styles.title}>{title}</h5>
          {modifyButton && (
            <button
              type="button"
              className={styles.editButton}
              onClick={() => setShowModal(true)}
              title="Add Skill"
            >
              <FilePlus size={18} />
            </button>
          )}
        </div>
        <div className={styles.skillsList}>
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <span key={index} className={styles.skill}>
                {capitalize(skill.skill_name)}
              </span>
            ))
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyText}>No skills added</span>
            </div>
          )}
        </div>
      </div>

      <Modal
        id="skillsModal"
        title="Add Skill"
        saveButtonText="Save changes"
        onSave={handleSave}
        show={showModal}
        onClose={() => setShowModal(false)}
        backdropStatic={true}
      >
        <div className={styles.searchWrapper}>
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for a skill..."
          />
          {suggestions.length > 0 && (
            <div className={styles.suggestions}>
              <ul className={styles.suggestionList}>
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    className={styles.suggestionItem}
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {selectedTags.length > 0 && (
          <div className={styles.tagList}>
            {selectedTags.map((tag) => (
              <div key={tag.skill_id} className={styles.tag}>
                <span>{capitalize(tag.skill_name)}</span>
                <button
                  type="button"
                  className={styles.tagRemove}
                  onClick={() => removeTag(tag.skill_id)}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button type="button" className={styles.clearAll} onClick={clearAllTags}>
              Clear all
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
