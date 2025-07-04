import { User, Subject, Assignment, Attendance, Exam, Project, Notification, InternalMarks } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Jagadeesh',
    email: 'jagadeesh@college.edu',
    role: 'student',
    rollNumber: '2021CSE001',
    department: 'Computer Science',
    semester: 6,
    year: 3,
    section: 'A',
    phone: '+91 9876543210',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    name: 'Dr. Priya Patel',
    email: 'priya.patel@college.edu',
    role: 'faculty',
    employeeId: 'FAC001',
    department: 'Computer Science',
    phone: '+91 9876543211',
    subjects: ['CS301', 'CS302', 'CS303'],
    avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '3',
    name: 'Anita Singh',
    email: 'anita.singh@college.edu',
    role: 'student',
    rollNumber: '2021CSE002',
    department: 'Computer Science',
    semester: 6,
    year: 3,
    section: 'A',
    phone: '+91 9876543212',
    avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

export const mockSubjects: Subject[] = [
  {
    id: 'CS301',
    name: 'Database Management Systems',
    code: 'CS301',
    credits: 4,
    semester: 6,
    facultyId: '2',
    description: 'Comprehensive study of database design, implementation, and management'
  },
  {
    id: 'CS302',
    name: 'Software Engineering',
    code: 'CS302',
    credits: 3,
    semester: 6,
    facultyId: '2',
    description: 'Software development lifecycle, methodologies, and project management'
  },
  {
    id: 'CS303',
    name: 'Computer Networks',
    code: 'CS303',
    credits: 4,
    semester: 6,
    facultyId: '2',
    description: 'Network protocols, architecture, and security fundamentals'
  }
];

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Database Design Project',
    description: 'Design and implement a complete database system for a library management system including ER diagrams, normalization, and SQL queries.',
    subjectId: 'CS301',
    facultyId: '2',
    dueDate: '2025-01-25',
    maxMarks: 50,
    submissions: [
      {
        id: '1',
        assignmentId: '1',
        studentId: '1',
        submittedAt: '2025-01-20T10:30:00Z',
        files: ['library_db_design.pdf', 'sql_queries.sql'],
        marks: 45,
        feedback: 'Excellent work on normalization. Minor improvements needed in indexing strategy.',
        status: 'graded'
      }
    ],
    createdAt: '2025-01-10T09:00:00Z',
    status: 'active'
  },
  {
    id: '2',
    title: 'Software Requirements Analysis',
    description: 'Analyze requirements for an e-commerce platform and create detailed SRS document.',
    subjectId: 'CS302',
    facultyId: '2',
    dueDate: '2025-01-30',
    maxMarks: 40,
    submissions: [],
    createdAt: '2025-01-15T14:00:00Z',
    status: 'active'
  }
];

export const mockAttendance: Attendance[] = [
  {
    id: '1',
    subjectId: 'CS301',
    date: '2025-01-20',
    students: [
      { studentId: '1', status: 'present', timestamp: '2025-01-20T09:00:00Z' },
      { studentId: '3', status: 'present', timestamp: '2025-01-20T09:02:00Z' }
    ],
    qrCode: 'QR_CS301_20250120',
    sessionType: 'lecture',
    duration: 60
  }
];

export const mockExams: Exam[] = [
  {
    id: '1',
    title: 'Mid-Term Examination',
    subjectId: 'CS301',
    date: '2025-02-15',
    startTime: '10:00',
    endTime: '13:00',
    venue: 'Exam Hall A',
    type: 'internal',
    maxMarks: 100,
    results: [
      {
        id: '1',
        examId: '1',
        studentId: '1',
        marks: 85,
        grade: 'A',
        remarks: 'Excellent performance'
      }
    ]
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Smart Campus Management System',
    description: 'Develop a comprehensive web application for campus resource management including student portal, faculty dashboard, and administrative tools.',
    facultyId: '2',
    students: ['1', '3'],
    status: 'in-progress',
    dueDate: '2025-04-30',
    progress: 65,
    milestones: [
      {
        id: '1',
        title: 'Requirements Analysis',
        description: 'Complete system requirements and design documentation',
        dueDate: '2025-02-15',
        completed: true,
        completedAt: '2025-02-10T16:00:00Z'
      },
      {
        id: '2',
        title: 'Database Design',
        description: 'Design and implement database schema',
        dueDate: '2025-03-15',
        completed: true,
        completedAt: '2025-03-10T14:30:00Z'
      },
      {
        id: '3',
        title: 'Frontend Development',
        description: 'Develop user interface and user experience',
        dueDate: '2025-04-15',
        completed: false
      }
    ],
    createdAt: '2025-01-01T00:00:00Z'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Mid-Term Exam Schedule Released',
    message: 'The mid-term examination schedule for Semester 6 has been published. Please check your exam dates and venues.',
    type: 'exam',
    priority: 'high',
    targetAudience: 'students',
    createdBy: '2',
    createdAt: '2025-01-18T10:00:00Z',
    read: false
  },
  {
    id: '2',
    title: 'New Assignment: Software Requirements Analysis',
    message: 'A new assignment has been posted for Software Engineering. Due date: January 30, 2025.',
    type: 'assignment',
    priority: 'medium',
    targetAudience: 'students',
    createdBy: '2',
    createdAt: '2025-01-15T14:00:00Z',
    read: true
  },
  {
    id: '3',
    title: 'Department Meeting - Faculty',
    message: 'Monthly department meeting scheduled for January 25, 2025 at 2:00 PM in Conference Room.',
    type: 'announcement',
    priority: 'medium',
    targetAudience: 'faculty',
    createdBy: 'admin',
    createdAt: '2025-01-17T09:00:00Z',
    read: false
  }
];

export const mockInternalMarks: InternalMarks[] = [
  {
    id: '1',
    studentId: '1',
    subjectId: 'CS301',
    semester: 6,
    assignments: 45,
    internals: 85,
    attendance: 95,
    total: 225,
    grade: 'A+'
  },
  {
    id: '2',
    studentId: '1',
    subjectId: 'CS302',
    semester: 6,
    assignments: 38,
    internals: 78,
    attendance: 92,
    total: 208,
    grade: 'A'
  }
];