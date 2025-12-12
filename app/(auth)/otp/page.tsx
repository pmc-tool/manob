// MIGRATION: OTP verification page from PMC
import { OTPVerification } from '@/components/pmc-migrated/auth/OTPVerification';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';

export default function OTPPage() {
  return (
    <DashboardLayout maxWidth="md">
      <OTPVerification />
    </DashboardLayout>
  );
}
