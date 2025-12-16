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
        <div className="relative mb-3">
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm pr-8"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={14} className="absolute right-0 top-1/2 -translate-y-1/2 mr-2 text-gray-400" />
        </div>
      )}
      <div className="flex flex-col gap-2" style={{ maxHeight: "200px", overflowY: "auto" }}>
        {filteredOptions.map((option) => (
          <label key={option.id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 accent-primary cursor-pointer m-0"
              checked={selected.includes(option.id)}
              onChange={(e) => handleChange(option.id, e.target.checked)}
            />
            <span className="text-sm text-gray-900">{option.title}</span>
            {option.count !== undefined && (
              <span className="text-gray-500 text-xs ml-auto">({option.count})</span>
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
      <div className="flex gap-2 mb-3">
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">Min</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
            value={min}
            onChange={(e) => {
              setMin(Number(e.target.value));
              onRangeChange?.(Number(e.target.value), max);
            }}
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">Max</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
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
        className="w-full accent-primary"
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
            className="bg-transparent border-0 pb-4 pt-0 px-0 rounded-none"
            id={`heading${index + 1}`}
          >
            <button
              className="border-0 bg-transparent font-bold text-xs uppercase p-0 relative text-left w-full flex justify-between items-center"
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
