// MIGRATION: PageHeaderSearch component from manob.ai
// Simplified version with CSS Modules
'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import { SearchModal } from './SearchModal';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  title?: string;
  description?: string;
  placeholder?: string;
  count?: string;
  infoText?: string;
}

export default function SearchBar({
  title,
  description,
  placeholder = 'Search products...',
  count = '10,000+',
  infoText = 'products available',
}: SearchBarProps) {
  const [showModal, setShowModal] = useState(false);

  const handleInputClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {title && <h4 className={styles.title}>{title}</h4>}
      {description && <p className={styles.description}>{description}</p>}

      <div className={styles.searchBox}>
        <input
          className={styles.searchInput}
          type="search"
          name="search"
          autoComplete="off"
          placeholder={placeholder}
          onClick={handleInputClick}
          readOnly
        />
        <button className={styles.searchButton} type="button" onClick={handleInputClick}>
          <Search size={18} />
          <span className={styles.searchButtonText}>Search</span>
        </button>
      </div>

      <div className={styles.infoText}>
        <strong>{count}</strong> {infoText}
      </div>

      {showModal && <SearchModal onClose={handleCloseModal} />}
    </>
  );
}
