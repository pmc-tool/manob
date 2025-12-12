// MIGRATION: OTP verification from PMC
// VIPER: Visual consistency with Engine design system
// CONTRACT: Uses authApi with identical OTP behavior

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, message } from 'antd';
import { CheckCircleOutlined, MailOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { useAuth } from '@/context/AuthContext';
import { handleError } from '@/lib/api/error-handler';

/**
 * OTP Verification Component
 * MIGRATION: OTP input and verification with identical PMC behavior
 */
export function OTPVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const userId = searchParams.get('userId');

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no userId
  useEffect(() => {
    if (!userId) {
      router.push('/sign-up');
    }
  }, [userId, router]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (value && index === 5) {
      const fullCode = newCode.join('');
      if (fullCode.length === 6) {
        handleVerify(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (codeString?: string) => {
    const verifyCode = codeString || code.join('');

    if (verifyCode.length !== 6 || !userId) {
      message.error('Please enter a valid 6-digit code');
      return;
    }

    try {
      setLoading(true);

      // CONTRACT: Exact PMC API call pattern
      const response = await authApi.verifyOTP({
        userId,
        code: verifyCode,
      });

      // Update auth context
      login(response.session);

      message.success('Email verified successfully!');
      router.push('/dashboard');
    } catch (err) {
      handleError(err as Parameters<typeof handleError>[0], { showToast: true });
      // Clear code on error
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!userId || countdown > 0) return;

    try {
      setResending(true);

      // CONTRACT: Exact PMC API call pattern
      await authApi.resendOTP({ userId });

      message.success('Verification code sent!');
      setCountdown(60); // 60 second cooldown
    } catch (err) {
      handleError(err as Parameters<typeof handleError>[0], { showToast: true });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <MailOutlined className="text-2xl text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Verify your email</h1>
        <p className="mt-2 text-gray-500">
          We've sent a 6-digit verification code to your email address
        </p>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8">
        {/* OTP Input */}
        <div className="mb-6 flex justify-center gap-3">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="h-14 w-12 rounded-lg border border-gray-300 text-center text-2xl font-bold focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              disabled={loading}
            />
          ))}
        </div>

        {/* Verify Button */}
        <Button
          type="primary"
          onClick={() => handleVerify()}
          loading={loading}
          block
          size="large"
          disabled={code.some((d) => !d)}
        >
          Verify Email
        </Button>

        {/* Resend */}
        <div className="mt-6 text-center">
          <p className="text-gray-500">
            Didn't receive the code?{' '}
            {countdown > 0 ? (
              <span className="text-gray-400">
                Resend in {countdown}s
              </span>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400"
              >
                {resending ? 'Sending...' : 'Resend code'}
              </button>
            )}
          </p>
        </div>

        {/* Back to Sign Up */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/sign-up')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default OTPVerification;
