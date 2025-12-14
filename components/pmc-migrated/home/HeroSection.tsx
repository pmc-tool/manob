// Hero Section - Reusable component for landing pages
'use client';

import { useState } from 'react';
import { Paperclip, Mail, Image, Smartphone, CreditCard, Activity } from 'lucide-react';
import styles from './home.module.css';

interface QuickSuggestion {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  suggestions?: QuickSuggestion[];
  onSubmit?: (query: string) => void;
  onTalkToHuman?: () => void;
  compact?: boolean;
}

const defaultSuggestions: QuickSuggestion[] = [
  { icon: <Mail size={16} />, label: 'SaaS starter pack' },
  { icon: <Image size={16} />, label: 'E-commerce kit' },
  { icon: <Smartphone size={16} />, label: 'Mobile app MVP' },
  { icon: <CreditCard size={16} />, label: 'Payments + auth' },
];

export default function HeroSection({
  title = 'manob.ai blends humans and AI in one workspace.',
  subtitle = 'Buy production-ready code packs, co-edit with AI, and ship with real engineers watching your back. Own your code, deploy faster, keep humans in the loop.',
  placeholder = 'Describe what you want to build with manob.ai...',
  suggestions = defaultSuggestions,
  onSubmit,
  onTalkToHuman,
  compact = false,
}: HeroSectionProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    if (onSubmit && query.trim()) {
      onSubmit(query);
    }
  };

  return (
    <section
      className={styles.heroSection}
      style={compact ? { padding: '24px 0 16px' } : undefined}
    >
      {/* Background Logo Watermark */}
      <div className={styles.heroWatermark}>
        <svg className={styles.watermarkLogo} viewBox="0 0 642 212" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M114.193 56.7002L247.3 189.807V56.7002H297.5V225C297.5 244.606 281.606 260.5 262 260.5C252.632 260.5 243.391 256.887 236.754 250.25L43.207 56.7002H114.193ZM507.6 5.5C547.088 5.5 579.1 37.5116 579.1 77V209.3H528.9V91.3926L409.993 210.3H527.9V260.5H395.6C356.111 260.5 324.1 228.488 324.1 189V56.7002H374.3V175.007L375.153 174.153L492.754 56.5537L493.607 55.7002H375.3V5.5H507.6Z" stroke="currentColor" strokeOpacity="0.3"/>
        </svg>
      </div>

      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>{title}</h1>
        <p className={styles.heroSubtitle}>{subtitle}</p>

        {/* Chat Input */}
        <div className={styles.chatInputWrapper}>
          <div className={styles.chatInput}>
            <textarea
              placeholder={placeholder}
              rows={2}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.chatTextarea}
            />
            <div className={styles.chatActions}>
              <div className={styles.chatActionsLeft}>
                <button className={styles.attachButton}>
                  <Paperclip size={20} />
                </button>
              </div>
              <div className={styles.chatActionsRight}>
                <button className={styles.secondaryButton} onClick={onTalkToHuman}>
                  Talk to a human
                </button>
                <button className={styles.primaryButton} onClick={handleSubmit}>
                  Spin up with AI
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Suggestions */}
        <div className={styles.suggestions}>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className={styles.suggestionChip}
              onClick={suggestion.onClick}
            >
              {suggestion.icon}
              <span>{suggestion.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
