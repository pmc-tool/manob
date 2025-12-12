// MIGRATION: Reset password page from PMC
import { ResetPassword } from '@/components/pmc-migrated/auth/ResetPassword';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';

export default function ResetPasswordPage() {
  return (
    <DashboardLayout maxWidth="md">
      <ResetPassword />
    </DashboardLayout>
  );
}
