import React, { useState } from 'react';
import { 
  QrCode, 
  Clock, 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle,
  Plus,
  Filter,
  BarChart3
} from 'lucide-react';
import { Attendance as AttendanceType, User, Subject } from '../types';

interface AttendanceProps {
  attendance: AttendanceType[];
  user: User;
  subjects: Subject[];
  onMarkAttendance?: (subjectId: string, sessionType: string) => void;
}

const Attendance: React.FC<AttendanceProps> = ({ 
  attendance, 
  user, 
  subjects,
  onMarkAttendance 
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<AttendanceType | null>(null);

  const filteredAttendance = attendance.filter(att => 
    selectedSubject === 'all' || att.subjectId === selectedSubject
  );

  const getAttendancePercentage = (subjectId?: string) => {
    const relevantAttendance = subjectId 
      ? attendance.filter(att => att.subjectId === subjectId)
      : attendance;
    
    if (relevantAttendance.length === 0) return 0;
    
    const presentCount = relevantAttendance.reduce((acc, att) => {
      const studentRecord = att.students.find(s => s.studentId === user.id);
      return acc + (studentRecord?.status === 'present' ? 1 : 0);
    }, 0);
    
    return Math.round((presentCount / relevantAttendance.length) * 100);
  };

  const QRCodeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="text-center">
          <div className="bg-gray-100 rounded-lg p-8 mb-4">
            <QrCode className="h-32 w-32 mx-auto text-gray-400" />
            <p className="text-sm text-gray-500 mt-2">QR Code for attendance</p>
          </div>
          <h3 className="text-lg font-semibold mb-2">Scan to Mark Attendance</h3>
          <p className="text-gray-600 mb-4">
            Students can scan this QR code to mark their attendance for today's session.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowQRModal(false)}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Download QR
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const CreateSessionModal = () => {
    const [formData, setFormData] = useState({
      subjectId: '',
      sessionType: 'lecture' as 'lecture' | 'lab' | 'tutorial',
      duration: 60
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (onMarkAttendance) {
        onMarkAttendance(formData.subjectId, formData.sessionType);
      }
      setShowQRModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h2 className="text-xl font-semibold mb-4">Start Attendance Session</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Type</label>
              <select
                value={formData.sessionType}
                onChange={(e) => setFormData({ ...formData, sessionType: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="lecture">Lecture</option>
                <option value="lab">Lab</option>
                <option value="tutorial">Tutorial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="30"
                max="180"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowQRModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Start Session
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        {user.role === 'faculty' && (
          <button
            onClick={() => setShowQRModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Start Session
          </button>
        )}
      </div>

      {/* Attendance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Attendance</p>
              <p className="text-2xl font-bold text-gray-900">{getAttendancePercentage()}%</p>
            </div>
            <div className="bg-blue-500 rounded-lg p-3">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  getAttendancePercentage() >= 75 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${getAttendancePercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {subjects.slice(0, 3).map(subject => {
          const percentage = getAttendancePercentage(subject.id);
          return (
            <div key={subject.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{subject.code}</h3>
                <span className={`text-sm font-medium ${
                  percentage >= 75 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {percentage}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{subject.name}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    percentage >= 75 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <Filter className="h-5 w-5 text-gray-400" />
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Subjects</option>
          {subjects.map(subject => (
            <option key={subject.id} value={subject.id}>{subject.name}</option>
          ))}
        </select>
      </div>

      {/* Attendance Records */}
      <div className="space-y-4">
        {filteredAttendance.length > 0 ? (
          filteredAttendance.map((record) => {
            const subject = subjects.find(s => s.id === record.subjectId);
            const studentRecord = record.students.find(s => s.studentId === user.id);
            const presentCount = record.students.filter(s => s.status === 'present').length;
            const totalStudents = record.students.length;

            return (
              <div key={record.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{subject?.name}</h3>
                    <p className="text-sm text-gray-600">{subject?.code} • {record.sessionType}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{record.duration} minutes</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {user.role === 'student' && (
                    <div className="flex items-center space-x-3">
                      {studentRecord?.status === 'present' ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {studentRecord?.status === 'present' ? 'Present' : 'Absent'}
                        </p>
                        {studentRecord?.timestamp && (
                          <p className="text-xs text-gray-500">
                            Marked at {new Date(studentRecord.timestamp).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {user.role === 'faculty' && (
                    <>
                      <div className="flex items-center space-x-3">
                        <Users className="h-6 w-6 text-blue-500" />
                        <div>
                          <p className="font-medium text-gray-900">Total Students</p>
                          <p className="text-sm text-gray-600">{totalStudents}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        <div>
                          <p className="font-medium text-gray-900">Present</p>
                          <p className="text-sm text-gray-600">{presentCount}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <XCircle className="h-6 w-6 text-red-500" />
                        <div>
                          <p className="font-medium text-gray-900">Absent</p>
                          <p className="text-sm text-gray-600">{totalStudents - presentCount}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {user.role === 'faculty' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Attendance Rate: {Math.round((presentCount / totalStudents) * 100)}%
                      </span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No attendance records found</p>
            <p className="text-sm text-gray-400">
              {user.role === 'faculty' 
                ? 'Start your first attendance session' 
                : 'Attendance records will appear here'}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showQRModal && (user.role === 'faculty' ? <CreateSessionModal /> : <QRCodeModal />)}
    </div>
  );
};

export default Attendance;