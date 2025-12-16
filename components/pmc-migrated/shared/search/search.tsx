// PageHeaderSearch - migrated from PMC
"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import styles from "./search.module.css";

interface Props {
  title?: string;
  pageTitle?: string;
  description?: string;
  placeholder: string;
  count: string;
  infoText: string;
  // initValue?: string;
}

export default function PageHeaderSearch({
  title,
  pageTitle = "",
  description,
  placeholder,
  count,
  infoText,
}: // initValue,
Props) {
  // const [inputValue, setInputValue] = useState(initValue ?? "");
  const [showModal, setShowModal] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const searchQuery = useSearchParams();
  const searchQueryValue: string | null = searchQuery.get("q");
  const handleInputClick = () => {
    setShowModal(true); // Open the SearchSuggestions modal on input click
    // Analytics tracking - window.analytics will be added when connected to backend
    (window as any).analytics?.goal?.("breadcum-search?ref=page_header");
  };
  useEffect(() => {
    setSearchVal(searchQueryValue || "");
  }, [searchQueryValue, searchQuery]);
  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  return (
    <>
      {title && <h4 className="mb-0 text-xl capitalize">{title}</h4>}
      {description && <p className="leading-normal capitalize">{description}</p>}
      <form className={`relative ${styles.searchBox}`}>
        <input
          className={`w-full border rounded-lg px-4 py-3 pr-32 outline-none focus:border-primary ${styles.searchInput}`}
          type="search"
          name="search"
          autoComplete="off"
          placeholder={placeholder}
          // value={inputValue}
          defaultValue={searchVal}
          onClick={handleInputClick}
          // onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          className={`flex items-center gap-2 justify-center absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-4 py-2 rounded ${styles.searchButton}`}
          type="submit"
        >
          <Search size={18} />
          <span className="hidden sm:block">Search</span>
        </button>
      </form>
      <div className="text-sm mt-2 capitalize">
        <strong className="text-gray-900">{count} </strong>{" "}
        {infoText}
      </div>
    </>
  );
}
