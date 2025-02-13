"use client";
import React, { useState, FormEvent, useEffect } from 'react';
import Image from 'next/image';
import background from '../public/background3.jpg';
interface StudentInfo {
  name: string;
  position: string;
  company: string;
}

interface Coop05FormData {
  nameMentor: string;
  positionMentor: string;
  deptMentor: string;
  telMentor: string;
  emailMentor: string;
  jobPosition: string;
  jobDes: string;
  isSubmitted?: boolean;
}

const Coop05Form: React.FC = () => {
  // Ensure safe string to number conversion for student ID
  const getStudentId = () => {
    if (typeof window === 'undefined') return '1';
    const pathSegments = window.location.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];
    return ['1', '4', '5'].includes(id) ? id : '1';
  };

  const studentId = getStudentId();

  // Define student info with explicit typing
  const studentInfo: Record<string, StudentInfo> = {
    '1': {
      name: "นายสมชาย ใจดี",
      position: "Fullstack Dev",
      company: "บริษัท เทคโนโลยี จำกัด"
    },
    '4': {
      name: "นายวิศวะ พัฒนา",
      position: "Frontend Dev",
      company: "บริษัท เทคโนโลยี จำกัด"
    },
    '5': {
      name: "นางสาวนวพร กล้าหาญ",
      position: "Frontend Dev",
      company: "บริษัท เทคโนโลยี จำกัด"
    }
  };

  const [formData, setFormData] = useState<Coop05FormData>({
    nameMentor: '',
    positionMentor: '',
    deptMentor: '',
    telMentor: '',
    emailMentor: '',
    jobPosition: '',
    jobDes: '',
    isSubmitted: false
  });

  const mentorInfo = {
    name: "คุณวิศวะ เชี่ยวชาญ",
    position: "Senior Software Engineer",
    department: "Development",
    tel: "089-123-4567",
    email: "visawa@example.com"
  };

  useEffect(() => {
    // Check if form is already submitted
    const coop05Data = localStorage.getItem(`coop05_${studentId}`);
    if (coop05Data) {
      const parsedData = JSON.parse(coop05Data);
      setFormData(parsedData);
    } else {
      // Pre-fill with mentor information
      setFormData(prev => ({
        ...prev,
        nameMentor: mentorInfo.name,
        positionMentor: mentorInfo.position,
        deptMentor: mentorInfo.department,
        telMentor: mentorInfo.tel,
        emailMentor: mentorInfo.email,
        jobPosition: studentInfo[studentId]?.position || '',
      }));
    }
  }, [studentId]);

  const handleInputChange = (field: keyof Coop05FormData, value: string) => {
    if (!formData.isSubmitted) {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Mark as submitted
    const submittedData = {
      ...formData,
      isSubmitted: true
    };

    // Save to localStorage
    localStorage.setItem(`coop05_${studentId}`, JSON.stringify(submittedData));

    // Update student documents in localStorage
    const studentsData = JSON.parse(localStorage.getItem('students') || '[]');
    const studentIndex = studentsData.findIndex(student => student.id === parseInt(studentId));
    
    if (studentIndex !== -1) {
      // Update the specific document status
      studentsData[studentIndex].companyDocuments = studentsData[studentIndex].companyDocuments.map(doc => 
        doc.name === "ประเมินผลการฝึกงาน" ? { ...doc, status: "completed" } : doc
      );
      
      localStorage.setItem('students', JSON.stringify(studentsData));
    }

    // Add notification to localStorage for teacher
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push({
      id: Date.now(),
      message: `พนักงานที่ปรึกษาได้กรอกแบบประเมินผลการปฏิบัติงานสำหรับ ${studentInfo[studentId]?.name}`,
      date: new Date().toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      read: false,
      recipientRoles: ['teacher']
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));

    // Add notification to localStorage for mentor
    notifications.push({
      id: Date.now() + 1,
      message: `ส่งแบบประเมินผลการปฏิบัติงานสำหรับ ${studentInfo[studentId]?.name} เรียบร้อย`,
      date: new Date().toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short', 
        year: 'numeric'
      }),
      read: false,
      recipientRoles: ['mentor']
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));

    // Redirect back to mentor dashboard
    window.location.href = '/mentor';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-center text-purple-800 mb-8">
          แบบประเมินผลการปฏิบัติงาน (Coop05)
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Information */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-purple-800 mb-4">ข้อมูลนิสิต</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label 
                  htmlFor="studentName" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ชื่อ-นามสกุล
                </label>
                <input 
                  id="studentName"
                  type="text"
                  value={studentInfo[studentId]?.name || ''} 
                  disabled 
                  placeholder="ชื่อนิสิต"
                  title="ชื่อ-นามสกุลนิสิต"
                  className="w-full p-2 border rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label 
                  htmlFor="studentCompany" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  สถานประกอบการ
                </label>
                <input 
                  id="studentCompany"
                  type="text"
                  value={studentInfo[studentId]?.company || ''} 
                  disabled 
                  placeholder="ชื่อสถานประกอบการ"
                  title="สถานประกอบการของนิสิต"
                  className="w-full p-2 border rounded-md bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Mentor Information */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-purple-800 mb-4">ข้อมูลพนักงานที่ปรึกษา</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label 
                  htmlFor="mentorName" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ชื่อ-นามสกุล
                </label>
                <input 
                  id="mentorName"
                  type="text"
                  value={formData.nameMentor}
                  onChange={(e) => handleInputChange('nameMentor', e.target.value)}
                  disabled={formData.isSubmitted}
                  placeholder="ชื่อพนักงานที่ปรึกษา"
                  title="ชื่อ-นามสกุลพนักงานที่ปรึกษา"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label 
                  htmlFor="mentorPosition" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ตำแหน่ง
                </label>
                <input 
                  id="mentorPosition"
                  type="text"
                  value={formData.positionMentor}
                  onChange={(e) => handleInputChange('positionMentor', e.target.value)}
                  disabled={formData.isSubmitted}
                  placeholder="ตำแหน่งของพนักงานที่ปรึกษา"
                  title="ตำแหน่งของพนักงานที่ปรึกษา"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label 
                  htmlFor="mentorDepartment" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  แผนก
                </label>
                <input 
                  id="mentorDepartment"
                  type="text"
                  value={formData.deptMentor}
                  onChange={(e) => handleInputChange('deptMentor', e.target.value)}
                  disabled={formData.isSubmitted}
                  placeholder="แผนกของพนักงานที่ปรึกษา"
                  title="แผนกของพนักงานที่ปรึกษา"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label 
                  htmlFor="mentorPhone" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  โทรศัพท์ (มือถือ)
                </label>
                <input 
                  id="mentorPhone"
                  type="tel"
                  value={formData.telMentor}
                  onChange={(e) => handleInputChange('telMentor', e.target.value)}
                  disabled={formData.isSubmitted}
                  placeholder="เบอร์โทรศัพท์มือถือ"
                  title="หมายเลขโทรศัพท์มือถือ"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="col-span-2">
                <label 
                  htmlFor="mentorEmail" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  อีเมล์
                </label>
                <input 
                  id="mentorEmail"
                  type="email"
                  value={formData.emailMentor}
                  onChange={(e) => handleInputChange('emailMentor', e.target.value)}
                  disabled={formData.isSubmitted}
                  placeholder="อีเมลของพนักงานที่ปรึกษา"
                  title="ที่อยู่อีเมลของพนักงานที่ปรึกษา"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-purple-800 mb-4">รายละเอียดงาน</h2>
            <div className="space-y-4">
              <div>
                <label 
                  htmlFor="jobPosition" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ตำแหน่งงานที่นิสิตปฏิบัติงาน
                </label>
                <input 
                  id="jobPosition"
                  type="text"
                  value={formData.jobPosition}
                  onChange={(e) => handleInputChange('jobPosition', e.target.value)}
                  disabled={formData.isSubmitted}
                  placeholder="ระบุตำแหน่งงานของนิสิต"
                  title="ตำแหน่งงานที่นิสิตปฏิบัติ"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label 
                  htmlFor="jobDescription" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ลักษณะงานที่นิสิตปฏิบัติ
                </label>
                <textarea 
                  id="jobDescription"
                  value={formData.jobDes}
                  onChange={(e) => handleInputChange('jobDes', e.target.value)}
                  placeholder="รายละเอียดงานที่นิสิตได้รับมอบหมาย"
                  title="รายละเอียดงานที่นิสิตปฏิบัติ"
                  disabled={formData.isSubmitted}
                  className="w-full p-2 border rounded-md min-h-[100px]"
                />
              </div>
            </div>
          </div>

          {!formData.isSubmitted && (
            <button 
              type="submit" 
              className="w-full p-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              บันทึกข้อมูล
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Coop05Form;