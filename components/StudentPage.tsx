"use client";
import React, { useEffect, useState } from 'react';
import { Bell, Home, FileText, LogOut, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import background from '../public/background3.jpg';
const student = () => {
  const { logout } = useAuth();
  const [isCoop01Submitted, setIsCoop01Submitted] = useState(false);

  useEffect(() => {
    // เช็คสถานะการส่งฟอร์มจาก localStorage
    const submitted = localStorage.getItem('coop01_submitted') === 'true';
    setIsCoop01Submitted(submitted);
  }, []);

  const studentInfo = {
    id: "65012345",
    prefix: "นาย",
    name: "สมชาย ใจดี",
    major: "วิศวกรรมคอมพิวเตอร์",
    faculty: "คณะเทคโนโลยีสารสนเทศและการสื่อสาร"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b fixed w-full top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-purple-700">
                Internship Management and Tracking System
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/student">
                <Button variant="ghost" size="icon">
                  <Home className="h-5 w-5" />
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end">
                  <div className="p-2">
                    <h3 className="text-lg font-semibold mb-2">การแจ้งเตือน</h3>
                    <DropdownMenuItem>
                      <div className="flex flex-col gap-1">
                        <span>แบบฟอร์มได้รับการยืนยันแล้ว</span>
                        <span className="text-sm text-muted-foreground">24 ม.ค. 2567</span>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium">{studentInfo.name}</span>
                      <span className="text-xs text-gray-500">{studentInfo.id}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">{studentInfo.name}</span>
                      <span className="text-xs text-gray-500">{studentInfo.major}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>ออกจากระบบ</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-purple-800">ข้อมูลนิสิต</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <p className="text-sm text-muted-foreground mb-1">รหัสนิสิต</p>
                  <p className="font-medium">65012345</p>
                </div>
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <p className="text-sm text-muted-foreground mb-1">คำนำหน้า</p>
                  <p className="font-medium">นาย</p>
                </div>
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <p className="text-sm text-muted-foreground mb-1">ชื่อ-นามสกุล</p>
                  <p className="font-medium">สมชาย ใจดี</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <p className="text-sm text-muted-foreground mb-1">สาขาวิชา</p>
                  <p className="font-medium">วิศวกรรมคอมพิวเตอร์</p>
                </div>
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <p className="text-sm text-muted-foreground mb-1">คณะ</p>
                  <p className="font-medium">คณะเทคโนโลยีสารสนเทศและการสื่อสาร</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Forms Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-purple-800">แบบฟอร์ม</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            {isCoop01Submitted ? (
                <>
                  <Link href="/coop01" className="block">
                    <Button
                      variant="outline"
                      className="w-full justify-between gap-4 h-auto py-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <FileText className="text-purple-600 h-5 w-5" />
                        </div>
                        <div className="flex flex-col items-start">
                          <span>ใบรายงานตัวนิสิต (Coop01)</span>
                          <span className="text-sm text-green-600">ส่งข้อมูลแล้ว - คลิกเพื่อดูข้อมูล</span>
                        </div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </Button>
                  </Link>
                  <Link href="/coop04" className="block">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-4 h-auto py-4 hover:bg-purple-50 hover:border-purple-200"
                    >
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <FileText className="text-purple-600 h-5 w-5" />
                      </div>
                      <span>รายละเอียดที่พัก (Coop04)</span>
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/coop01" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-4 h-auto py-4 hover:bg-purple-50 hover:border-purple-200"
                  >
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FileText className="text-purple-600 h-5 w-5" />
                    </div>
                    <span>ใบรายงานตัวนิสิต (Coop01)</span>
                  </Button>
                </Link>
              )}

              <Link href="/weekly" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-4 h-auto py-4 hover:bg-purple-50 hover:border-purple-200"
                >
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText className="text-purple-600 h-5 w-5" />
                  </div>
                  <span>แบบบันทึกงานรายสัปดาห์</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default student;