import ProtectedRoute from '@/components/ProtectedRoute';
import Coop05Form from '@/components/Coop05Form';

export default function Coop05Page() {
  return (
    <ProtectedRoute allowedRole="mentor">
      <Coop05Form />
    </ProtectedRoute>
  );
}