// MIGRATION: Support Contact page from PackMyCode
'use client';

import Link from 'next/link';
import { Card, Button } from 'antd';
import { Users, MessageCircle, Headset, ArrowRight } from 'lucide-react';
import styles from './page.module.css';

interface SupportOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  helpText: string;
  ticketLink: string;
  reverse?: boolean;
}

function SupportOption({ icon, title, description, helpText, ticketLink, reverse }: SupportOptionProps) {
  return (
    <div className={`${styles.supportOption} ${reverse ? styles.reverse : ''}`}>
      <div className={styles.iconWrapper}>{icon}</div>
      <div className={styles.optionContent}>
        <h3 className={styles.optionTitle}>{title}</h3>
        <p className={styles.helpLink}>
          Visit PackMyCode{' '}
          <Link href="/help" className={styles.link}>
            Help Center
          </Link>
        </p>
        <p className={styles.optionDescription}>{description}</p>
        <Link href={ticketLink}>
          <Button type="primary" className={styles.submitBtn}>
            Submit a ticket
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function SupportContactPage() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Support Contact PackMyCode</h1>
        <p className={styles.subtitle}>
          Find answers to commonly asked questions, and submit requests to appropriate
          <br className={styles.hideMobile} />
          help teams as needed by choosing the service below:
        </p>
      </div>

      {/* Support Options Card */}
      <Card className={styles.optionsCard}>
        {/* Main Support Team */}
        <div className={styles.mainSupport}>
          <div className={styles.mainSupportInner}>
            <div className={styles.mainIcon}>
              <Users size={36} />
            </div>
            <h2 className={styles.mainTitle}>PackMyCode Market Support Team</h2>
            <p className={styles.mainHelpLink}>
              Visit PackMyCode{' '}
              <Link href="/help" className={styles.link}>
                Help Center
              </Link>
            </p>
            <p className={styles.mainDescription}>
              Need assistance from the Market support team. Please provide contact details or next steps. Thanks!
            </p>
            <Link href="/support-contact/market-request">
              <Button type="primary" size="large" className={styles.mainBtn}>
                Submit a ticket
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Secondary Support Options */}
        <div className={styles.secondarySupport}>
          <SupportOption
            icon={<MessageCircle size={32} />}
            title="Product Support Help Center"
            helpText="Visit PackMyCode Help Center"
            description="Need help? Get help from the community. If you're on a paid plan, submit a ticket to our expert support team for quick solutions."
            ticketLink="/support-contact/product-request"
          />

          <SupportOption
            icon={<Headset size={32} />}
            title="Seller Support Help Center"
            helpText="Visit PackMyCode Help Center"
            description="Welcome to the PackMyCode Seller Help Center! Find guides, tips, and support to help you create and manage your code packages with ease."
            ticketLink="/support-contact/seller-request"
            reverse
          />
        </div>
      </Card>

      {/* Quick Links */}
      <div className={styles.quickLinks}>
        <Link href="/support-requests" className={styles.quickLink}>
          View My Support Requests
        </Link>
        <Link href="/help" className={styles.quickLink}>
          Browse Help Articles
        </Link>
      </div>
    </div>
  );
}
