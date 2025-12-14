// MIGRATION: AskQuestionPage component from manob.ai
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './forum.module.css';

export default function AskQuestionPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const validateForm = () => {
    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.replace(/<(.|\n)*?>/g, '').trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // MOCK: Simulate API call
    setTimeout(() => {
      console.log('Question submitted:', { title, description });
      setIsSubmitting(false);
      router.push('/forum/questions');
    }, 1000);
  };

  return (
    <div className={styles.forumContainer}>
      <div className={styles.askHeader}>
        <h2>
          Start a discussion by asking your question
          <br />
          in the Staging Ground.
        </h2>
      </div>

      <div className={styles.askContent}>
        <div className={styles.askMain}>
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Title <span className={styles.required}>*</span>
              </label>
              <p className={styles.formHint}>
                Ask clearly and conversationally, just like you would in real life.
              </p>
              <input
                type="text"
                className={`${styles.formInput} ${errors.title ? styles.inputError : ''}`}
                placeholder="Write a descriptive title for your post"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
              />
              {errors.title && <span className={styles.errorText}>{errors.title}</span>}
            </div>

            {/* Description */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                What are the details of your problem? <span className={styles.required}>*</span>
              </label>
              <p className={styles.formHint}>
                Provide a detailed introduction to the issue you're facing, starting from the title.
                Minimum 20 characters.
              </p>
              <textarea
                className={`${styles.formTextarea} ${errors.description ? styles.inputError : ''}`}
                placeholder="Describe your problem, include code if needed..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={10}
              />
              {errors.description && <span className={styles.errorText}>{errors.description}</span>}
            </div>

            {/* Submit */}
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Topic'}
            </button>
          </form>
        </div>

        {/* Sidebar tips */}
        <div className={styles.askSidebar}>
          <h5>Query helper tips</h5>
          <p>
            Improve your question by adding a clear title, explaining your issue in detail, and
            describing what you hope to achieve. Helpful suggestions will appear here.
          </p>
          <p className={styles.muted}>
            <em>
              Review your question carefully. The feedback provided is experimental and may not
              address every aspect of effective question writing.
            </em>
          </p>
        </div>
      </div>
    </div>
  );
}
