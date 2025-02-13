import ProtectedRoute from '@/components/ProtectedRoute';
import StudentPage from '@/components/StudentPage'; // Your existing student component

export default function Study() {
  return (
    <ProtectedRoute allowedRole="student">
      <StudentPage />
    </ProtectedRoute>
  );
}