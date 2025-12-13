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
    <div className="align-items-center d-flex gap-1 input-number">
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm px-2"
        onClick={handleDecrement}
        disabled={value <= min}
      >
        -
      </button>
      <input
        type="text"
        className="form-control form-control-sm text-center"
        style={{ width: "50px" }}
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={true}
      />
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm px-2"
        onClick={handleIncrement}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
};

export default InputSpinner;
