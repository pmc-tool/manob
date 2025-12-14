// MIGRATION: ProfileHeaderSection component from manob.ai
'use client';

import { useState } from 'react';
import { Pencil, Camera } from 'lucide-react';
import { Avatar } from '@/components/pmc-migrated/shared/avatar';
import { Modal } from '@/components/pmc-migrated/shared/modal';
import { ReviewStars } from '@/components/pmc-migrated/marketplace/review-stars';
import styles from './ProfileHeaderSection.module.css';

interface ProfileHeaderProps {
  id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  completionPercentage?: number;
  modifyButton?: boolean;
  badges?: Array<{ badge_icon: string; badge_name: string }>;
  onUpdateName?: (firstName: string, lastName: string) => void;
  onUpdateImage?: (file: File) => void;
}

export default function ProfileHeaderSection({
  firstName,
  lastName,
  email,
  avatar,
  rating,
  reviewsCount,
  completionPercentage,
  modifyButton = true,
  badges = [],
  onUpdateName,
  onUpdateImage,
}: ProfileHeaderProps) {
  const [showModal, setShowModal] = useState(false);
  const [editFirstName, setEditFirstName] = useState(firstName);
  const [editLastName, setEditLastName] = useState(lastName);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (PNG, JPEG, JPG).');
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      alert('File size exceeds 1MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onUpdateImage?.(file);
  };

  const handleSave = () => {
    onUpdateName?.(editFirstName, editLastName);
    setShowModal(false);
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              <Avatar
                avatar={imagePreview || avatar}
                username={`${firstName} ${lastName}`}
                size={90}
                className={styles.avatarImage}
              />
              {modifyButton && (
                <label className={styles.avatarEdit}>
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    className={styles.hiddenInput}
                    onChange={handleImageChange}
                  />
                  <Camera size={16} />
                </label>
              )}
              <span className={styles.onlineIndicator} />
            </div>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.nameRow}>
              <h4 className={styles.name}>{`${firstName} ${lastName}`}</h4>
              {modifyButton && (
                <button
                  type="button"
                  className={styles.editButton}
                  onClick={() => setShowModal(true)}
                  title="Edit Profile Name"
                >
                  <Pencil size={16} />
                </button>
              )}
            </div>

            {email && <div className={styles.email}>{email}</div>}

            <ReviewStars rating={rating} reviewCount={reviewsCount} size={14} />

            {badges.length > 0 && (
              <div className={styles.badges}>
                {badges.map((item, index) => (
                  <img
                    src={item.badge_icon}
                    alt={item.badge_name}
                    key={index}
                    width={30}
                    height={30}
                    className={styles.badge}
                  />
                ))}
              </div>
            )}
          </div>

          {completionPercentage !== undefined && (
            <div className={styles.completionSection}>
              <h4 className={styles.completionPercent}>{completionPercentage}%</h4>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <p className={styles.completionLabel}>Account Completion</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        id="editNameModal"
        title="Edit Display Name"
        saveButtonText="Save changes"
        onSave={handleSave}
        show={showModal}
        onClose={() => setShowModal(false)}
        backdropStatic={true}
      >
        <div className={styles.formGroup}>
          <label className={styles.label}>First Name</label>
          <input
            type="text"
            className={styles.input}
            value={editFirstName}
            onChange={(e) => setEditFirstName(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Last Name</label>
          <input
            type="text"
            className={styles.input}
            value={editLastName}
            onChange={(e) => setEditLastName(e.target.value)}
          />
        </div>
      </Modal>
    </>
  );
}
