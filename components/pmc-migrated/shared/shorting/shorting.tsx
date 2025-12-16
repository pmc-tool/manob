// Shorting component - converted to Tailwind CSS (already was mostly Tailwind)
import React from "react";

interface ShortingProps {
  options: { id: string; label: string }[];
  name: string;
  onSelect: (value: string) => void;
  selectedOption: string;
}

export default function Shorting({
  options,
  name,
  onSelect,
  selectedOption,
}: ShortingProps) {
  return (
    <>
      <div
        className="hidden lg:inline-flex rounded-lg overflow-hidden border border-gray-200"
        role="group"
        aria-label="Basic radio toggle button group"
      >
        {options.map((option) => (
          <React.Fragment key={option.id}>
            <input
              type="radio"
              className="sr-only"
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
      <div className="flex items-center text-gray-900 gap-2 whitespace-nowrap lg:hidden">
        <span>Sort by</span>
        <select
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          value={selectedOption}
          onChange={(e) => onSelect(e.target.value)}
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
