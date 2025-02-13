"use client"
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, Home, FileText, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ict from '../../public/ict.png'
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import background from '../../public/background3.jpg';
interface FormData {
    weekNumber: string;
    startDate: string;
    endDate: string;
    status: string;
    workDescription: string;
    problems: string;
    solutions: string;
    relatedCourses: string;
    experience: string;
    suggestions: string;
    isSubmitted?: boolean;
  }

  const WeeklyForm = () => {
    const router = useRouter();
    const companyData = JSON.parse(localStorage.getItem('coop01_data') || '{}');
    const [currentWeek, setCurrentWeek] = useState<string>('1');
    const [submittedWeeks, setSubmittedWeeks] = useState<string[]>([]);
    const [formData, setFormData] = useState<FormData>({
      weekNumber: '1',
      startDate: '',
      endDate: '',
      status: '',
      workDescription: '',
      problems: '',
      solutions: '',
      relatedCourses: '',
      experience: '',
      suggestions: '',
      isSubmitted: false
    });

    useEffect(() => {
        const weeklyData = JSON.parse(localStorage.getItem('weekly_reports') || '{}');
        const submitted = Object.keys(weeklyData).sort((a, b) => Number(a) - Number(b));
        setSubmittedWeeks(submitted);
    
        // หาสัปดาห์ถัดไปที่ควรกรอก
        const nextWeek = String(submitted.length > 0 ? Math.max(...submitted.map(Number)) + 1 : 1);
        setCurrentWeek(nextWeek);
        setFormData(prev => ({
          ...prev,
          weekNumber: nextWeek,
          isSubmitted: false
        }));
      }, []);
    
      const studentInfo = {
        id: "65012345",
        name: "สมชาย ใจดี",
        company: companyData.company === 'tech' ? 'บริษัท เทคโนโลยี จำกัด' : 'บริษัท ซอฟต์แวร์ไทย จำกัด',
        position: companyData.position || 'นักพัฒนาซอฟต์แวร์'
      };
    
      // สร้าง array ของสัปดาห์ที่ส่งแล้วสำหรับดูย้อนหลัง
      const availableWeeks = submittedWeeks.map(week => ({
        value: week,
        label: `สัปดาห์ที่ ${week}`
      }));
    
      const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const weeklyData = JSON.parse(localStorage.getItem('weekly_reports') || '{}');
        
        // เพิ่มสถานะ submitted
        const submittedData = {
          ...formData,
          isSubmitted: true
        };
        
        weeklyData[formData.weekNumber] = submittedData;
        localStorage.setItem('weekly_reports', JSON.stringify(weeklyData));
        router.push('/student');
      };
    
      const handleWeekChange = (week: string) => {
        const weeklyData = JSON.parse(localStorage.getItem('weekly_reports') || '{}');
        if (weeklyData[week]) {
          setFormData(weeklyData[week]);
        }
      };
    
      const handleInputChange = (field: keyof FormData, value: string) => {
        if (!formData.isSubmitted) {
          setFormData(prev => ({
            ...prev,
            [field]: value
          }));
        }
      };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
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
              
              {/* ... Notification and Profile Dropdowns ... */}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold text-center text-purple-800 mb-8">
            แบบบันทึกงานรายสัปดาห์
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ข้อมูลพื้นฐาน */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-purple-800">ข้อมูลพื้นฐาน</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ชื่อนิสิต</Label>
                    <Input value={studentInfo.name} disabled />
                  </div>
                  <div>
                    <Label>สถานประกอบการ</Label>
                    <Input value={studentInfo.company} disabled />
                  </div>
                </div>
                <div>
                  <Label>ตำแหน่งงาน</Label>
                  <Input value={studentInfo.position} disabled />
                </div>
              </CardContent>
            </Card>

            {/* ข้อมูลสัปดาห์ */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-purple-800">ข้อมูลสัปดาห์</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                {submittedWeeks.length > 0 && (
                  <div>
                    <Label>ดูข้อมูลย้อนหลัง</Label>
                    <Select onValueChange={handleWeekChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกสัปดาห์" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableWeeks.map((week) => (
                          <SelectItem key={week.value} value={week.value}>
                            {week.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>สัปดาห์ที่</Label>
                    <Input value={formData.weekNumber} disabled />
                  </div>
                  <div>
                    <Label>วันเริ่มต้น</Label>
                    <Input 
                      type="date" 
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      disabled={formData.isSubmitted}
                    />
                  </div>
                  <div>
                    <Label>วันสิ้นสุด</Label>
                    <Input 
                      type="date" 
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      disabled={formData.isSubmitted}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status evaluation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-purple-800">การประเมินสถานะปัญหา</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                  disabled={formData.isSubmitted}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="good" />
                    <Label htmlFor="good">ดี</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="normal" />
                    <Label htmlFor="normal">ปกติ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="concerned" id="concerned" />
                    <Label htmlFor="concerned">ไม่สบายใจ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="needHelp" id="needHelp" />
                    <Label htmlFor="needHelp">ต้องการคำปรึกษา</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Work Content */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-purple-800">เนื้อหาการปฏิบัติงาน</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div>
                  <Label>งานที่ปฏิบัติ</Label>
                  <Textarea 
                    value={formData.workDescription}
                    onChange={(e) => handleInputChange('workDescription', e.target.value)}
                    placeholder="รายละเอียดงานที่ทำ"
                    disabled={formData.isSubmitted}
                  />
                </div>

                <div>
                  <Label>ปัญหาที่พบในการปฏิบัติงาน</Label>
                  <Textarea 
                    value={formData.problems}
                    onChange={(e) => handleInputChange('problems', e.target.value)}
                    placeholder="หากมีปัญหาให้ระบุ"
                    disabled={formData.isSubmitted}
                  />
                </div>

                <div>
                  <Label>การแก้ปัญหา</Label>
                  <Textarea 
                    value={formData.solutions}
                    onChange={(e) => handleInputChange('solutions', e.target.value)}
                    placeholder="แนวทางการแก้ไขปัญหาที่พบ"
                    disabled={formData.isSubmitted}
                  />
                </div>

                <div>
                  <Label>รายวิชาที่นำมาใช้แก้ปัญหา</Label>
                  <Input 
                    value={formData.relatedCourses}
                    onChange={(e) => handleInputChange('relatedCourses', e.target.value)}
                    placeholder="ระบุรายวิชาที่ช่วยแก้ปัญหาได้"
                    disabled={formData.isSubmitted}
                  />
                </div>

                <div>
                  <Label>ประสบการณ์ / ความรู้ที่ได้รับ</Label>
                  <Textarea 
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="สรุปสิ่งที่ได้เรียนรู้จากงาน"
                    disabled={formData.isSubmitted}
                  />
                </div>

                <div>
                  <Label>ข้อเสนอแนะ</Label>
                  <Textarea 
                    value={formData.suggestions}
                    onChange={(e) => handleInputChange('suggestions', e.target.value)}
                    placeholder="ข้อเสนอแนะเพิ่มเติมเกี่ยวกับงานหรือสภาพแวดล้อม"
                    disabled={formData.isSubmitted}
                  />
                </div>

                {!formData.isSubmitted && (
                  <Button 
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    บันทึกข้อมูล
                  </Button>
                )}
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};
    
    export default WeeklyForm;