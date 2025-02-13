// AuthContext.tsx
"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserRole } from '@/types/auth';

// เพิ่ม interface สำหรับการแจ้งเตือน
interface Notification {
  id: number;
  message: string;
  date: string;
  read: boolean;
  recipientRoles: UserRole[];
  
}








interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  addNotification: (message: string, recipientRoles: UserRole[]) => void;
  getNotifications: () => Notification[];
  markNotificationAsRead: (id: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const addNotification = (message: string, recipientRoles: UserRole[]) => {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const newNotification: Notification = {
      id: Date.now(),
      message,
      date: new Date().toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      read: false,
      recipientRoles
    };
    
    notifications.push(newNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
  };

  const getNotifications = () => {
    if (!user) return [];
    
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    return notifications.filter((notification: Notification) => 
      notification.recipientRoles.includes(user.role)
    );
  };

  const markNotificationAsRead = (id: number) => {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updatedNotifications = notifications.map((notification: Notification) => {
      if (notification.id === id) {
        return { ...notification, read: true };
      }
      return notification;
    });
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  // ตรวจสอบสถานะการ login เมื่อโหลดแอพ
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          const userData = JSON.parse(storedUser);
          if (userData.role) {
            router.push(`/${userData.role}`);
          }
        }
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        localStorage.removeItem('user');
      }
      setIsLoading(false);
    };

    initAuth();
  }, [router]);

  const login = async (username: string, password: string) => {
    if (password !== '12345') {
      return false;
    }

    let role: UserRole | null = null;
    let redirectPath = '';

    switch (username) {
      case '65012345':
        role = 'student';
        redirectPath = '/student';
        break;
      case 'sompong@gmail.com':
        role = 'teacher';
        redirectPath = '/teacher';
        break;
      case 'technology.co':
        role = 'mentor';
        redirectPath = '/mentor';
        break;
      default:
        return false;
    }

    const newUser = { username, role };
    
    try {
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      router.push(redirectPath);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isLoading,
      addNotification,
      getNotifications,
      markNotificationAsRead
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};