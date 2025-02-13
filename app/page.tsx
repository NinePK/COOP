"use client"
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ict from '../public/ict.png';
import background from '../public/background3.jpg'; // Import the background image
import Image from 'next/image';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(username, password);
    if (!success) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={background}
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>

      <Card className="z-10 p-8 mx-auto w-96">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src={ict} alt="Logo" width={100} height={100} />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-4 text-center">
          ระบบจัดการและติดตามการฝึกงาน มหาวิทยาลัยพะเยา
        </h1>

        {/* Error message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-1">
              ชื่อผู้ใช้
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-1">
              รหัสผ่าน
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            เข้าสู่ระบบ
          </Button>
        </form>

        {/* Footer Text */}
        <p className="text-center text-sm mt-4">
          เว็บไซต์นี้ปฏิบัติตามกฎหมาย PDPA และไม่มีการบันทึกรหัสผ่านในการเข้าใช้งาน
        </p>
      </Card>
    </div>
  );
}