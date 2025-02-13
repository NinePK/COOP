import ProtectedRoute from '@/components/ProtectedRoute';
import StudentWeeklyReportView from '@/components/StudentWeeklyReportView';

export default function WeeklyReportPage() {
  return (
    <ProtectedRoute allowedRole="mentor">
      <StudentWeeklyReportView />
    </ProtectedRoute>
  );
}