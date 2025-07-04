import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Clock, 
  Upload, 
  Download, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { Assignment, User, Subject } from '../types';

interface AssignmentsProps {
  assignments: Assignment[];
  user: User;
  subjects: Subject[];
  onCreateAssignment?: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  onSubmitAssignment?: (assignmentId: string, files: string[]) => void;
}

const Assignments: React.FC<AssignmentsProps> = ({ 
  assignments, 
  user, 
  subjects,
  onCreateAssignment,
  onSubmitAssignment 
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (user.role === 'student') {
      const submission = assignment.submissions.find(s => s.studentId === user.id);
      
      switch (selectedFilter) {
        case 'pending':
          return !submission && assignment.status === 'active';
        case 'submitted':
          return submission && submission.status === 'submitted';
        case 'graded':
          return submission && submission.status === 'graded';
        default:
          return true;
      }
    }
    
    return true;
  });

  const getAssignmentStatus = (assignment: Assignment) => {
    if (user.role === 'faculty') {
      const submissionCount = assignment.submissions.length;
      return {
        text: `${submissionCount} submissions`,
        color: 'bg-blue-100 text-blue-800'
      };
    }

    const submission = assignment.submissions.find(s => s.studentId === user.id);
    const isOverdue = new Date(assignment.dueDate) < new Date();

    if (!submission) {
      return {
        text: isOverdue ? 'Overdue' : 'Pending',
        color: isOverdue ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
      };
    }

    if (submission.status === 'graded') {
      return {
        text: `Graded (${submission.marks}/${assignment.maxMarks})`,
        color: 'bg-green-100 text-green-800'
      };
    }

    return {
      text: 'Submitted',
      color: 'bg-blue-100 text-blue-800'
    };
  };

  const CreateAssignmentModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      subjectId: '',
      dueDate: '',
      maxMarks: 50
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (onCreateAssignment) {
        onCreateAssignment({
          ...formData,
          facultyId: user.id,
          submissions: [],
          status: 'active'
        });
      }
      setShowCreateModal(false);
      setFormData({ title: '', description: '', subjectId: '', dueDate: '', maxMarks: 50 });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Create New Assignment</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Marks</label>
                <input
                  type="number"
                  value={formData.maxMarks}
                  onChange={(e) => setFormData({ ...formData, maxMarks: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Assignment
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
        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
        {user.role === 'faculty' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Assignment
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assignments..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {user.role === 'student' && (
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Assignments</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
            </select>
          </div>
        )}
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment) => {
            const subject = subjects.find(s => s.id === assignment.subjectId);
            const status = getAssignmentStatus(assignment);
            const submission = assignment.submissions.find(s => s.studentId === user.id);
            const daysLeft = Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div key={assignment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{subject?.name} ({subject?.code})</p>
                    <p className="text-gray-700 mb-4">{assignment.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today' : 'Overdue'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="h-4 w-4 mr-2" />
                    Max Marks: {assignment.maxMarks}
                  </div>
                </div>

                {submission && submission.status === 'graded' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-800">Grade: {submission.marks}/{assignment.maxMarks}</p>
                        {submission.feedback && (
                          <p className="text-sm text-green-700 mt-1">Feedback: {submission.feedback}</p>
                        )}
                      </div>
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Posted on {new Date(assignment.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    {user.role === 'student' && !submission && assignment.status === 'active' && (
                      <button
                        onClick={() => onSubmitAssignment?.(assignment.id, [])}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Submit
                      </button>
                    )}
                    {user.role === 'faculty' && (
                      <button className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors">
                        <Download className="h-4 w-4 mr-1" />
                        View Submissions ({assignment.submissions.length})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No assignments found</p>
            <p className="text-sm text-gray-400">
              {user.role === 'faculty' 
                ? 'Create your first assignment to get started' 
                : 'Check back later for new assignments'}
            </p>
          </div>
        )}
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && <CreateAssignmentModal />}
    </div>
  );
};

export default Assignments;