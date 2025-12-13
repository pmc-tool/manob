// MIGRATION: SecurityPage component from PackMyCode
'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './settings.module.css';

interface FormData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

interface FormErrors {
  old_password?: string;
  new_password?: string;
  confirm_password?: string;
}

export default function SecurityPage() {
  const [formData, setFormData] = useState<FormData>({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.old_password) {
      newErrors.old_password = 'Password is required';
    }

    if (!formData.new_password) {
      newErrors.new_password = 'Password is required';
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.new_password)) {
      newErrors.new_password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(formData.new_password)) {
      newErrors.new_password = 'Password must contain at least one lowercase letter';
    } else if (!/\d/.test(formData.new_password)) {
      newErrors.new_password = 'Password must contain at least one number';
    } else if (!/[@$!%*?&]/.test(formData.new_password)) {
      newErrors.new_password = 'Password must contain at least one special character';
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password';
    } else if (formData.confirm_password !== formData.new_password) {
      newErrors.confirm_password = 'Passwords must match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccessMessage('Password changed successfully!');
      setFormData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      setErrors({ old_password: 'Failed to change password. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.settingsCard}>
      <form onSubmit={handleSubmit}>
        <div className={styles.cardBody}>
          <div className={styles.cardHeader}>
            <h2>Change Password</h2>
            <p className={styles.muted}>
              Secure your account with a strong password and two-factor authentication.
            </p>
          </div>

          {successMessage && (
            <div className={styles.successMessage}>{successMessage}</div>
          )}

          <div className={styles.formSection}>
            {/* Current Password */}
            <div className={styles.formRow}>
              <div className={styles.formLabel}>
                <h6 className={styles.required}>Current Password</h6>
                <p className={styles.muted}>
                  Please enter your existing password for verification.
                </p>
              </div>
              <div className={styles.formInput}>
                <div className={styles.inputWrapper}>
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    name="old_password"
                    placeholder="Enter Current Password"
                    maxLength={20}
                    value={formData.old_password}
                    onChange={handleChange}
                    className={errors.old_password ? styles.inputError : ''}
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {errors.old_password && (
                  <span className={styles.errorText}>{errors.old_password}</span>
                )}
              </div>
            </div>

            {/* New Password */}
            <div className={styles.formRow}>
              <div className={styles.formLabel}>
                <h6 className={styles.required}>New Password</h6>
                <p className={styles.muted}>
                  Choose a strong password with at least 8 characters.
                </p>
              </div>
              <div className={styles.formInput}>
                <div className={styles.inputWrapper}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="new_password"
                    placeholder="Enter New Password"
                    maxLength={20}
                    value={formData.new_password}
                    onChange={handleChange}
                    className={errors.new_password ? styles.inputError : ''}
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {errors.new_password && (
                  <span className={styles.errorText}>{errors.new_password}</span>
                )}
              </div>
            </div>

            {/* Confirm Password */}
            <div className={`${styles.formRow} ${styles.noBorder}`}>
              <div className={styles.formLabel}>
                <h6 className={styles.required}>Re-Enter Password</h6>
                <p className={styles.muted}>
                  Confirm your new password by entering it again.
                </p>
              </div>
              <div className={styles.formInput}>
                <div className={styles.inputWrapper}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirm_password"
                    placeholder="Re-Enter New Password"
                    maxLength={20}
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className={errors.confirm_password ? styles.inputError : ''}
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {errors.confirm_password && (
                  <span className={styles.errorText}>{errors.confirm_password}</span>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Changing Password...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
