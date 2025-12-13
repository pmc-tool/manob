'use client';

import { Tooltip } from 'antd';
import { Linkedin, Twitter, Link } from 'lucide-react';

interface ShareArticleProps {
  className?: string;
}

export default function ShareArticle({ className = '' }: ShareArticleProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log('Copied to clipboard:', text);
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  };

  const shareOnLinkedIn = () => {
    const shareUrl = encodeURIComponent(window.location.href);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const shareOnTwitter = () => {
    const shareUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.title);
    window.open(
      `https://twitter.com/intent/tweet?url=${shareUrl}&text=${text}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className={`mb-5 ${className}`}>
      <h6 className="mb-3 text-lg font-semibold">Share with others</h6>
      <div className="border-l border-gray-200 flex gap-3 pl-4">
        <Tooltip title="LinkedIn">
          <div
            className="text-gray-500 cursor-pointer hover:text-primary transition-colors"
            onClick={shareOnLinkedIn}
          >
            <Linkedin size={23} />
          </div>
        </Tooltip>
        <Tooltip title="Twitter X">
          <div
            className="text-gray-500 cursor-pointer hover:text-primary transition-colors"
            onClick={shareOnTwitter}
          >
            <Twitter size={24} />
          </div>
        </Tooltip>
        <Tooltip title="Copy URL">
          <div
            className="text-gray-500 cursor-pointer hover:text-primary transition-colors"
            onClick={() => copyToClipboard(window.location.href)}
          >
            <Link size={28} />
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
