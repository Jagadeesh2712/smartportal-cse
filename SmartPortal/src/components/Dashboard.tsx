import React from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Users, 
  Award,
  CheckCircle,
  AlertTriangle,
  FileText,
  BarChart3
} from 'lucide-react';
import { User, Assignment, Attendance, Exam, InternalMarks } from '../types';

interface DashboardProps {
  user: User;
  assignments: Assignment[];
  attendance: Attendance[];
  exams: Exam[];
  internalMarks: InternalMarks[];
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  assignments, 
  attendance, 
  exams, 
  internalMarks 
}) => {
  const pendingAssignments = assignments.filter(a => 
    a.status === 'active' && 
    new Date(a.dueDate) > new Date() &&
    !a.submissions.some(s => s.studentId === user.id)
  );

  const upcomingExams = exams.filter(e => 
    new Date(e.date) > new Date()
  ).slice(0, 3);

  const overallAttendance = attendance.length > 0 
    ? Math.round((attendance.reduce((acc, att) => {
        const studentRecord = att.students.find(s => s.studentId === user.id);
        return acc + (studentRecord?.status === 'present' ? 1 : 0);
      }, 0) / attendance.length) * 100)
    : 0;

  const averageMarks = internalMarks.length > 0
    ? Math.round(internalMarks.reduce((acc, mark) => acc + mark.total, 0) / internalMarks.length)
    : 0;

  const stats = user.role === 'student' ? [
    {
      title: 'Pending Assignments',
      value: pendingAssignments.length,
      icon: FileText,
      color: 'bg-orange-500',
      change: `${pendingAssignments.length} due soon`,
      changeType: 'warning'
    },
    {
      title: 'Attendance',
      value: `${overallAttendance}%`,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: overallAttendance >= 75 ? 'Good' : 'Below 75%',
      changeType: overallAttendance >= 75 ? 'success' : 'warning'
    },
    {
      title: 'Average Marks',
      value: averageMarks,
      icon: Award,
      color: 'bg-blue-500',
      change: averageMarks >= 80 ? 'Excellent' : averageMarks >= 60 ? 'Good' : 'Needs Improvement',
      changeType: averageMarks >= 80 ? 'success' : averageMarks >= 60 ? 'info' : 'warning'
    },
    {
      title: 'Upcoming Exams',
      value: upcomingExams.length,
      icon: Calendar,
      color: 'bg-purple-500',
      change: upcomingExams.length > 0 ? 'Prepare well' : 'No exams',
      changeType: 'info'
    }
  ] : [
    {
      title: 'Total Students',
      value: 45,
      icon: Users,
      color: 'bg-blue-500',
      change: '+3 new',
      changeType: 'success'
    },
    {
      title: 'Active Assignments',
      value: assignments.filter(a => a.status === 'active').length,
      icon: FileText,
      color: 'bg-green-500',
      change: 'This semester',
      changeType: 'info'
    },
    {
      title: 'Avg Attendance',
      value: '87%',
      icon: CheckCircle,
      color: 'bg-orange-500',
      change: '+2% from last month',
      changeType: 'success'
    },
    {
      title: 'Subjects Teaching',
      value: user.subjects?.length || 0,
      icon: BookOpen,
      color: 'bg-purple-500',
      change: 'Current semester',
      changeType: 'info'
    }
  ];

  const recentActivity = user.role === 'student' ? [
    { 
      action: 'Assignment submitted', 
      subject: 'Database Management Systems', 
      time: '2 hours ago', 
      type: 'success',
      icon: CheckCircle
    },
    { 
      action: 'Attendance marked', 
      subject: 'Software Engineering', 
      time: '1 day ago', 
      type: 'info',
      icon: Clock
    },
    { 
      action: 'Exam result published', 
      subject: 'Computer Networks', 
      time: '3 days ago', 
      type: 'success',
      icon: Award
    }
  ] : [
    { 
      action: 'Assignment graded', 
      subject: 'Database Management Systems', 
      time: '1 hour ago', 
      type: 'success',
      icon: CheckCircle
    },
    { 
      action: 'Attendance taken', 
      subject: 'Software Engineering', 
      time: '3 hours ago', 
      type: 'info',
      icon: Clock
    },
    { 
      action: 'New assignment posted', 
      subject: 'Computer Networks', 
      time: '1 day ago', 
      type: 'info',
      icon: FileText
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {user.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-blue-100 mb-1">
                {user.role === 'student' 
                  ? `${user.department} - Semester ${user.semester}, Section ${user.section}` 
                  : `${user.department} Faculty`}
              </p>
              <p className="text-blue-100 text-sm">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            {user.avatar && (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-16 h-16 rounded-full border-4 border-white/20 object-cover"
              />
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                stat.changeType === 'success' ? 'text-green-600' : 
                stat.changeType === 'warning' ? 'text-orange-600' : 
                stat.changeType === 'error' ? 'text-red-600' : 
                'text-blue-600'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions / Pending Items */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {user.role === 'student' ? 'Pending Tasks' : 'Quick Actions'}
          </h2>
          
          {user.role === 'student' ? (
            <div className="space-y-4">
              {pendingAssignments.length > 0 ? (
                pendingAssignments.slice(0, 3).map((assignment) => {
                  const daysLeft = Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={assignment.id} className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center space-x-4">
                        <div className="bg-orange-100 rounded-lg p-2">
                          <FileText className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                          <p className="text-sm text-gray-600">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          daysLeft <= 1 ? 'bg-red-100 text-red-800' :
                          daysLeft <= 3 ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {daysLeft <= 0 ? 'Overdue' : `${daysLeft} days left`}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-500">All assignments completed!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors text-left">
                <FileText className="h-6 w-6 text-blue-600 mb-2" />
                <h3 className="font-medium text-gray-900">Create Assignment</h3>
                <p className="text-sm text-gray-600">Post new assignment for students</p>
              </button>
              <button className="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors text-left">
                <Clock className="h-6 w-6 text-green-600 mb-2" />
                <h3 className="font-medium text-gray-900">Take Attendance</h3>
                <p className="text-sm text-gray-600">Mark attendance for today's class</p>
              </button>
              <button className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors text-left">
                <BarChart3 className="h-6 w-6 text-purple-600 mb-2" />
                <h3 className="font-medium text-gray-900">View Analytics</h3>
                <p className="text-sm text-gray-600">Check class performance metrics</p>
              </button>
              <button className="p-4 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors text-left">
                <Award className="h-6 w-6 text-orange-600 mb-2" />
                <h3 className="font-medium text-gray-900">Grade Assignments</h3>
                <p className="text-sm text-gray-600">Review and grade submissions</p>
              </button>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`rounded-full p-1 ${
                  activity.type === 'success' ? 'bg-green-100' :
                  activity.type === 'warning' ? 'bg-yellow-100' :
                  'bg-blue-100'
                }`}>
                  <activity.icon className={`h-4 w-4 ${
                    activity.type === 'success' ? 'text-green-600' :
                    activity.type === 'warning' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.subject}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Exams */}
      {user.role === 'student' && upcomingExams.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Exams</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingExams.map((exam) => (
              <div key={exam.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{exam.title}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    exam.type === 'internal' ? 'bg-blue-100 text-blue-800' : 
                    exam.type === 'external' ? 'bg-red-100 text-red-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {exam.type}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>📅 {new Date(exam.date).toLocaleDateString()}</p>
                  <p>🕐 {exam.startTime} - {exam.endTime}</p>
                  <p>📍 {exam.venue}</p>
                  <p>📊 Max Marks: {exam.maxMarks}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;