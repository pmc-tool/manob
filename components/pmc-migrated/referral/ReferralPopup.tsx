'use client';

import { useState, useEffect } from 'react';
import { Modal, Button, Input, Progress, message } from 'antd';
import { Copy, Link2, Mail, UserPlus, CreditCard, Calculator } from 'lucide-react';

interface ReferralPopupProps {
  open: boolean;
  onClose: () => void;
}

// Mock data - will be replaced with actual API
const mockReferralData = {
  referralCode: 'XQZZMO',
  monthlyEarnings: 25,
  maxMonthlyEarnings: 200,
  signupReward: 5,
  subscribeReward: 20,
};

export default function ReferralPopup({ open, onClose }: ReferralPopupProps) {
  const [referralUrl, setReferralUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate referral URL
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    setReferralUrl(`${baseUrl}/auth?ref=${mockReferralData.referralCode}`);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      message.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      message.error('Failed to copy link');
    }
  };

  const progressPercent = (mockReferralData.monthlyEarnings / mockReferralData.maxMonthlyEarnings) * 100;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={480}
      className="referral-popup-modal"
      styles={{
        body: { padding: '32px 24px' },
      }}
    >
      <div className="referral-popup">
        {/* Diamond Icon */}
        <div className="flex justify-center mb-4">
          <div className="referral-diamond-icon">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E8D5E8" />
                  <stop offset="25%" stopColor="#B8E0E8" />
                  <stop offset="50%" stopColor="#E8E8D8" />
                  <stop offset="75%" stopColor="#D8E8F0" />
                  <stop offset="100%" stopColor="#E0D8E8" />
                </linearGradient>
              </defs>
              <path d="M40 8L12 32L40 72L68 32L40 8Z" fill="url(#diamondGradient)" stroke="#E0E0E0" strokeWidth="1"/>
              <path d="M40 8L12 32H68L40 8Z" fill="rgba(255,255,255,0.3)"/>
              <path d="M12 32L40 72L40 32H12Z" fill="rgba(0,0,0,0.05)"/>
              <line x1="40" y1="8" x2="40" y2="72" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5"/>
              <line x1="12" y1="32" x2="68" y2="32" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5"/>
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center mb-6">
          Invite & earn ${mockReferralData.maxMonthlyEarnings}/month
        </h2>

        {/* Progress Section */}
        <div className="mb-6">
          <div className="bg-gray-100 rounded-full p-3 mb-2">
            <div className="flex items-center gap-3">
              <Progress
                percent={progressPercent}
                showInfo={false}
                strokeColor="#4F46E5"
                trailColor="#E5E7EB"
                className="flex-1"
              />
              <span className="text-gray-500 text-sm whitespace-nowrap">
                Track your monthly progress here
              </span>
            </div>
          </div>
          <div className="flex justify-between text-sm font-medium text-gray-700">
            <span>$0</span>
            <span>${mockReferralData.maxMonthlyEarnings}</span>
          </div>
        </div>

        {/* Share Link Section */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-gray-600 mb-3">Share your link</p>
          <div className="flex gap-2">
            <Input
              value={referralUrl}
              readOnly
              className="flex-1 bg-white"
              prefix={<Link2 className="h-4 w-4 text-gray-400" />}
            />
            <Button
              type="default"
              icon={<Copy className="h-4 w-4" />}
              onClick={handleCopy}
              className="flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-800 border-gray-900"
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">How it works:</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600">
              <Link2 className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <span>Copy your link and invite friends</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <span>
                Each <strong className="text-gray-900">signup</strong> earns you both ${mockReferralData.signupReward} credits
              </span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <UserPlus className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <span>
                When they <strong className="text-gray-900">subscribe</strong>, you both earn ${mockReferralData.subscribeReward} credits
              </span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <CreditCard className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <span>Credits apply to your personal scope</span>
            </div>
          </div>
        </div>

        {/* Run the numbers */}
        <div className="text-center">
          <button className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
            <Calculator className="h-5 w-5" />
            <span className="font-medium">Run the numbers</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
