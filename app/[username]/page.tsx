// Public User Profile page - displays author/seller profile
import { notFound } from 'next/navigation';
import UserProfilePage from '@/components/pmc-migrated/user-profile/UserProfilePage';
import { getPublicUserProfile } from '@/lib/api/user-profile';

interface Props {
  params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  const profile = getPublicUserProfile(username);

  if (!profile) {
    notFound();
  }

  return <UserProfilePage profile={profile} />;
}
