import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Waitlist from './Sections/Waitlist/Waitlist';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, subscriptionStatus } = useAuth();
  const navigate = useNavigate();

  // Show loading while checking authentication and subscription status
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

  // If not authenticated, redirect to home page
  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  // If user is on waitlist, show waitlist component
  if (subscriptionStatus === 'no') {
    return <Waitlist />;
  }

  // If user has subscription, show the protected content
  if (subscriptionStatus === 'yes') {
    return children;
  }

  // Default case - show waitlist
  return <Waitlist />;
};

export default ProtectedRoute; 