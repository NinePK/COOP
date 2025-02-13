"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Home, FileText, CheckCircle2, LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import background from '../public/background3.jpg';
import student from './StudentPage';
interface Notification {
  id: number;
  message: string;
  date: string;
  read: boolean;
  recipientRoles: UserRole[];
  documentType?: string;
  studentId?: string;
  studentName?: string;
}
interface Coop07FormData {
  titleThai: string;
  titleEng: string;
  reportDetails: string;
}

interface WeeklyReportData {
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
}
interface Student {
  id: number;
  name: string;
  position: string;
  company: string;
  supervisor: string;
  studentId: string;
  studentDocuments: Array<{
    name: string;
    status: string;
  }>;
  companyDocuments: Array<{
    name: string;
    status: () => "completed" | "pending";
  }>;
  weeklyReports: Array<{
    week: number;
    status: string;
  }>;
}

interface Supervisor {
  name: string;
  company: string;
  email: string;
}

interface Coop08Evaluation {
  moralityAndEthics: {
    honesty: number;
    respectRules: number;
    sacrifice: number;
    professionalEthics: number;
  };
  knowledge: {
    professionalKnowledge: number;
    workUnderstanding: number;
    achievementCapability: number;
    knowledgeApplication: number;
    taskEfficiency: number;
    continuousLearning: number;
  };
  intellectualSkills: {
    planning: number;
    dataCollection: number;
    problemSolving: number;
    creativity: number;
    presentation: number;
  };
  interpersonalSkills: {
    adaptation: number;
    communication: number;
    teamwork: number;
    leadership: number;
    openMinded: number;
  };
  analyticalSkills: {
    numericalAnalysis: number;
    thaiCommunication: number;
    englishCommunication: number;
    computerSkills: number;
  };
  aestheticAppreciation: {
    culturalAppreciation: number;
  };
  healthPromotion: {
    goodHealth: number;
    appropriateManners: number;
  };
  additionalComments?: string;
}

