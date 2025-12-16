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
      className="inline-flex lg:inline-flex rounded-lg overflow-hidden border border-gray-200"
      role="group"
      aria-label="Basic radio toggle button group"
    >
      {options.map((option) => (
        <React.Fragment key={option.id}>
          <input
            type="radio"
            className="sr-only peer"
            name={name}
            id={option.id}
            autoComplete="off"
            checked={selectedOption === option.id}
            onChange={() => onSelect(option.id)}
          />
          <label
            className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
              selectedOption === option.id
                ? "bg-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            htmlFor={option.id}
          >
            {option.label}
          </label>
        </React.Fragment>
      ))}
    </div>
  );
}
