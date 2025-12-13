import React from "react";

interface ShortingProps {
  options: { id: string; label: string }[];
  name: string;
  onSelect: (value: string) => void;
  selectedOption: string;
}
export default function Status({
  options,
  name,
  onSelect,
  selectedOption,
}: ShortingProps) {
  return (
    <div
      className="btn-group d-lg-inline-flex"
      role="group"
      aria-label="Basic radio toggle button group"
    >
      {options.map((option) => (
        <React.Fragment key={option.id}>
          <input
            type="radio"
            className="btn-check"
            name={name}
            id={option.id}
            autoComplete="off"
            checked={selectedOption === option.id}
            onChange={() => onSelect(option.id)}
          />
          <label
            className="btn btn-outline-light btn-radio"
            htmlFor={option.id}
          >
            {option.label}
          </label>
        </React.Fragment>
      ))}
    </div>
  );
}