interface Coop08FormData {
  studentId: string;
  studentName: string;
  program: string;
  major: string;
  faculty: string;
  company: string;
  evaluatorName: string;
  evaluation: Coop08Evaluation;
}
const weeklyReportData: Record<string, Record<string, WeeklyReportData>> = {
  "1": {
    "1": {
      weekNumber: "1",
      startDate: "2024-06-01",
      endDate: "2024-06-07",
      status: "good",
      workDescription: "ศึกษาระบบและโครงสร้างของโปรเจค Frontend ที่ได้รับมอบหมาย เรียนรู้การใช้งาน Git และ CI/CD pipeline ของทีม",
      problems: "การทำความเข้าใจโครงสร้างโค้ดที่ซับซ้อนและมีการใช้เทคโนโลยีหลายตัวร่วมกัน",
      solutions: "ปรึกษาพี่เลี้ยงและศึกษาเพิ่มเติมจากเอกสารประกอบ รวมถึงทดลองทำโปรเจคเล็กๆ เพื่อทำความเข้าใจ",
      relatedCourses: "การพัฒนาโปรแกรมประยุกต์บนเว็บ, การพัฒนาซอฟต์แวร์เชิงวัตถุ",
      experience: "ได้เรียนรู้การทำงานในระบบจริง การใช้ Git ในการทำงานร่วมกับทีม และการจัดการโค้ดที่มีความซับซ้อน",
      suggestions: "ควรมีการจัดทำเอกสารประกอบการพัฒนาให้ครบถ้วนและเป็นปัจจุบัน"
    },
    "2": {
      weekNumber: "2",
      startDate: "2024-06-08",
      endDate: "2024-06-14",
      status: "good",
      workDescription: "พัฒนาฟีเจอร์การแสดงผลข้อมูลผู้ใช้งานและระบบการแจ้งเตือน ใช้ React และ TypeScript",
      problems: "การจัดการ state ที่ซับซ้อนและการอัพเดทข้อมูลแบบ real-time",
      solutions: "ศึกษาการใช้ Redux และ WebSocket เพิ่มเติม และประยุกต์ใช้กับโปรเจค",
      relatedCourses: "การพัฒนาซอฟต์แวร์เชิงวัตถุ, ระบบฐานข้อมูล",
      experience: "เรียนรู้การจัดการ state ในแอพพลิเคชันขนาดใหญ่และการทำงานกับข้อมูลแบบ real-time",
      suggestions: "ควรมีการทำ code review อย่างสม่ำเสมอเพื่อพัฒนาคุณภาพของโค้ด"
    }
  }
};
const initialCoop07Data: Record<string, Coop07FormData> = {
  "1": {
    titleThai: "การพัฒนาระบบจัดการข้อมูลการฝึกงานสำหรับมหาวิทยาลัยพะเยา",
    titleEng: "Development of Internship Management System for University of Phayao",
    reportDetails: "โครงงานนี้มีวัตถุประสงค์เพื่อพัฒนาระบบจัดการข้อมูลการฝึกงานที่ช่วยอำนวยความสะดวกให้กับนิสิต อาจารย์ และพนักงานที่ปรึกษา ระบบประกอบด้วยส่วนการจัดการเอกสาร การติดตามความคืบหน้า และการประเมินผลการฝึกงาน โดยใช้เทคโนโลยี Next.js, TypeScript และ Tailwind CSS ในการพัฒนา"
  },
  "4": {
    titleThai: "การออกแบบส่วนติดต่อผู้ใช้สำหรับระบบจัดการทรัพยากรบุคคล",
    titleEng: "User Interface Design for Human Resource Management System",
    reportDetails: "โครงงานนี้มุ่งเน้นการพัฒนาส่วนติดต่อผู้ใช้ที่ทันสมัยและใช้งานง่ายสำหรับระบบจัดการทรัพยากรบุคคล โดยใช้หลักการ UX/UI Design และเทคโนโลยี React, Tailwind CSS เพื่อสร้างประสบการณ์ผู้ใช้ที่มีประสิทธิภาพและสวยงาม"
  },
  "5": {
    titleThai: "การพัฒนาระบบนำเข้าและส่งออกข้อมูลสำหรับองค์กร",
    titleEng: "Development of Data Import and Export System for Enterprises",
    reportDetails: "โครงงานนี้ออกแบบระบบนำเข้าและส่งออกข้อมูลที่มีประสิทธิภาพ รองรับไฟล์ Excel และ CSV โดยใช้เทคโนโลยี JavaScript, React และ Library สำหรับจัดการไฟล์ เพื่อช่วยลดเวลาและความซับซ้อนในการจัดการข้อมูลขององค์กร"
  }
};
const Mentor = () => {
  const router = useRouter();
  const { logout, getNotifications, markNotificationAsRead } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [submittedDocuments, setSubmittedDocuments] = useState<{ [key: string]: { [key: string]: boolean } }>({});

  const [showWeeklyModal, setShowWeeklyModal] = useState(false);
  const [selectedWeeklyReport, setSelectedWeeklyReport] = useState<WeeklyReportData | null>(null);

  const handleWeeklyReportClick = (studentId: number, week: number) => {
    const studentReports = weeklyReportData[studentId.toString()];
    if (studentReports && studentReports[week.toString()]) {
      setSelectedStudent(studentId.toString()); // เพิ่มบรรทัดนี้
      setSelectedWeeklyReport(studentReports[week.toString()]);
      setShowWeeklyModal(true);
    }
  };
  const [submittedWeeklyReports, setSubmittedWeeklyReports] = useState<{ [key: string]: { [key: string]: boolean } }>({});
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [showCoop07Modal, setShowCoop07Modal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [coop07FormData, setCoop07FormData] = useState<Coop07FormData>({
    titleThai: '',
    titleEng: '',
    reportDetails: ''
  });
  useEffect(() => {
    Object.entries(initialCoop07Data).forEach(([studentId, data]) => {
      localStorage.setItem(`coop07_${studentId}`, JSON.stringify(data));
    });
  }, []);


  const handleCoop07Click = (studentId: number) => {
    setSelectedStudentId(studentId.toString());

    // Always use predefined data from localStorage
    const existingData = localStorage.getItem(`coop07_${studentId}`);
    if (existingData) {
      setCoop07FormData(JSON.parse(existingData));
    }

    setShowCoop07Modal(true);
  };

  // Method to handle Coop07 form input changes
  const handleCoop07InputChange = (field: keyof Coop07FormData, value: string) => {
    setCoop07FormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Method to submit Coop07 form
  const handleCoop07Submit = () => {
    if (selectedStudentId) {
      // Save to localStorage
      localStorage.setItem(`coop07_${selectedStudentId}`, JSON.stringify(coop07FormData));

      // Add notification
      const studentName = students.find(s => s.id.toString() === selectedStudentId)?.name || 'นิสิต';
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.push({
        id: Date.now(),
        message: `${studentName} ส่ง Coop07 โครงร่างรายงานการปฏิบัติงาน`,
        date: new Date().toLocaleDateString('th-TH', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        read: false,
        recipientRoles: ['teacher']
      });
      localStorage.setItem('notifications', JSON.stringify(notifications));

      // Close modal
      setShowCoop07Modal(false);
    }
  };

  const handleWeeklyReportApprove = () => {
    if (selectedWeeklyReport && selectedStudent) {
      // บันทึกสถานะการยืนยันลง localStorage
      const weeklySubmissions = JSON.parse(localStorage.getItem('weekly_submissions') || '{}');
      if (!weeklySubmissions[selectedStudent]) {
        weeklySubmissions[selectedStudent] = {};
      }
      weeklySubmissions[selectedStudent][selectedWeeklyReport.weekNumber] = true;
      localStorage.setItem('weekly_submissions', JSON.stringify(weeklySubmissions));

      // เพิ่มการแจ้งเตือน
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const student = students.find(s => s.id.toString() === selectedStudent);
      notifications.push({
        id: Date.now(),
        message: `พนักงานที่ปรึกษาได้ยืนยันบันทึกรายสัปดาห์ที่ ${selectedWeeklyReport.weekNumber} ของ ${student?.name}`,
        date: new Date().toLocaleDateString('th-TH', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        read: false,
        recipientRoles: ['teacher', 'student']
      });
      localStorage.setItem('notifications', JSON.stringify(notifications));

      // อัพเดท state
      setSubmittedWeeklyReports(weeklySubmissions);
      setShowWeeklyModal(false);
    }
  };




  useEffect(() => {
    // Check submitted documents from localStorage
    const checkSubmittedDocuments = () => {
      const documentsStatus: { [key: string]: { [key: string]: boolean } } = {};

      // Check Coop05 submissions
      ['1', '4', '5'].forEach(studentId => {
        const coop05Data = localStorage.getItem(`coop05_${studentId}`);
        documentsStatus[studentId] = {
          Coop05: !!coop05Data && JSON.parse(coop05Data).isSubmitted
        };
      });

      setSubmittedDocuments(documentsStatus);
    };

    checkSubmittedDocuments();

    // Listen for storage changes
    const handleStorageChange = () => {
      checkSubmittedDocuments();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const notifs = getNotifications().map(notification => {
      const messageMatch = notification.message.match(/นิสิต\s(.*?)\sส่ง\s(Coop\d+)/);
      if (messageMatch) {
        return {
          ...notification,
          studentName: messageMatch[1],
          documentType: messageMatch[2],
          studentId: messageMatch[1] === "สมชาย ใจดี" ? "1" :
            messageMatch[1] === "วิศวะ พัฒนา" ? "4" : "5"
        };
      }
      return notification;
    });
    setNotifications(notifs);
  }, [getNotifications]);

  useEffect(() => {
    const interval = setInterval(() => {
      const notifs = getNotifications().map(notification => {
        const messageMatch = notification.message.match(/นิสิต\s(.*?)\sส่ง\s(Coop\d+)/);
        if (messageMatch) {
          return {
            ...notification,
            studentName: messageMatch[1],
            documentType: messageMatch[2],
            studentId: messageMatch[1] === "สมชาย ใจดี" ? "1" :
              messageMatch[1] === "วิศวะ พัฒนา" ? "4" : "5"
          };
        }
        return notification;
      });
      setNotifications(notifs);
    }, 30000);

    return () => clearInterval(interval);
  }, [getNotifications]);

  // ปรับปรุงฟังก์ชัน handleNotificationClick
  const handleNotificationClick = (notification: Notification) => {
    // เรียกใช้ markNotificationAsRead ด้วย id
    markNotificationAsRead(notification.id);

    // ถ้าเป็นการแจ้งเตือน Coop01 ให้นำทางไปยังหน้าดูข้อมูล
    if (notification.documentType === 'Coop01' && notification.studentId) {
      router.push(`/mentor/student/${notification.studentId}/coop01`);
    }

    // อัพเดทรายการแจ้งเตือน
    setNotifications(prev =>
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );
  };

  // ข้อมูลพี่เลี้ยง
  const supervisor = {
    name: "คุณวิศวะ เชี่ยวชาญ",
    company: "บริษัท เทคโนโลยี จำกัด",
    email: "visawa@example.com"
  };

  // ข้อมูลนิสิตในความดูแล
  const students = [
    {
      id: 1,
      name: "นายสมชาย ใจดี",
      position: "Fullstack Dev",
      company: "บริษัท เทคโนโลยี จำกัด",
      supervisor: "คุณวิศวะ เชี่ยวชาญ",
      studentId: "65012345",
      studentDocuments: [
        { name: "Coop01", status: "completed" },
        { name: "ที่พัก", status: "pending" }
      ],
      companyDocuments: [
        { name: "ประเมินผลการฝึกงาน", status: () => submittedDocuments['1']?.Coop05 ? "completed" : "pending" }
      ],
      weeklyReports: [
        { week: 1, status: "completed" },
        { week: 2, status: "completed" },
        { week: 3, status: "pending" },
        { week: 4, status: "pending" }
      ]
    },
    {
      id: 4,
      name: "นายวิศวะ พัฒนา",
      position: "Frontend Dev",
      company: "บริษัท เทคโนโลยี จำกัด",
      supervisor: "คุณวิศวะ เชี่ยวชาญ",
      studentId: "65012348",
      studentDocuments: [
        { name: "Coop01", status: "pending" },
        { name: "ที่พัก", status: "pending" }
      ],
      companyDocuments: [
        { name: "ประเมินผลการฝึกงาน", status: () => submittedDocuments['4']?.Coop05 ? "completed" : "pending" }
      ],
      weeklyReports: [
        { week: 1, status: "completed" },
        { week: 2, status: "pending" },
        { week: 3, status: "pending" },
        { week: 4, status: "pending" }
      ]
    },
    {
      id: 5,
      name: "นางสาวนวพร กล้าหาญ",
      position: "Frontend Dev",
      company: "บริษัท เทคโนโลยี จำกัด",
      supervisor: "คุณวิศวะ เชี่ยวชาญ",
      studentId: "65012349",
      studentDocuments: [
        { name: "Coop01", status: "completed" },
        { name: "ที่พัก", status: "completed" }
      ],
      companyDocuments: [
        { name: "ประเมินผลการฝึกงาน", status: () => submittedDocuments['5']?.Coop05 ? "completed" : "pending" }
      ],
      weeklyReports: [
        { week: 1, status: "completed" },
        { week: 2, status: "completed" },
        { week: 3, status: "completed" },
        { week: 4, status: "pending" }
      ]
    }
  ];

  // Add to existing component
  const [showCoop08Modal, setShowCoop08Modal] = useState<boolean>(false);
  const [selectedCoop08Student, setSelectedCoop08Student] = useState<string | null>(null);
  const [coop08FormData, setCoop08FormData] = useState<Coop08FormData>({
    studentId: "",
    studentName: "",
    program: "วิศวกรรมศาสตร์บัณฑิต",
    major: "วิศวกรรมคอมพิวเตอร์",
    faculty: "คณะเทคโนโลยีสารสนเทศและการสื่อสาร",
    company: "",
    evaluatorName: "",
    evaluation: {
      moralityAndEthics: {
        honesty: 0,
        respectRules: 0,
        sacrifice: 0,
        professionalEthics: 0
      },
      knowledge: {
        professionalKnowledge: 0,
        workUnderstanding: 0,
        achievementCapability: 0,
        knowledgeApplication: 0,
        taskEfficiency: 0,
        continuousLearning: 0
      },
      intellectualSkills: {
        planning: 0,
        dataCollection: 0,
        problemSolving: 0,
        creativity: 0,
        presentation: 0
      },
      interpersonalSkills: {
        adaptation: 0,
        communication: 0,
        teamwork: 0,
        leadership: 0,
        openMinded: 0
      },
      analyticalSkills: {
        numericalAnalysis: 0,
        thaiCommunication: 0,
        englishCommunication: 0,
        computerSkills: 0
      },
      aestheticAppreciation: {
        culturalAppreciation: 0
      },
      healthPromotion: {
        goodHealth: 0,
        appropriateManners: 0
      }
    }
  });

  const handleCoop08Click = (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setSelectedCoop08Student(studentId.toString());
      setCoop08FormData(prev => ({
        ...prev,
        studentId: studentId.toString(),
        studentName: student.name,
        company: student.company,
        evaluatorName: supervisor.name
      }));
      setShowCoop08Modal(true);
    }
  };

  const handleEvaluationChange = (
    category: keyof Coop08Evaluation,
    field: string,
    value: number
  ) => {
    setCoop08FormData(prev => ({
      ...prev,
      evaluation: {
        ...prev.evaluation,
        [category]: {
          ...prev.evaluation[category],
          [field]: value
        }
      }
    }));
  };


  const handleCoop08Submit = () => {
    if (selectedCoop08Student) {
      // Save to localStorage
      localStorage.setItem(`coop08_${selectedCoop08Student}`, JSON.stringify(coop08FormData));

      // Add notification
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.push({
        id: Date.now(),
        message: `พนักงานที่ปรึกษาได้ประเมินผลนิสิต ${coop08FormData.studentName}`,
        date: new Date().toLocaleDateString('th-TH', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        read: false,
        recipientRoles: ['teacher']
      });
      localStorage.setItem('notifications', JSON.stringify(notifications));

      setShowCoop08Modal(false);
    }
  };

  // Modify the document icon section in the table


  const handleCloseModal = () => {
    setShowWeeklyModal(false);
    setSelectedWeeklyReport(null);
    setSelectedStudent(null);
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
              <Link href="/mentor">
                <Button variant="ghost" size="icon">
                  <Home className="h-5 w-5" />
                </Button>
              </Link>

              {/* การแจ้งเตือน */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications.some(n => !n.read) && (
                      <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end">
                  <div className="p-2">
                    <h3 className="text-lg font-semibold mb-2">การแจ้งเตือน</h3>
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <DropdownMenuItem
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`cursor-pointer ${notification.documentType === 'Coop01' ? 'hover:bg-purple-50' : ''}`}
                        >
                          <div className="flex flex-col gap-1">
                            <span>{notification.message}</span>
                            <span className="text-sm text-muted-foreground">
                              {notification.date}
                            </span>
                            {notification.documentType === 'Coop01' && (
                              <span className="text-xs text-purple-600">
                                คลิกเพื่อดูข้อมูล
                              </span>
                            )}
                          </div>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 text-center py-2">
                        ไม่มีการแจ้งเตือนใหม่
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* โปรไฟล์พี่เลี้ยง */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium">{supervisor.name}</span>
                      <span className="text-xs text-gray-500">{supervisor.company}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">{supervisor.name}</span>
                      <span className="text-xs text-gray-500">{supervisor.email}</span>
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

      {/* Spacer for fixed navbar */}
      <div className="h-16" />

      {/* เนื้อหาหลัก */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">รายชื่อนิสิตในความดูแล</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                        ชื่อ-นามสกุล
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                        ตำแหน่งงาน
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-sm font-medium text-gray-500">
                        เอกสารนิสิต
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-sm font-medium text-gray-500">
                        เอกสารที่ต้องกรอก
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-sm font-medium text-gray-500">
                        บันทึกรายสัปดาห์
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.position}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center gap-2">
                            {student.studentDocuments.map((doc, index) => (
                              <Button
                                key={index}
                                variant="ghost"
                                size="icon"
                                className="hover:bg-gray-100"
                                onClick={() => handleCoop07Click(student.id)}
                              >
                                {doc.status === "completed" ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                  <FileText className="h-5 w-5 text-gray-400" />
                                )}
                              </Button>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center items-center gap-4">
                            {/* Coop05 */}
                            <Link href={`/mentor/student/${student.id}/coop05`}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-gray-100"
                                title="แบบประเมินผลการฝึกงาน (Coop05)"
                              >
                                {typeof student.companyDocuments[0].status === 'function' ?
                                  (student.companyDocuments[0].status() === "completed" ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <FileText className="h-5 w-5 text-gray-400" />
                                  )) :
                                  (student.companyDocuments[0].status === "completed" ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <FileText className="h-5 w-5 text-gray-400" />
                                  ))
                                }
                              </Button>
                            </Link>
                            {/* Coop08 */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-gray-100"
                              onClick={() => handleCoop08Click(student.id)}
                              title="แบบประเมินผลนิสิต (Coop08)"
                            >
                              <FileText className="h-5 w-5 text-gray-400" />
                            </Button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center gap-2">
                            {student.weeklyReports.map((report, index) => (
                              <Button
                                key={index}
                                variant="ghost"
                                size="icon"
                                className="hover:bg-gray-100"
                                onClick={() => handleWeeklyReportClick(student.id, report.week)}
                                title={`สัปดาห์ที่ ${report.week}`}
                              >
                                {submittedWeeklyReports[student.id]?.[report.week] ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                  <FileText className="h-5 w-5 text-gray-400" />
                                )}
                              </Button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={showCoop07Modal} onOpenChange={setShowCoop07Modal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-purple-800">
              โครงร่างรายงานการปฏิบัติงาน (Coop07)
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-purple-800 mb-4">รายละเอียดโครงร่างรายงาน</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อเรื่อง (ภาษาไทย)
                  </label>
                  <Input
                    value={coop07FormData.titleThai}
                    onChange={(e) => handleCoop07InputChange('titleThai', e.target.value)}
                    placeholder="กรอกชื่อเรื่องภาษาไทย"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อเรื่อง (ภาษาอังกฤษ)
                  </label>
                  <Input
                    value={coop07FormData.titleEng}
                    onChange={(e) => handleCoop07InputChange('titleEng', e.target.value)}
                    placeholder="กรอกชื่อเรื่องภาษาอังกฤษ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    รายละเอียดเนื้อหาของรายงาน
                  </label>
                  <Textarea
                    value={coop07FormData.reportDetails}
                    onChange={(e) => handleCoop07InputChange('reportDetails', e.target.value)}
                    placeholder="กรอกรายละเอียดเนื้อหาของรายงาน"
                    className="min-h-[150px]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setShowCoop07Modal(false)}
              >
                ยกเลิก
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleCoop07Submit}
                disabled={!coop07FormData.titleThai || !coop07FormData.titleEng || !coop07FormData.reportDetails}
              >
                ยืนยันเอกสาร
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showCoop08Modal} onOpenChange={setShowCoop08Modal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-purple-800">
              แบบประเมินผลนิสิต มหาวิทยาลัยพะเยา (Coop08)
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-6">
            {/* Student Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-purple-800 mb-4">ข้อมูลทั่วไป</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ชื่อ-นามสกุลนิสิต</label>
                  <Input value={coop08FormData.studentName} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">รหัสนิสิต</label>
                  <Input value={coop08FormData.studentId} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">หลักสูตร</label>
                  <Input value={coop08FormData.program} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">สาขาวิชา</label>
                  <Input value={coop08FormData.major} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">คณะ</label>
                  <Input value={coop08FormData.faculty} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">สถานประกอบการ</label>
                  <Input value={coop08FormData.company} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ชื่อ-นามสกุลผู้ประเมิน</label>
                  <Input value={coop08FormData.evaluatorName} disabled />
                </div>
              </div>
            </div>

            {/* Evaluation Sections */}
            {/* 1. Morality and Ethics */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-purple-800 mb-4">1. คุณธรรม จริยธรรม</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">1.1 มีความซื่อสัตย์ สุจริต</label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={coop08FormData.evaluation.moralityAndEthics.honesty}
                    onChange={(e) => handleEvaluationChange('moralityAndEthics', 'honesty', parseInt(e.target.value))}
                  />
                </div>
                {/* Add other morality and ethics fields similarly */}
              </div>
            </div>

            {/* Add other evaluation sections similarly */}

            {/* Additional Comments */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-purple-800 mb-4">ข้อคิดเห็นเพิ่มเติม</h3>
              <Textarea
                value={coop08FormData.evaluation.additionalComments}
                onChange={(e) => setCoop08FormData(prev => ({
                  ...prev,
                  evaluation: {
                    ...prev.evaluation,
                    additionalComments: e.target.value
                  }
                }))}
                className="min-h-[100px]"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setShowCoop08Modal(false)}
              >
                ยกเลิก
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleCoop08Submit}
              >
                บันทึกการประเมิน
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showWeeklyModal} onOpenChange={setShowWeeklyModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-purple-800">
              บันทึกการปฏิบัติงานรายสัปดาห์
            </DialogTitle>
          </DialogHeader>

          {selectedWeeklyReport && (
            <div className="mt-4 space-y-6">
              {/* ข้อมูลพื้นฐาน */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-purple-800 mb-4">ข้อมูลการปฏิบัติงาน</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">สัปดาห์ที่</p>
                    <p className="font-medium">{selectedWeeklyReport.weekNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">วันที่เริ่มต้น</p>
                    <p className="font-medium">
                      {new Date(selectedWeeklyReport.startDate).toLocaleDateString('th-TH')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">วันที่สิ้นสุด</p>
                    <p className="font-medium">
                      {new Date(selectedWeeklyReport.endDate).toLocaleDateString('th-TH')}
                    </p>
                  </div>
                </div>
              </div>

              {/* สถานะและรายละเอียดงาน */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-purple-800 mb-4">รายละเอียดการปฏิบัติงาน</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">งานที่ปฏิบัติ</p>
                    <p className="font-medium">{selectedWeeklyReport.workDescription}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ปัญหาที่พบ</p>
                    <p className="font-medium">{selectedWeeklyReport.problems}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">การแก้ไขปัญหา</p>
                    <p className="font-medium">{selectedWeeklyReport.solutions}</p>
                  </div>
                </div>
              </div>

              {/* ข้อมูลการเรียนรู้ */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-purple-800 mb-4">การเรียนรู้และข้อเสนอแนะ</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">รายวิชาที่เกี่ยวข้อง</p>
                    <p className="font-medium">{selectedWeeklyReport.relatedCourses}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ประสบการณ์ที่ได้รับ</p>
                    <p className="font-medium">{selectedWeeklyReport.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ข้อเสนอแนะ</p>
                    <p className="font-medium">{selectedWeeklyReport.suggestions}</p>
                  </div>
                </div>
              </div>

              {/* ปุ่มปิด */}
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  ปิด
                </Button>
                {/* แก้ไขเงื่อนไขการแสดงปุ่มยืนยัน */}
                {selectedWeeklyReport && (
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleWeeklyReportApprove}
                  >
                    ยืนยันบันทึกรายสัปดาห์
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>

  );
};

export default Mentor;