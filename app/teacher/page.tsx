import ProtectedRoute from '@/components/ProtectedRoute';
import TeacherPage from '@/components/TeacherPage'; // Your existing teacher component

export default function Teacher() {
  return (
    <ProtectedRoute allowedRole="teacher">
      <TeacherPage />
    </ProtectedRoute>
  );
}