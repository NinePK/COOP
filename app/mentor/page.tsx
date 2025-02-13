import ProtectedRoute from '@/components/ProtectedRoute';
import MentorPage from '@/components/MentorPage'; // Your existing mentor component

export default function Mentor() {
  return (
    <ProtectedRoute allowedRole="mentor">
      <MentorPage />
    </ProtectedRoute>
  );
}