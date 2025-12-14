// MIGRATION: My Profile page from manob.ai
'use client';

import { useState } from 'react';
import { ProfileHeaderSection } from '@/components/pmc-migrated/profile/profile-header';
import { ProfileAboutSection } from '@/components/pmc-migrated/profile/profile-about';
import { MetaInfoSection, Location, Language } from '@/components/pmc-migrated/profile/meta-info';
import { SkillsSection } from '@/components/pmc-migrated/profile/skills-section';
// MOCK: Using mock data until real API is connected
import {
  mockUserProfile,
  mockLanguageOptions,
  searchSkills,
} from '@/lib/mocks/profile.mock';
import styles from './page.module.css';

export default function MyProfilePage() {
  // MOCK: Using mock profile data - will be replaced with API call
  const [userProfile, setUserProfile] = useState(mockUserProfile);

  const handleUpdateName = (firstName: string, lastName: string) => {
    // MOCK: Update local state - will call API in production
    setUserProfile((prev) => ({
      ...prev,
      first_name: firstName,
      last_name: lastName,
    }));
    console.log('Name updated:', firstName, lastName);
  };

  const handleUpdateImage = (file: File) => {
    // MOCK: Preview image - will upload to API in production
    const reader = new FileReader();
    reader.onloadend = () => {
      setUserProfile((prev) => ({
        ...prev,
        profile_image: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
    console.log('Image updated:', file.name);
  };

  const handleUpdateAbout = (text: string) => {
    setUserProfile((prev) => ({
      ...prev,
      about_me: text,
    }));
    console.log('About updated:', text);
  };

  const handleUpdateLocation = (location: {
    city: string;
    zone: string;
    country: string;
    zip_code: string;
  }) => {
    setUserProfile((prev) => ({
      ...prev,
      ...location,
    }));
    console.log('Location updated:', location);
  };

  const handleUpdateLanguages = (
    languages: Array<{ language_id: number; language_name: string; level: string }>
  ) => {
    setUserProfile((prev) => ({
      ...prev,
      languages,
    }));
    console.log('Languages updated:', languages);
  };

  const handleUpdateSkills = (
    skills: Array<{ skill_id: number; skill_name: string }>
  ) => {
    setUserProfile((prev) => ({
      ...prev,
      skills,
    }));
    console.log('Skills updated:', skills);
  };

  const handleSearchSkills = async (query: string) => {
    // MOCK: Search from local data - will call API in production
    return searchSkills(query);
  };

  return (
    <div className={styles.container}>
      <h4 className={styles.pageTitle}>My Profile</h4>

      <ProfileHeaderSection
        firstName={userProfile.first_name}
        lastName={userProfile.last_name}
        email={userProfile.email}
        avatar={userProfile.profile_image}
        rating={userProfile.avg_rating}
        reviewsCount={userProfile.total_reviews}
        completionPercentage={userProfile.profile_completion}
        badges={userProfile.badges}
        onUpdateName={handleUpdateName}
        onUpdateImage={handleUpdateImage}
      />

      <div className={styles.metaSection}>
        <div className={styles.metaGrid}>
          <MetaInfoSection title="Location & Language">
            <Location
              initialCity={userProfile.city}
              initialZone={userProfile.zone}
              initialCountry={userProfile.country}
              initialZipCode={userProfile.zip_code}
              onSave={handleUpdateLocation}
            />
            <Language
              title="Languages"
              languages={userProfile.languages}
              languageOptions={mockLanguageOptions}
              onSave={handleUpdateLanguages}
            />
          </MetaInfoSection>
        </div>
      </div>

      <ProfileAboutSection
        title="About Me"
        initialText={userProfile.about_me}
        wordLimit={50}
        tooltipTitle="Edit About Me"
        onSave={handleUpdateAbout}
      />

      <SkillsSection
        title="Skills"
        skills={userProfile.skills}
        onSearch={handleSearchSkills}
        onSave={handleUpdateSkills}
      />

      {/* Reviews section can be added later */}
      <div className={styles.reviewsSection}>
        <h5 className={styles.sectionTitle}>Reviews ({userProfile.total_reviews})</h5>
        <p className={styles.reviewsPlaceholder}>
          Reviews section will be displayed here once connected to the API.
        </p>
      </div>
    </div>
  );
}
