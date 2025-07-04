export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  rollNumber?: string;
  employeeId?: string;
  department: string;
  semester?: number;
  year?: number;
  section?: string;
  avatar?: string;
  phone?: string;
  subjects?: string[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  facultyId: string;
  description: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  facultyId: string;
  dueDate: string;
  maxMarks: number;
  attachments?: string[];
  submissions: AssignmentSubmission[];
  createdAt: string;
  status: 'active' | 'closed';
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  files: string[];
  marks?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'late';
}

export interface Attendance {
  id: string;
  subjectId: string;
  date: string;
  students: AttendanceRecord[];
  qrCode?: string;
  sessionType: 'lecture' | 'lab' | 'tutorial';
  duration: number;
}

export interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'late';
  timestamp?: string;
}

export interface Exam {
  id: string;
  title: string;
  subjectId: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  type: 'internal' | 'external' | 'practical';
  maxMarks: number;
  results?: ExamResult[];
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  marks: number;
  grade: string;
  remarks?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  facultyId: string;
  students: string[];
  status: 'assigned' | 'in-progress' | 'submitted' | 'completed';
  dueDate: string;
  progress: number;
  milestones: ProjectMilestone[];
  createdAt: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  completedAt?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'announcement' | 'assignment' | 'exam' | 'attendance' | 'result';
  priority: 'low' | 'medium' | 'high';
  targetAudience: 'all' | 'students' | 'faculty' | 'specific';
  targetUsers?: string[];
  createdBy: string;
  createdAt: string;
  read: boolean;
  attachments?: string[];
}

export interface InternalMarks {
  id: string;
  studentId: string;
  subjectId: string;
  semester: number;
  assignments: number;
  internals: number;
  attendance: number;
  total: number;
  grade: string;
}