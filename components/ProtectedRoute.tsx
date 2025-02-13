"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';

interface Props {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (user.role !== allowedRole) {
      router.push(`/${user.role}`);
    }
  }, [user, router, allowedRole]);

  if (!user || user.role !== allowedRole) {
    return null;
  }

  return <>{children}</>;
}