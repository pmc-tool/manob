'use client';

import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import {
  Settings,
  UserPlus,
  Target,
  TrendingUp,
  Clock,
} from 'lucide-react';
import {
  useGetUserProfileQuery,
  useGetUserExperienceQuery,
  useGetUserEducationQuery,
  useGetAllNativeLanguagesQuery,
} from '@/state/services/user.service';
import ProfileHeader from './_components/ProfileHeader';
import StatisticsSection from './_components/StatisticsSection';
import MetaInfoSection from './_components/MetaInfoSection';
import SkillsSection from './_components/SkillsSection';
import AboutSection from './_components/AboutSection';
import WorkExperienceSection from './_components/WorkExperienceSection';
import EducationSection from './_components/EducationSection';

function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export default function SellerMyProfilePage() {
  const { data: userProfile, isLoading: profileLoading } = useGetUserProfileQuery();
  const { data: userExperience } = useGetUserExperienceQuery();
  const { data: userEducation } = useGetUserEducationQuery();
  const { data: languageOptions } = useGetAllNativeLanguagesQuery();

  const [userInfo, setUserInfo] = useState<any>({});
  const [experiences, setExperiences] = useState<any[]>([]);
  const [educations, setEducations] = useState<any[]>([]);

  useEffect(() => {
    if (userProfile) {
      setUserInfo(userProfile);
    }
  }, [userProfile]);

  useEffect(() => {
    if (userExperience) {
      setExperiences(userExperience);
    }
  }, [userExperience]);

  useEffect(() => {
    if (userEducation) {
      const mappedEducation = userEducation.map((edu: any) => ({
        id: edu.id,
        start_date: edu.starting_year,
        end_date: edu.passing_year,
        major: edu.major,
        designation: edu.level_of_education,
        company_name: edu.institute,
        description: edu.about_education,
        currently_working: edu.currently_studying,
      }));
      setEducations(mappedEducation);
    }
  }, [userEducation]);

  const statisticsData = [
    {
      icon: <Settings className="w-8 h-8" />,
      label: 'Seller Level',
      value: userInfo?.seller_info?.seller_level || 'N/A',
    },
    {
      icon: <UserPlus className="w-8 h-8" />,
      label: 'Member Since',
      value: formatDate(userInfo?.member_since),
    },
    {
      icon: <Target className="w-8 h-8" />,
      label: 'Last Active',
      value: userInfo?.last_active || 'N/A',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      label: 'Success Rate',
      value: userInfo?.seller_info?.success_rate || 'N/A',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      label: 'Response Time',
      value: userInfo?.seller_info?.response_time || 'N/A',
    },
  ];

  const getAvatarUrl = (profileImage: string | undefined): string => {
    if (!profileImage) return '';
    if (profileImage.includes('https')) return profileImage;
    return `${process.env.NEXT_PUBLIC_S3_BUCKET}/${profileImage}`;
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <section className="p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <h4 className="text-center text-xl font-semibold mb-6">My Profile</h4>

        {/* Profile Header */}
        <ProfileHeader
          id={userInfo?.id || ''}
          firstName={userInfo?.first_name || ''}
          lastName={userInfo?.last_name || ''}
          email={userInfo?.email || ''}
          avatar={getAvatarUrl(userInfo?.profile_image)}
          rating={userInfo?.avg_rating || 0}
          reviewsCount={userInfo?.total_reviews || 0}
          completionPercentage={userInfo?.profile_completion || 0}
        />

        {/* Location & Language + Skills Row */}
        <div className="mb-6 border-b border-gray-200 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetaInfoSection
              city={userInfo?.city || ''}
              zone={userInfo?.zone || ''}
              country={userInfo?.country || ''}
              zipCode={userInfo?.zip_code || ''}
              languages={userInfo?.languages || []}
              languageOptions={languageOptions?.data || []}
            />
            <SkillsSection
              title="Skills"
              skills={userInfo?.skills || []}
            />
          </div>
        </div>

        {/* About Section */}
        <AboutSection
          title="About Me"
          initialText={userInfo?.about_me || ''}
          wordLimit={50}
        />

        {/* Statistics Section */}
        <StatisticsSection
          title="Account Related Information"
          statistics={statisticsData}
        />

        {/* Work Experience Section */}
        <WorkExperienceSection experiences={experiences} />

        {/* Education Section */}
        <EducationSection educations={educations} />
      </div>
    </section>
  );
}
