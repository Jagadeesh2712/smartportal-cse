import React, { useState } from 'react';
import { 
  Home, 
  FileText, 
  Clock, 
  FolderOpen, 
  BarChart3, 
  Calendar,
  Award,
  Users
} from 'lucide-react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Assignments from './components/Assignments';
import Attendance from './components/Attendance';
import Projects from './components/Projects';
import NotificationPanel from './components/NotificationPanel';
import { 
  mockUsers, 
  mockSubjects, 
  mockAssignments, 
  mockAttendance, 
  mockExams, 
  mockProjects, 
  mockNotifications,
  mockInternalMarks 
} from './data/mockData';
import { User, Notification } from './types';

type TabType = 'dashboard' | 'assignments' | 'attendance' | 'projects' | 'analytics' | 'exams';

function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [user] = useState<User>(mockUsers[0]); // Default to student user
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleMarkNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleLogout = () => {
    alert('Logout functionality would be implemented here');
  };

  const handleProfileClick = () => {
    alert('Profile settings would be implemented here');
  };

  const sidebarItems = user.role === 'student' ? [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'exams', label: 'Exams & Results', icon: Award },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ] : [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'analytics', label: 'Class Analytics', icon: BarChart3 },
    { id: 'exams', label: 'Exams', icon: Calendar }
  ];

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <Dashboard 
            user={user} 
            assignments={mockAssignments}
            attendance={mockAttendance}
            exams={mockExams}
            internalMarks={mockInternalMarks}
          />
        );
      case 'assignments':
        return (
          <Assignments 
            assignments={mockAssignments} 
            user={user}
            subjects={mockSubjects}
          />
        );
      case 'attendance':
        return (
          <Attendance 
            attendance={mockAttendance}
            user={user}
            subjects={mockSubjects}
          />
        );
      case 'projects':
        return (
          <Projects 
            projects={mockProjects}
            user={user}
          />
        );
      case 'analytics':
        return (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Analytics Dashboard</p>
            <p className="text-sm text-gray-400">Coming soon...</p>
          </div>
        );
      case 'exams':
        return (
          <div className="text-center py-12">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Exams & Results</p>
            <p className="text-sm text-gray-400">Coming soon...</p>
          </div>
        );
      default:
        return (
          <Dashboard 
            user={user} 
            assignments={mockAssignments}
            attendance={mockAttendance}
            exams={mockExams}
            internalMarks={mockInternalMarks}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        user={user}
        notifications={unreadNotifications}
        onNotificationClick={() => setIsNotificationPanelOpen(true)}
        onProfileClick={handleProfileClick}
        onLogout={handleLogout}
      />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
            <div className="flex items-center flex-shrink-0 px-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
            </div>
            <div className="flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id as TabType)}
                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg w-full text-left transition-all duration-200 ${
                      currentTab === item.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${
                      currentTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-4 md:p-6">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="grid grid-cols-4 gap-1">
          {sidebarItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id as TabType)}
              className={`flex flex-col items-center px-2 py-2 text-xs font-medium transition-colors ${
                currentTab === item.id
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600'
              }`}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        notifications={notifications}
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
      />
    </div>
  );
}

export default App;