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
        className="btn-group d-none d-lg-inline-flex"
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
      <div className="align-items-center d-flex dark-color gap-2 text-nowrap d-lg-none">
        <span>Sort by</span>
        <select
          className="form-select"
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
