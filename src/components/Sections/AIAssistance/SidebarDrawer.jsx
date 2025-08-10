import React from 'react';
import MergedSidebar from './MergedSidebar';
import { useAuth0 } from '@auth0/auth0-react';

const SidebarDrawer = ({ open, onClose, onNewChat, refreshHistory, onDeleteSession, onClearHistory }) => {
  const { user } = useAuth0();

  return (
    <div
      className={`fixed inset-0 z-30 transition-transform transform ${
        open ? 'translate-x-0' : '-translate-x-full'
      } md:hidden`}
    >
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div className="relative flex h-full max-w-xs w-full bg-white dark:bg-neutral-900 shadow-xl">
        <MergedSidebar 
          onNewChat={onNewChat} 
          refreshHistory={refreshHistory} 
          userId={user ? user.sub : ''} 
          onDeleteSession={onDeleteSession}
          onClearHistory={onClearHistory}
        />
      </div>
    </div>
  );
};

export default SidebarDrawer; 