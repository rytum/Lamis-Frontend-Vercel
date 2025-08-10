import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react';

const ThemeToggle = () => {
  const { theme, changeTheme } = useTheme();

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    changeTheme(themes[nextIndex]);
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <IconSun className="h-4 w-4" />;
      case 'dark':
        return <IconMoon className="h-4 w-4" />;
      case 'system':
        return <IconDeviceDesktop className="h-4 w-4" />;
      default:
        return <IconDeviceDesktop className="h-4 w-4" />;
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors duration-200"
      title={`Current theme: ${theme}. Click to cycle through themes.`}
    >
      {getIcon()}
    </button>
  );
};

export default ThemeToggle; 