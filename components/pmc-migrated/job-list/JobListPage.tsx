// JobListPage - migrated from PMC (matching original design exactly)
"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, X, RefreshCw, SlidersHorizontal, Search, ChevronDown } from "lucide-react";
import { Skeleton, Slider, InputNumber } from "antd";
import JobCard from "./job-card";
import { mockJobs, calculateTimeAgo } from "@/lib/mocks/job-list.mock";
import { useAuth } from "@/context/AuthContext";
import styles from "./JobListPage.module.css";

const radioToggle = [
  { id: "ALL", label: "All" },
  { id: "LIVE", label: "Live Job" },
  { id: "REGULAR", label: "Regular Job" },
];

// Filter sections
const experienceLevels = [
  { id: "entry", title: "Entry Level", count: 5 },
  { id: "intermediate", title: "Intermediate", count: 12 },
  { id: "expert", title: "Expert", count: 8 },
];

const skillFilters = [
  { id: "react", title: "React", count: 15 },
  { id: "nodejs", title: "Node.js", count: 12 },
  { id: "python", title: "Python", count: 10 },
  { id: "typescript", title: "TypeScript", count: 8 },
  { id: "aws", title: "AWS", count: 6 },
];

const locationFilters = [
  { id: "us", title: "United States", count: 20 },
  { id: "uk", title: "United Kingdom", count: 8 },
  { id: "ca", title: "Canada", count: 5 },
  { id: "au", title: "Australia", count: 4 },
];

