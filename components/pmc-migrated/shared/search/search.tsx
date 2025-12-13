// PageHeaderSearch - migrated from PMC
"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

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
      {title && <h4 className="mb-0 fz21 text-capitalize">{title}</h4>}
      {description && <p className="lh-base text-capitalize">{description}</p>}
      <form className="search-box position-relative">
        <input
          className="form-control"
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
          className="align-items-center bdrs4 btn-search btn-thm2 d-flex gap-2 justify-content-center position-absolute top-50 translate-middle-y ud-btn"
          type="submit"
        >
          <Search size={18} />
          <span className="d-none d-sm-block">Search</span>
        </button>
      </form>
      <div className="fz14 mt-2 text-capitalize">
        <strong className="text-dark">{count} </strong>{" "}
        {infoText}
      </div>
    </>
  );
}
