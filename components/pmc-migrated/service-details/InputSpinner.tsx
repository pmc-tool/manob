'use client';

import { Minus, Plus } from 'lucide-react';

interface InputSpinnerProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export default function InputSpinner({
  value,
  onChange,
  min = 1,
  max = 99,
  className = '',
}: InputSpinnerProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className={`input-spinner ${className}`}>
      <button
        type="button"
        className="input-spinner-btn"
        onClick={handleDecrement}
        disabled={value <= min}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="input-spinner-value">{value}</span>
      <button
        type="button"
        className="input-spinner-btn"
        onClick={handleIncrement}
        disabled={value >= max}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
