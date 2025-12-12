// MIGRATION: Sign-up page from PMC
import { SignUpForm } from '@/components/pmc-migrated/auth/SignUpForm';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';

export default function SignUpPage() {
  return (
    <DashboardLayout maxWidth="md">
      <SignUpForm />
    </DashboardLayout>
  );
}
