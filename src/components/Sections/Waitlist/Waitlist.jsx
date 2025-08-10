import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuth } from '../../../hooks/useAuth';

export default function Waitlist() {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading, getAccessTokenSilently} = useAuth0();
  const { subscriptionStatus } = useAuth();
  const [syncState, setSyncState] = useState('idle'); // idle | syncing | success | error
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only sync if authenticated, user exists, and not already syncing/success
    if (isAuthenticated && user && syncState === 'idle') {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      setSyncState('syncing');
      fetch(`${API_BASE_URL}/api/auth0/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.message || 'Failed to sync user');
          }
          localStorage.setItem('token', res.token);
          return res.json();
        })
        .then(async (data) => {
          // After saving, fetch the user profile from backend to check subscription_status
          const userId = data.user?._id;
          if (userId) {
            const profileRes = await fetch(`${API_BASE_URL}/api/auth0/${userId}`);
            if (profileRes.ok) {
              const profile = await profileRes.json();
              if (profile.user.subscription_status === 'yes') {
                localStorage.setItem('token', data.token);
                setSyncState('success');
                // Don't navigate automatically - let ProtectedRoute handle it
                return;
              }
              if (profile.user.subscription_status === 'no') {
                setSyncState('waitlist');
                return;
              }
            }
          }
        })
        .catch((err) => {
          setError(err.message);
          setSyncState('error');
        });
    }
  }, [isAuthenticated, user, syncState]);

  if (isLoading || syncState === 'syncing') {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f5f3ff] to-[#ede9fe] dark:from-black dark:to-[#1a1625] px-2 sm:px-4 py-8 sm:py-12 overflow-hidden">
       <div className="w-full max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Section - Status */}
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-full border border-purple-200 dark:border-purple-800">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mr-2 sm:mr-3"></div>
                  <span className="text-xs sm:text-sm font-medium text-purple-700 dark:text-purple-300">Account Synchronization</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  Setting up your
                  <span className="block text-[#4c45a5]">LegalCare account</span>
                </h1>
                <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  We're securely configuring your account and verifying your credentials. This process ensures the highest level of security for your legal data.
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Authentication verified</span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Configuring account settings</span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gray-400 rounded-full"></div>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">Finalizing setup</span>
                </div>
              </div>
            </div>

            {/* Right Section - Visual */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-44 h-44 sm:w-64 sm:h-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                  <div className="w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (syncState === 'success') {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f5f3ff] to-[#ede9fe] dark:from-black dark:to-[#1a1625] px-2 sm:px-4 py-8 sm:py-12 overflow-hidden">
        <div className="w-full max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Section - Success */}
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-300">Account Setup Complete</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  Welcome to
                  <span className="block text-[#4c45a5]">LegalCare!</span>
                </h1>
                <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Your account has been successfully configured. You're now ready to experience AI-powered legal assistance.
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Account created successfully</span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Security settings configured</span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Ready to get started</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    if (subscriptionStatus === 'yes') {
                      navigate('/ai-assistance');
                    } else {
                      window.location.reload();
                    }
                  }}
                  className="bg-[#4c45a5] text-white px-6 py-3 rounded-lg hover:bg-[#3a3480] transition-colors font-medium"
                >
                  Start Using LegalCare
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="border border-[#4c45a5] text-[#4c45a5] px-6 py-3 rounded-lg hover:bg-[#4c45a5] hover:text-white transition-colors font-medium"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Section - Visual */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-44 h-44 sm:w-64 sm:h-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                  <div className="w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16 sm:w-24 sm:h-24 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (syncState === 'waitlist') {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f5f3ff] to-[#ede9fe] dark:from-black dark:to-[#1a1625] px-2 sm:px-4 py-8 sm:py-12 overflow-hidden">
        <div className="w-full max-w-2xl mx-auto">
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-full border border-yellow-200 dark:border-yellow-800">
                <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-xs sm:text-sm font-medium text-yellow-700 dark:text-yellow-300">On Waitlist</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                You're on the
                <span className="block text-[#4c45a5]">Waitlist!</span>
              </h1>
              <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Thank you for your interest in LegalCare! We're currently reviewing applications and will notify you via email once your account is approved.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Account created successfully</span>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gray-400 rounded-full"></div>
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">Approval notification pending</span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">What happens next?</h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 dark:text-blue-400">•</span>
                  <span>Our team will review your application within 24-48 hours</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 dark:text-blue-400">•</span>
                  <span>You'll receive an email notification once approved</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 dark:text-blue-400">•</span>
                  <span>Once approved, you can access all LegalCare features</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/')}
                className="bg-[#4c45a5] text-white px-6 py-3 rounded-lg hover:bg-[#3a3480] transition-colors font-medium"
              >
                Learn More About LegalCare
              </button>
              <button
                onClick={() => window.location.reload()}
                className="border border-[#4c45a5] text-[#4c45a5] px-6 py-3 rounded-lg hover:bg-[#4c45a5] hover:text-white transition-colors font-medium"
              >
                Check Status
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (syncState === 'error') {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f5f3ff] to-[#ede9fe] dark:from-black dark:to-[#1a1625] px-2 sm:px-4 py-8 sm:py-12 overflow-hidden">
        <div className="w-full max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Section - Error */}
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-full border border-red-200 dark:border-red-800">
                  <svg className="w-4 h-4 text-red-600 dark:text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs sm:text-sm font-medium text-red-700 dark:text-red-300">Setup Error</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  Setup
                  <span className="block text-red-600">Failed</span>
                </h1>
                <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  We encountered an issue while setting up your account. Please try again or contact support if the problem persists.
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Error: {error}
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Troubleshooting Steps:</h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-start space-x-2 sm:space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">1</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Try the setup process again</span>
                  </li>
                  <li className="flex items-start space-x-2 sm:space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">2</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Check your internet connection</span>
                  </li>
                  <li className="flex items-start space-x-2 sm:space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">3</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Contact support if issues persist</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-[#4c45a5] text-white px-6 py-3 rounded-lg hover:bg-[#3a3480] transition-colors font-medium"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="border border-[#4c45a5] text-[#4c45a5] px-6 py-3 rounded-lg hover:bg-[#4c45a5] hover:text-white transition-colors font-medium"
                >
                  Go Home
                </button>
              </div>
            </div>

            {/* Right Section - Visual */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-44 h-44 sm:w-64 sm:h-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                  <div className="w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16 sm:w-24 sm:h-24 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
}