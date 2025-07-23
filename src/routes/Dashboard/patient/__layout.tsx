import DashboardLayout from '@/components/layout/DashboardLayout';
import { Outlet } from '@tanstack/react-router';

export default function PatientDashboardLayout() {
  return <DashboardLayout><Outlet /></DashboardLayout>;
} 