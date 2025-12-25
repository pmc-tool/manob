// PageHeaderSearch - migrated from PMC - converted to Tailwind CSS
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
}

export default function PageHeaderSearch({
  title,
  pageTitle = "",
  description,
  placeholder,
  count,
  infoText,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const searchQuery = useSearchParams();
  const searchQueryValue: string | null = searchQuery.get("q");
  const handleInputClick = () => {
    setShowModal(true);
    (window as any).analytics?.goal?.("breadcum-search?ref=page_header");
  };
  useEffect(() => {
    setSearchVal(searchQueryValue || "");
  }, [searchQueryValue, searchQuery]);
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {title && <h4 className="mb-0 text-xl capitalize">{title}</h4>}
      {description && <p className="leading-normal capitalize">{description}</p>}
      <form className="relative max-w-[600px]">
        <input
          className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-32 outline-none text-[15px] transition-[border-color] duration-200 focus:border-primary focus:shadow-[0_0_0_2px_rgba(29,191,115,0.1)]"
          type="search"
          name="search"
          autoComplete="off"
          placeholder={placeholder}
          defaultValue={searchVal}
          onClick={handleInputClick}
        />
        <button
          className="flex items-center gap-2 justify-center absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-4 py-2 rounded font-medium text-sm transition-colors hover:opacity-90"
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
