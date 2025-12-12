// MIGRATION: Sign-in page from PMC
import { SignInForm } from '@/components/pmc-migrated/auth/SignInForm';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';

export default function SignInPage() {
  return (
    <DashboardLayout maxWidth="md">
      <SignInForm />
    </DashboardLayout>
  );
}