export default function JobListPage() {
  const [selectedOption, setSelectedOption] = useState<string>("ALL");
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [bidRange, setBidRange] = useState<[number, number]>([0, 50]);
  const [expandedSections, setExpandedSections] = useState({
    budget: true,
    experience: true,
    bids: true,
    skills: true,
    location: true,
  });
  const [selectedFilters, setSelectedFilters] = useState<{
    experience: string[];
    skills: string[];
    location: string[];
  }>({
    experience: [],
    skills: [],
    location: [],
  });
  const { isAuthenticated, openLoginModal } = useAuth();

  const isLoading = false;
  const error = null;

  // Filter jobs
  const jobItems = mockJobs.filter((job) => {
    if (selectedOption !== "ALL" && job.job_type !== selectedOption) {
      return false;
    }
    return true;
  });

  const jobCount = jobItems.length;

  const handleSelect = (value: string) => {
    setSelectedOption(value);
  };

  const toggleFilter = () => {
    setIsFilterActive(!isFilterActive);
  };

  const closeFilter = () => {
    setIsFilterActive(false);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleFilterItem = (
    category: "experience" | "skills" | "location",
    id: string
  ) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(id)
        ? prev[category].filter((item) => item !== id)
        : [...prev[category], id],
    }));
  };

  const handleClearAll = () => {
    setSelectedFilters({ experience: [], skills: [], location: [] });
    setPriceRange([0, 10000]);
    setBidRange([0, 50]);
  };

  const handlePostJob = () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    window.location.href = "/user/job-post";
  };

  const handleDrawer = (job: any) => {
    console.log("Open job details:", job);
  };

  const hasActiveFilters =
    selectedFilters.experience.length > 0 ||
    selectedFilters.skills.length > 0 ||
    selectedFilters.location.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 10000;

  return (
    <div className={styles.jobListPage}>
      {/* Search Header */}
      <div className={styles.searchHeader}>
        <form className={styles.searchBox}>
          <input
            className={styles.searchInput}
            type="search"
            name="search"
            autoComplete="off"
            placeholder="Search to get desired results"
          />
          <button className={styles.searchButton} type="submit">
            <Search size={18} />
            <span>Search</span>
          </button>
        </form>
        <div className={styles.searchInfo}>
          <strong>{jobCount}</strong> Job results available
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Sidebar Filter */}
        <aside className={`${styles.sidebar} ${isFilterActive ? styles.sidebarActive : ""}`}>
          {/* Mobile Header */}
          <div className={styles.sidebarMobileHeader}>
            <button className={styles.filterClose} onClick={closeFilter}>
              <X size={20} />
            </button>
            <span className={styles.filterTitle}>Filters</span>
            <button className={styles.clearBtn} onClick={handleClearAll}>
              Clear
            </button>
          </div>

          <div className={styles.sidebarBody}>
            {/* Budget Filter */}
            <div className={styles.filterSection}>
              <button
                className={styles.filterHeader}
                onClick={() => toggleSection("budget")}
              >
                <span>BUDGET</span>
                <ChevronDown
                  size={16}
                  className={expandedSections.budget ? styles.rotated : ""}
                />
              </button>
              {expandedSections.budget && (
                <div className={styles.filterContent}>
                  <div className={styles.rangeInputs}>
                    <InputNumber
                      min={0}
                      max={10000}
                      value={priceRange[0]}
                      onChange={(val) => setPriceRange([val || 0, priceRange[1]])}
                      prefix="$"
                      size="small"
                    />
                    <span>to</span>
                    <InputNumber
                      min={0}
                      max={10000}
                      value={priceRange[1]}
                      onChange={(val) => setPriceRange([priceRange[0], val || 10000])}
                      prefix="$"
                      size="small"
                    />
                  </div>
                  <Slider
                    range
                    min={0}
                    max={10000}
                    value={priceRange}
                    onChange={(val) => setPriceRange(val as [number, number])}
                    className={styles.rangeSlider}
                  />
                </div>
              )}
            </div>

            {/* Experience Level Filter */}
            <div className={styles.filterSection}>
              <button
                className={styles.filterHeader}
                onClick={() => toggleSection("experience")}
              >
                <span>EXPERIENCE LEVEL</span>
                <ChevronDown
                  size={16}
                  className={expandedSections.experience ? styles.rotated : ""}
                />
              </button>
              {expandedSections.experience && (
                <div className={styles.filterContent}>
                  {experienceLevels.map((level) => (
                    <label key={level.id} className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={selectedFilters.experience.includes(level.id)}
                        onChange={() => toggleFilterItem("experience", level.id)}
                      />
                      <span className={styles.checkboxLabel}>{level.title}</span>
                      <span className={styles.count}>({level.count})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Bid Count Filter */}
            <div className={styles.filterSection}>
              <button
                className={styles.filterHeader}
                onClick={() => toggleSection("bids")}
              >
                <span>BID COUNT</span>
                <ChevronDown
                  size={16}
                  className={expandedSections.bids ? styles.rotated : ""}
                />
              </button>
              {expandedSections.bids && (
                <div className={styles.filterContent}>
                  <div className={styles.rangeInputs}>
                    <InputNumber
                      min={0}
                      max={50}
                      value={bidRange[0]}
                      onChange={(val) => setBidRange([val || 0, bidRange[1]])}
                      size="small"
                    />
                    <span>to</span>
                    <InputNumber
                      min={0}
                      max={50}
                      value={bidRange[1]}
                      onChange={(val) => setBidRange([bidRange[0], val || 50])}
                      size="small"
                    />
                  </div>
                  <Slider
                    range
                    min={0}
                    max={50}
                    value={bidRange}
                    onChange={(val) => setBidRange(val as [number, number])}
                    className={styles.rangeSlider}
                  />
                </div>
              )}
            </div>

            {/* Skills Filter */}
            <div className={styles.filterSection}>
              <button
                className={styles.filterHeader}
                onClick={() => toggleSection("skills")}
              >
                <span>SKILLS</span>
                <ChevronDown
                  size={16}
                  className={expandedSections.skills ? styles.rotated : ""}
                />
              </button>
              {expandedSections.skills && (
                <div className={styles.filterContent}>
                  {skillFilters.map((skill) => (
                    <label key={skill.id} className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={selectedFilters.skills.includes(skill.id)}
                        onChange={() => toggleFilterItem("skills", skill.id)}
                      />
                      <span className={styles.checkboxLabel}>{skill.title}</span>
                      <span className={styles.count}>({skill.count})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Location Filter */}
            <div className={styles.filterSection}>
              <button
                className={styles.filterHeader}
                onClick={() => toggleSection("location")}
              >
                <span>CLIENT LOCATION</span>
                <ChevronDown
                  size={16}
                  className={expandedSections.location ? styles.rotated : ""}
                />
              </button>
              {expandedSections.location && (
                <div className={styles.filterContent}>
                  {locationFilters.map((loc) => (
                    <label key={loc.id} className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={selectedFilters.location.includes(loc.id)}
                        onChange={() => toggleFilterItem("location", loc.id)}
                      />
                      <span className={styles.checkboxLabel}>{loc.title}</span>
                      <span className={styles.count}>({loc.count})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Apply Button */}
            <div className={styles.mobileApply}>
              <button className={styles.applyBtn} onClick={closeFilter}>
                Apply filters
              </button>
              <button className={styles.clearFiltersBtn} onClick={handleClearAll}>
                <RefreshCw size={16} />
                Clear filters
              </button>
            </div>
          </div>
        </aside>

        {/* Job List */}
        <div className={styles.jobListContainer}>
          {/* Header Bar */}
          <div className={styles.listHeader}>
            <div className={styles.listTitle}>
              <h1>Jobs available</h1>
              <span className={styles.itemCount}>- {jobCount} items</span>
            </div>

            <div className={styles.listActions}>
              {/* Toggle Buttons - Desktop */}
              <div className={styles.toggleGroup}>
                {radioToggle.map((option) => (
                  <button
                    key={option.id}
                    className={`${styles.toggleBtn} ${selectedOption === option.id ? styles.toggleBtnActive : ""}`}
                    onClick={() => handleSelect(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Toggle Select - Mobile */}
              <select
                className={styles.toggleSelect}
                value={selectedOption}
                onChange={(e) => handleSelect(e.target.value)}
              >
                {radioToggle.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button className={styles.postJobBtn} onClick={handlePostJob}>
                <Plus size={18} />
                <span>Post a job</span>
              </button>

              <button className={styles.filterToggleBtn} onClick={toggleFilter}>
                <SlidersHorizontal size={18} />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Job Cards */}
          <div className={styles.jobCards}>
            {isLoading ? (
              Array(5)
                .fill(0)
                .map((_, idx) => (
                  <div key={idx} className={styles.skeletonCard}>
                    <Skeleton active paragraph={{ rows: 3 }} />
                  </div>
                ))
            ) : error ? (
              <div className={styles.errorState}>
                <img
                  src="/images/empty-icon/error-404.svg"
                  alt="Error"
                  width={200}
                />
                <p>Error loading jobs.</p>
              </div>
            ) : jobItems?.length === 0 ? (
              <div className={styles.emptyState}>
                <img
                  src="/images/empty-icon/error-404-02.svg"
                  alt="No results"
                  width={200}
                />
                <h3>No Results Found</h3>
                <p>
                  We couldn&apos;t find anything matching your search and filters.
                  Try changing your keywords or adjusting the filters.
                </p>
              </div>
            ) : (
              jobItems?.map((cardData: any, idx: number) => (
                <JobCard
                  key={cardData?.id}
                  id={cardData?.id}
                  posted={calculateTimeAgo(cardData.created_at)}
                  salary={cardData.service_price}
                  title={cardData.title}
                  description={cardData?.description}
                  days={`${cardData?.delivery_time} ${cardData?.delivery_time_type}`}
                  level={cardData?.experience_level}
                  totalBids={cardData?.total_bids}
                  url={`/job-details/${cardData?.slug}`}
                  targetDate={cardData?.job_type === "LIVE" ? new Date() : null}
                  status={cardData.status}
                  jobType={cardData.job_type}
                  skills={cardData?.skills || []}
                  idx={idx}
                  handleDrawer={() => handleDrawer(cardData)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile filter */}
      {isFilterActive && (
        <div className={styles.overlay} onClick={closeFilter} />
      )}
    </div>
  );
}
