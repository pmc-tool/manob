// MIGRATION: Password recovery page from PMC
import { PasswordRecovery } from '@/components/pmc-migrated/auth/PasswordRecovery';
import { DashboardLayout } from '@/components/pmc-migrated/shared/DashboardLayout';

export default function RecoveryPage() {
  return (
    <DashboardLayout maxWidth="md">
      <PasswordRecovery />
    </DashboardLayout>
  );
}
