import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AuthRedirect = ({ children }) => {
  const { isAuthenticated, isLoading, subscriptionStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if we're not loading and user is authenticated
    if (!isLoading && isAuthenticated && subscriptionStatus === 'yes') {
      // Check if we're not already on the AI assistance page
      if (window.location.pathname !== '/ai-assistance') {
        navigate('/ai-assistance');
      }
    }
  }, [isAuthenticated, isLoading, subscriptionStatus, navigate]);

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

  // If user is approved and authenticated, don't render children (will redirect)
  if (isAuthenticated && subscriptionStatus === 'yes') {
    return null;
  }

  // For non-authenticated users or waitlist users, show the children (landing page)
  return children;
};

export default AuthRedirect; 