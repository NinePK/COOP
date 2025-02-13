"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, Home, FileText, LogOut, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/context/AuthContext';
import ict from '../../public/ict.png'
import Image from 'next/image';
import background from '../../public/background3.jpg';

interface FormData {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
}

const Coop01Form = () => {
  const router = useRouter();
  const { logout, addNotification } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    company: '',
    position: '',
    startDate: '',
    endDate: ''
  });

  const companies = [
    { id: 'tech', name: 'บริษัท เทคโนโลยี จำกัด' },
    { id: 'software', name: 'บริษัท ซอฟต์แวร์ไทย จำกัด' }
  ];

  const studentInfo = {
    id: "65012345",
    prefix: "นาย",
    name: "สมชาย ใจดี",
    major: "วิศวกรรมคอมพิวเตอร์",
    faculty: "คณะเทคโนโลยีสารสนเทศและการสื่อสาร"
  };

  useEffect(() => {
    const submitted = localStorage.getItem('coop01_submitted') === 'true';
    setIsSubmitted(submitted);
    if (submitted) {
      const savedData = localStorage.getItem('coop01_data');
      if (savedData) {
        setFormData(JSON.parse(savedData));
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('coop01_submitted', 'true');
    localStorage.setItem('coop01_data', JSON.stringify(formData));
    
    // เพิ่มการแจ้งเตือนสำหรับอาจารย์และพี่เลี้ยง
    addNotification(
      `นิสิต ${studentInfo.name} ส่งแบบฟอร์ม Coop01 แล้ว`,
      ['teacher', 'mentor']
    );
    
    router.push('/student');
  };

  const handleRequestEdit = () => {
    alert('ส่งคำขอแก้ไขไปยังอาจารย์แล้ว');
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">

      <nav className="bg-white border-b fixed w-full top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Image
                src={ict}
                alt="Logo"
                className="h-10 w-auto"
              />
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
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-center text-purple-800 mb-8">
          ใบรายงานตัวสำหรับฝึกงาน (Coop01)
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Student Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-purple-800">ข้อมูลนิสิต</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>รหัสนิสิต</Label>
                    <Input value="65012345" disabled />
                  </div>
                  <div>
                    <Label>หลักสูตร</Label>
                    <Input value="วิศวกรรมศาสตร์บัณฑิต" disabled />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ชื่อ-สกุล (ภาษาไทย)</Label>
                    <Input value="สมชาย ใจดี" disabled />
                  </div>
                  <div>
                    <Label>ชื่อ-สกุล (ภาษาอังกฤษ)</Label>
                    <Input value="Somchai Jaidee" disabled />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>สาขา</Label>
                    <Input value="วิศวกรรมคอมพิวเตอร์" disabled />
                  </div>
                  <div>
                    <Label>คณะ</Label>
                    <Input value="คณะเทคโนโลยีสารสนเทศและการสื่อสาร" disabled />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Information Card */}
            <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-purple-800">ข้อมูลสถานประกอบการ</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div>
                    <Label>ชื่อสถานประกอบการ</Label>
                    <Select 
                      value={formData.company}
                      onValueChange={(value) => handleChange('company', value)}
                      disabled={isSubmitted}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกสถานประกอบการ" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>ตำแหน่ง</Label>
                    <Select 
                      value={formData.position}
                      onValueChange={(value) => handleChange('position', value)}
                      disabled={isSubmitted}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกตำแหน่ง" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="developer">นักพัฒนาซอฟต์แวร์</SelectItem>
                        <SelectItem value="network">วิศวกรเครือข่าย</SelectItem>
                        <SelectItem value="data">นักวิเคราะห์ข้อมูล</SelectItem>
                        <SelectItem value="system">วิศวกรระบบ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>วันที่เริ่มปฏิบัติงาน</Label>
                      <Input 
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleChange('startDate', e.target.value)}
                        disabled={isSubmitted}
                      />
                    </div>
                    <div>
                      <Label>วันที่สิ้นสุดการปฏิบัติงาน</Label>
                      <Input 
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleChange('endDate', e.target.value)}
                        disabled={isSubmitted}
                      />
                    </div>
                  </div>

                  {isSubmitted ? (
                    <Button 
                      type="button"
                      onClick={handleRequestEdit}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      ร้องขอการแก้ไขข้อมูล
                    </Button>
                  ) : (
                    <Button 
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      ส่งข้อมูล
                    </Button>
                  )}
                </CardContent>
              </Card>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Coop01Form;