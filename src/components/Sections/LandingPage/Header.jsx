import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuth } from '../../../hooks/useAuth';

const Header = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const { subscriptionStatus } = useAuth();

  const handleTryNow = async () => {
    if (!isAuthenticated) {
      await loginWithRedirect({
        appState: { returnTo: '/waitlist' },
      });
    } else {
      // If user is approved, redirect directly to AI assistance
      if (subscriptionStatus === 'yes') {
        navigate('/ai-assistance');
      } else {
        // If user is on waitlist, go to waitlist page
        navigate('/waitlist');
      }
    }
  };
  return (
    <section
      id="header"
      className="hero_content-wrapper relative w-screen min-h-screen flex flex-col items-center justify-center text-center bg-white dark:bg-black text-black dark:text-white font-[Roboto,sans-serif] py-20"
      style={{
        perspective: '40rem',
        zIndex: 1,
        position: 'relative',
      }}
    >
      <div className="flex flex-col items-center w-full min-h-screen gap-12 md:gap-[3rem] lg:gap-[4rem] justify-center px-4">
        <div className="space-y-8">
          <h1 className="font-[Open_Sans,sans-serif] font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-black to-purple-600 dark:from-white dark:to-purple-400 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-tight">
            LAMIS.AI - YOUR LEGAL AI ASSISTANT
          </h1>
          <p className="font-[Lato,sans-serif] font-semibold text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto tracking-wide">
            BUILT FOR LITIGATORS BY LITIGATORS
          </p>
        </div>
        {/* Button with oval shape */}
        <div className="flex flex-col items-center gap-6">
          <div className="p-[2px] rounded-full bg-gradient-to-r from-purple-600 to-gray-800 dark:from-purple-800 dark:to-black shadow-lg">
            <button
              className="px-10 py-4 rounded-full bg-white dark:bg-black text-black dark:text-white text-lg sm:text-xl hover:bg-purple-100 dark:hover:bg-purple-900 hover:text-purple-900 dark:hover:text-white transition-all duration-200 w-full h-full font-bold font-[Roboto,sans-serif]"
              onClick={handleTryNow}
            >
              Try Now
            </button>
          </div>
        </div>
      </div>
      {/* Glowing arc at the bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120vw] h-40 pointer-events-none">
        <div className="w-full h-full rounded-t-full bg-gradient-to-t from-purple-500/30 dark:from-purple-500/30 to-transparent blur-2xl opacity-100" />
      </div>
    </section>
  );
};

export default Header;