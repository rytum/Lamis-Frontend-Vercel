import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { API_ENDPOINTS } from '../utils/apiConfig';

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
        console.log('Checking subscription status...');
        console.log('Using API endpoint:', API_ENDPOINTS.BACKEND.SAVE_USER);
        
        // First, save the user to get their ID
        const saveResponse = await fetch(API_ENDPOINTS.BACKEND.SAVE_USER, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user }),
        });

        console.log('Save response status:', saveResponse.status);

        if (!saveResponse.ok) {
          const errorText = await saveResponse.text();
          console.error('Save response error:', errorText);
          throw new Error(`Failed to save user: ${saveResponse.status} ${errorText}`);
        }

        const saveData = await saveResponse.json();
        const userId = saveData.user?._id;
        console.log('User saved successfully, ID:', userId);

        if (userId) {
          // Then check their subscription status
          const profileUrl = `${API_ENDPOINTS.BACKEND.BASE}/${userId}`;
          console.log('Fetching profile from:', profileUrl);
          
          const profileResponse = await fetch(profileUrl);
          console.log('Profile response status:', profileResponse.status);
          
          if (profileResponse.ok) {
            const profile = await profileResponse.json();
            console.log('Profile data:', profile);
            setSubscriptionStatus(profile.user.subscription_status);
          } else {
            console.warn('Profile fetch failed, defaulting to waitlist');
            setSubscriptionStatus('no'); // Default to waitlist if can't fetch status
          }
        } else {
          console.warn('No user ID received, defaulting to waitlist');
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