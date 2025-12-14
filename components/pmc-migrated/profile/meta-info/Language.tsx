// MIGRATION: Language component from manob.ai
'use client';

import { useState, useEffect } from 'react';
import { Globe, Plus, X, FilePlus } from 'lucide-react';
import { Modal } from '@/components/pmc-migrated/shared/modal';
import styles from './MetaInfoSection.module.css';

interface LanguageItem {
  language_id: number;
  language_name: string;
  level: string;
}

interface LanguageOption {
  id: string;
  language_name: string;
}

interface LanguageProps {
  title: string;
  languages: LanguageItem[];
  languageOptions?: LanguageOption[];
  levelOptions?: string[];
  modifyButton?: boolean;
  onSave?: (languages: LanguageItem[]) => void;
}

export default function Language({
  title,
  languages,
  languageOptions = [],
  levelOptions = ['NATIVE', 'FLUENT', 'INTERMEDIATE', 'BEGINNER'],
  modifyButton = true,
  onSave,
}: LanguageProps) {
  const [showModal, setShowModal] = useState(false);
  const [languageTags, setLanguageTags] = useState<LanguageItem[]>(languages);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  useEffect(() => {
    setLanguageTags(languages);
  }, [languages]);

  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

  const addLanguageTag = () => {
    if (selectedLanguage && selectedLevel) {
      const langOption = languageOptions.find((l) => l.id === selectedLanguage);
      if (!langOption) return;

      const newLanguage: LanguageItem = {
        language_id: parseInt(selectedLanguage),
        language_name: langOption.language_name,
        level: selectedLevel,
      };

      if (!languageTags.some((l) => l.language_id === newLanguage.language_id)) {
        setLanguageTags((prev) => [...prev, newLanguage]);
        setSelectedLanguage('');
        setSelectedLevel('');
      } else {
        alert('Language already added.');
      }
    } else {
      alert('Please select both language and level.');
    }
  };

  const removeTag = (languageId: number) => {
    setLanguageTags((prev) => prev.filter((l) => l.language_id !== languageId));
  };

  const clearAllLanguages = () => setLanguageTags([]);

  const handleSave = () => {
    if (languageTags.length === 0) {
      alert('Please add at least one language before saving.');
      return;
    }
    onSave?.(languageTags);
    setShowModal(false);
  };

  return (
    <>
      <div className={styles.item}>
        <div className={styles.icon}>
          <Globe size={24} strokeWidth={1.5} />
        </div>
        <div className={styles.content}>
          <div className={styles.itemHeader}>
            <h6 className={styles.itemTitle}>{title}</h6>
            {modifyButton && (
              <button
                type="button"
                className={styles.editButton}
                onClick={() => setShowModal(true)}
                title="Add language"
              >
                <FilePlus size={16} />
              </button>
            )}
          </div>
          {languages.length > 0 ? (
            <ul className={styles.languageList}>
              {languages.map((lang, index) => (
                <li key={index} className={styles.languageItem}>
                  <span className={styles.languageName}>{lang.language_name}</span>
                  <span className={styles.languageLevel}>
                    ({capitalize(lang.level)})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <span className={styles.emptyText}>No languages added</span>
          )}
        </div>
      </div>

      <Modal
        id="languageModal"
        title={title}
        saveButtonText="Save Language"
        onSave={handleSave}
        show={showModal}
        onClose={() => setShowModal(false)}
        backdropStatic={true}
      >
        <div className={styles.languageForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Language</label>
              <select
                className={styles.select}
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="">Select Language</option>
                {languageOptions.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.language_name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Level</label>
              <select
                className={styles.select}
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="">Select Level</option>
                {levelOptions.map((level, index) => (
                  <option key={index} value={level}>
                    {capitalize(level)}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className={styles.addButton}
              onClick={addLanguageTag}
            >
              <Plus size={20} />
            </button>
          </div>

          {languageTags.length > 0 && (
            <div className={styles.tagList}>
              {languageTags.map((lang) => (
                <div key={lang.language_id} className={styles.tag}>
                  <span className={styles.tagName}>{lang.language_name}</span>
                  <span className={styles.tagLevel}>({capitalize(lang.level)})</span>
                  <button
                    type="button"
                    className={styles.tagRemove}
                    onClick={() => removeTag(lang.language_id)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className={styles.clearAll}
                onClick={clearAllLanguages}
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
