// InputSpinner - migrated from PMC
"use client";

import React, { useState } from "react";

interface InputSpinnerProps {
  min?: number;
  max?: number;
  step?: number;
  initialValue?: number;
  onChange?: (value: number, type: string) => void;
}

const InputSpinner: React.FC<InputSpinnerProps> = ({
  min = 0,
  max = 100,
  step = 1,
  initialValue = 0,
  onChange,
}) => {
  const [value, setValue] = useState<number>(initialValue);

  const handleDecrement = () => {
    const newValue = Math.max(value - step, min);
    setValue(newValue);
    if (onChange) onChange(newValue, "decrement");
  };

  const handleIncrement = () => {
    const newValue = Math.min(value + step, max);
    setValue(newValue);
    if (onChange) onChange(newValue, "increment");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseInt(e.target.value, 10);
    if (!isNaN(inputValue) && inputValue >= min && inputValue <= max) {
      setValue(inputValue);
      if (onChange) onChange(inputValue, "change");
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleDecrement}
        disabled={value <= min}
      >
        -
      </button>
      <input
        type="text"
        className="w-[50px] text-center border border-gray-300 rounded py-1 text-sm"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={true}
      />
      <button
        type="button"
        className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleIncrement}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
};

export default InputSpinner;
