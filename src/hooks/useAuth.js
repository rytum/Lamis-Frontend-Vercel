import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const API_BASE_URL = 'https://backend.lamis.ai';

export const useAuth = () => {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!isAuthenticated || !user) {
        setIsChecking(false);
        return;
      }

      try {
        // First, save the user to get their ID
        const saveResponse = await fetch(`${API_BASE_URL}/api/auth0/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user }),
        });

        if (!saveResponse.ok) {
          throw new Error('Failed to save user');
        }

        const saveData = await saveResponse.json();
        const userId = saveData.user?._id;

        if (userId) {
          // Then check their subscription status
          const profileResponse = await fetch(`${API_BASE_URL}/api/auth0/${userId}`);
          if (profileResponse.ok) {
            const profile = await profileResponse.json();
            setSubscriptionStatus(profile.user.subscription_status);
          } else {
            setSubscriptionStatus('no'); // Default to waitlist if can't fetch status
          }
        } else {
          setSubscriptionStatus('no'); // Default to waitlist if no user ID
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
        setSubscriptionStatus('no'); // Default to waitlist on error
      } finally {
        setIsChecking(false);
      }
    };

    checkSubscriptionStatus();
  }, [isAuthenticated, user]);

  return {
    isAuthenticated,
    user,
    isLoading: isLoading || isChecking,
    subscriptionStatus,
    isChecking
  };
}; 