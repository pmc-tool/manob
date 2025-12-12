// MIGRATION: Location component from PackMyCode
'use client';

import { useState, useEffect } from 'react';
import { MapPin, Pencil } from 'lucide-react';
import { Modal } from '@/components/pmc-migrated/shared/modal';
import styles from './MetaInfoSection.module.css';

interface LocationProps {
  initialCity: string;
  initialZone: string;
  initialCountry: string;
  initialZipCode: string;
  modifyButton?: boolean;
  onSave?: (location: { city: string; zone: string; country: string; zip_code: string }) => void;
}

export default function Location({
  initialCity,
  initialZone,
  initialCountry,
  initialZipCode,
  modifyButton = true,
  onSave,
}: LocationProps) {
  const [showModal, setShowModal] = useState(false);
  const [city, setCity] = useState(initialCity);
  const [zone, setZone] = useState(initialZone);
  const [country, setCountry] = useState(initialCountry);
  const [zipCode, setZipCode] = useState(initialZipCode);

  useEffect(() => {
    setCity(initialCity);
    setZone(initialZone);
    setCountry(initialCountry);
    setZipCode(initialZipCode);
  }, [initialCity, initialZone, initialCountry, initialZipCode]);

  const handleSave = () => {
    onSave?.({ city, zone, country, zip_code: zipCode });
    setShowModal(false);
  };

  const hasLocation = initialCity || initialZone || initialCountry || initialZipCode;

  return (
    <>
      <div className={styles.item}>
        <div className={styles.icon}>
          <MapPin size={24} strokeWidth={1.5} />
        </div>
        <div className={styles.content}>
          <div className={styles.itemHeader}>
            <h6 className={styles.itemTitle}>Location</h6>
            {modifyButton && (
              <button
                type="button"
                className={styles.editButton}
                onClick={() => setShowModal(true)}
                title="Edit"
              >
                <Pencil size={16} />
              </button>
            )}
          </div>
          {hasLocation ? (
            <span className={styles.itemText}>
              {[initialCity, initialZone, initialCountry, initialZipCode]
                .filter(Boolean)
                .join(', ')}
            </span>
          ) : (
            <span className={styles.emptyText}>No location added</span>
          )}
        </div>
      </div>

      <Modal
        id="locationModal"
        title="Edit Location"
        saveButtonText="Save Changes"
        onSave={handleSave}
        show={showModal}
        onClose={() => setShowModal(false)}
        backdropStatic={true}
      >
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>City</label>
            <input
              type="text"
              className={styles.input}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Zone</label>
            <input
              type="text"
              className={styles.input}
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              placeholder="Enter zone"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Country</label>
            <input
              type="text"
              className={styles.input}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Enter country"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Zip Code</label>
            <input
              type="text"
              className={styles.input}
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter zip code"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
