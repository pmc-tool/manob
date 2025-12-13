'use client';

import { useState } from 'react';
import { Input, Button, message } from 'antd';

interface NewsletterProps {
  className?: string;
}

export default function Newsletter({ className = '' }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email address');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      message.success('Thank you! You\'ve successfully subscribed.');
      setEmail('');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className={`newsletter-card mb-3 p-4 rounded-xl ${className}`}>
      <img
        src="/images/support.svg"
        alt="Support"
        className="mb-3"
        height={60}
      />
      <h4 className="newsletter-title text-xl font-semibold mb-2">
        Sign up for our newsletter!
      </h4>
      <div className="newsletter-description text-sm mb-4">
        Stay updated with the latest news, exclusive offers, and special
        updates—straight to your inbox! Sign up now!
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mt-4">
          <div className="relative">
            <Input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              status={error ? 'error' : ''}
              className="rounded-lg"
            />
            {error && (
              <span className="text-red-500 text-xs mt-1 block">{error}</span>
            )}
          </div>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full mt-2 ud-btn btn-thm rounded-lg"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
