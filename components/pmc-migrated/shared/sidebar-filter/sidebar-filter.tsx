// SidebarFilter - simplified from PMC (matching original design)
// Will connect to API when backend is ready
"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

interface FilterOption {
  id: string;
  title: string;
  count?: number;
}

interface FilterGroup {
  type_name: string;
  filters: FilterOption[];
}

interface Filter {
  name: string;
  type: string;
  category: string;
  key: string;
  options: FilterOption[] | FilterGroup[] | { min: number; max: number };
  showSearch?: boolean;
}

interface SidebarFilterProps {
  filters: Filter[];
  onFilterChange?: (key: string, value: any) => void;
}

// Checkbox filter for experience levels, skills, etc.
function CheckboxFilter({
  options,
  showSearch = false,
  onSelect,
}: {
  options: FilterOption[];
  showSearch?: boolean;
  onSelect?: (id: string, checked: boolean) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const filteredOptions = options.filter((opt) =>
    opt.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelected([...selected, id]);
    } else {
      setSelected(selected.filter((s) => s !== id));
    }
    onSelect?.(id, checked);
  };

  return (
    <div>
      {showSearch && (
        <div className="position-relative mb-3">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={14} className="position-absolute end-0 top-50 translate-middle-y me-2 text-muted" />
        </div>
      )}
      <div className="d-flex flex-column gap-2" style={{ maxHeight: "200px", overflowY: "auto" }}>
        {filteredOptions.map((option) => (
          <label key={option.id} className="d-flex align-items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="form-check-input m-0"
              checked={selected.includes(option.id)}
              onChange={(e) => handleChange(option.id, e.target.checked)}
            />
            <span className="fz14 text-dark">{option.title}</span>
            {option.count !== undefined && (
              <span className="text-muted fz12 ms-auto">({option.count})</span>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

// Range slider for price, bid count, etc.
function RangeFilter({
  minValue,
  maxValue,
  onRangeChange,
}: {
  minValue: number;
  maxValue: number;
  onRangeChange?: (min: number, max: number) => void;
}) {
  const [min, setMin] = useState(minValue);
  const [max, setMax] = useState(maxValue);

  return (
    <div>
      <div className="d-flex gap-2 mb-3">
        <div className="flex-1">
          <label className="fz12 text-muted mb-1">Min</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={min}
            onChange={(e) => {
              setMin(Number(e.target.value));
              onRangeChange?.(Number(e.target.value), max);
            }}
          />
        </div>
        <div className="flex-1">
          <label className="fz12 text-muted mb-1">Max</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={max}
            onChange={(e) => {
              setMax(Number(e.target.value));
              onRangeChange?.(min, Number(e.target.value));
            }}
          />
        </div>
      </div>
      <input
        type="range"
        className="form-range"
        min={minValue}
        max={maxValue}
        value={max}
        onChange={(e) => {
          setMax(Number(e.target.value));
          onRangeChange?.(min, Number(e.target.value));
        }}
      />
    </div>
  );
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({
  filters,
  onFilterChange,
}) => {
  const [openSections, setOpenSections] = useState<Record<number, boolean>>(
    filters.reduce((acc, _, idx) => ({ ...acc, [idx]: true }), {})
  );

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const isRangeOptions = (options: any): options is { min: number; max: number } => {
    return options && typeof options.min === "number" && typeof options.max === "number";
  };

  const isFilterGroups = (options: any): options is FilterGroup[] => {
    return Array.isArray(options) && options[0]?.type_name !== undefined;
  };

  return (
    <div className="accordion" id="accordionFilter">
      {filters?.map((filter, index) => (
        <div
          key={index}
          className="bg-transparent border-0 border-bottom card rounded-0 mb-4"
        >
          <div
            className="bg-transparent border-0 card-header pb-4 pt-0 px-0 rounded-0"
            id={`heading${index + 1}`}
          >
            <button
              className="border-0 btn btn-collapse fw-bold fz13 text-uppercase p-0 position-relative text-start w-100 collapse-title d-flex justify-content-between align-items-center"
              type="button"
              onClick={() => toggleSection(index)}
            >
              {filter?.name}
              <ChevronDown
                size={16}
                className={`transition-transform ${openSections[index] ? "rotate-180" : ""}`}
              />
            </button>
          </div>
          {openSections[index] && (
            <div className="card-body px-0 pt-0 pb-4">
              {/* Range filters (pricing, bid_counts) */}
              {(filter.type === "pricing" || filter.type === "bid_counts") &&
                isRangeOptions(filter.options) && (
                  <RangeFilter
                    minValue={filter.options.min}
                    maxValue={filter.options.max}
                    onRangeChange={(min, max) =>
                      onFilterChange?.(filter.key, { min, max })
                    }
                  />
                )}

              {/* Experience level filter */}
              {filter.type === "experience_levels" &&
                Array.isArray(filter.options) &&
                !isFilterGroups(filter.options) && (
                  <CheckboxFilter
                    options={filter.options as FilterOption[]}
                    onSelect={(id, checked) =>
                      onFilterChange?.(filter.key, { id, checked })
                    }
                  />
                )}

              {/* Job attributes (skills, location) */}
              {filter.type === "job_attributes" &&
                isFilterGroups(filter.options) &&
                filter.options.map((group, groupIdx) => (
                  <div key={groupIdx} className="mb-4">
                    <h6 className="fz14 fw-semibold mb-2">- {group.type_name}</h6>
                    <CheckboxFilter
                      options={group.filters}
                      showSearch={filter.showSearch}
                      onSelect={(id, checked) =>
                        onFilterChange?.(group.type_name.toLowerCase(), {
                          id,
                          checked,
                        })
                      }
                    />
                  </div>
                ))}

              {/* Generic checkbox filter */}
              {filter.type === "CheckboxFilter" &&
                Array.isArray(filter.options) &&
                !isFilterGroups(filter.options) && (
                  <CheckboxFilter
                    options={filter.options as FilterOption[]}
                    showSearch={filter.showSearch}
                    onSelect={(id, checked) =>
                      onFilterChange?.(filter.key, { id, checked })
                    }
                  />
                )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SidebarFilter;
