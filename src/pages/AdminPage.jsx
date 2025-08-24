import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Settings, BarChart3, FileText, Database } from 'lucide-react';

const AdminPage = () => {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const navigate = useNavigate();

  // Check if user has admin privileges (you can customize this logic)
  const isAdmin = user?.email === 'admin@example.com' || user?.sub?.includes('admin');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f3ff] to-[#ede9fe] dark:from-black dark:to-[#1a1625]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f3ff] to-[#ede9fe] dark:from-black dark:to-[#1a1625]">
        <div className="text-center max-w-md mx-auto p-6">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <button
            onClick={() => navigate('/ai-assistance')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go to AI Assistance
          </button>
        </div>
      </div>
    );
  }

  const adminFeatures = [
    {
      title: 'User Management',
      description: 'Manage user accounts, permissions, and subscriptions',
      icon: Users,
      color: 'bg-blue-500',
      href: '#'
    },
    {
      title: 'System Settings',
      description: 'Configure application settings and preferences',
      icon: Settings,
      color: 'bg-green-500',
      href: '#'
    },
    {
      title: 'Analytics Dashboard',
      description: 'View system usage statistics and performance metrics',
      icon: BarChart3,
      color: 'bg-purple-500',
      href: '#'
    },
    {
      title: 'Content Management',
      description: 'Manage documents, templates, and system content',
      icon: FileText,
      color: 'bg-orange-500',
      href: '#'
    },
    {
      title: 'Database Management',
      description: 'Monitor and manage database operations',
      icon: Database,
      color: 'bg-red-500',
      href: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f3ff] to-[#ede9fe] dark:from-black dark:to-[#1a1625]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Shield className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Super Admin Dashboard</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back, {user?.name}. Manage your system from this central dashboard.
          </p>
        </div>

        {/* Admin Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {feature.description}
              </p>
              <button
                onClick={() => window.open(feature.href, '_blank')}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
              >
                Access Feature →
              </button>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">1,234</div>
            <div className="text-gray-600 dark:text-gray-300">Total Users</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">567</div>
            <div className="text-gray-600 dark:text-gray-300">Active Sessions</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">89</div>
            <div className="text-gray-600 dark:text-gray-300">Documents Created</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">99.9%</div>
            <div className="text-gray-600 dark:text-gray-300">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;



