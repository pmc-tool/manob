// MIGRATION: Ribbon component from manob.ai
'use client';

import { ReactNode } from 'react';

type RibbonProps = {
  label?: string;
  icon?: ReactNode;
  variant?: 'trending' | 'sale' | 'pixi';
};

const variantStyles = {
  trending: {
    bg: 'bg-[#0084b4]',
    after: '#89d3ed',
  },
  sale: {
    bg: 'bg-green-600',
    after: '#b4efbb',
  },
  pixi: {
    bg: 'bg-violet-500',
    after: '#c4b5fd',
  },
};

export default function Ribbon({ label, icon, variant = 'sale' }: RibbonProps) {
  const styles = variantStyles[variant];

  return (
    <span
      className={`absolute top-5 left-0 px-3 ${styles.bg} text-white shadow-md z-[2] capitalize font-medium text-sm h-7 flex items-center justify-center gap-1 rounded-r-2xl [&+&]:top-14`}
      style={{
        boxShadow: '-1px 2px 3px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Left extension pseudo-element */}
      <span
        className={`absolute w-[7px] h-[35px] top-0 -left-[6.5px] ${styles.bg} rounded-l-[5px]`}
        aria-hidden
      />
      {/* Bottom corner pseudo-element */}
      <span
        className="absolute w-[5px] h-[5px] -bottom-[5px] -left-[4.5px] rounded-l-[5px]"
        style={{ background: styles.after }}
        aria-hidden
      />
      {label}
      {icon && <span className="flex items-center">{icon}</span>}
    </span>
  );
}
