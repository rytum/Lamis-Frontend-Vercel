"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState, useRef, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { IconSun, IconMoon, IconDeviceDesktop, IconArrowLeft } from '@tabler/icons-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLocation, Link } from "react-router-dom";

export function NavbarDemo() {
  const landingPageNavItems = [
    {
      name: "About",
      link: "#about",
    },
    {
      name: "Stats",
      link: "#stats",
    },
    {
      name: "Feature",
      link: "#features",
    },
    {
      name: "Workflow",
      link: "/workflow",
    },
    {
      name: "Stories",
      link: "#testimonials",
    },
    {
      name: "Contact",
      link: "#Footer",
    },
  ];

  const featureNavItems = [
    {
      name: "AI Assistance",
      link: "/ai-assistance",
    },
    {
      name: "Docs Interaction",
      link: "/docs-interaction/upload",
    },
    {
      name: "Documents Drafting",
      link: "/documents-drafting",
    },
    {
      name: "Vault",
      link: "/vault",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const avatarRef = useRef(null);
  const popupRef = useRef(null);
  const { isAuthenticated, user, isLoading, loginWithRedirect, logout } = useAuth0();
  const { theme, changeTheme } = useTheme();
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const isWorkflowPage = location.pathname === "/workflow" || location.pathname === "/workflow-panels";

  const themeOptions = [
    { id: 'light', label: 'Light', icon: <IconSun className="h-4 w-4 mr-2" /> },
    { id: 'dark', label: 'Dark', icon: <IconMoon className="h-4 w-4 mr-2" /> },
    { id: 'system', label: 'System', icon: <IconDeviceDesktop className="h-4 w-4 mr-2" /> },
  ];

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <IconSun className="h-5 w-5" />;
      case 'dark':
        return <IconMoon className="h-5 w-5" />;
      case 'system':
      default:
        return <IconDeviceDesktop className="h-5 w-5" />;
    }
  };

  // Function to handle Auth0 login redirect
  const handleLogin = () => {
    loginWithRedirect();
  };

  // Function to handle logout
  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    // Proceed with Auth0 logout
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  // Helper to get user initial
  const getUserInitial = (user) => {
    if (!user) return '?';
    if (user.given_name) return user.given_name.charAt(0).toUpperCase();
    if (user.name) return user.name.charAt(0).toUpperCase();
    return '?';
  };

  // Close popup when clicking outside
  useEffect(() => {
    if (!showProfilePopup) return;
    function handleClickOutside(event) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setShowProfilePopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfilePopup]);

  // Close theme dropdown when clicking outside
  const themeDropdownRef = useRef(null);
  useEffect(() => {
    if (!showThemeDropdown) return;
    function handleClickOutside(event) {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target)) {
        setShowThemeDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showThemeDropdown]);

  // Profile popup component
  const ProfilePopup = () => (
    <div ref={popupRef} className="absolute right-0 mt-3 w-64 bg-white dark:bg-black border border-black dark:border-purple-800 rounded-xl shadow-xl z-50 p-0 flex flex-col items-center animate-fade-in">
      {/* Caret/arrow */}
      <div className="absolute -top-2 right-6 w-4 h-4 bg-white dark:bg-black border-t border-l border-black dark:border-purple-800 rotate-45 z-10"></div>
      <div className="w-full flex flex-col items-center p-5 pb-3">
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name || 'User'}
            className="h-14 w-14 rounded-full border border-black dark:border-purple-700 object-cover mb-2 shadow-sm"
          />
        ) : (
          <span className="h-14 w-14 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold text-2xl border border-black dark:border-purple-700 mb-2 shadow-sm">
            {getUserInitial(user)}
          </span>
        )}
        <span className="font-semibold text-black dark:text-white text-lg mt-1">{user.name}</span>
        <span className="text-purple-600 dark:text-purple-300 text-xs mt-0.5">{user.email}</span>
      </div>
      <div className="w-full border-t border-black dark:border-purple-800 my-0" />
      <button
        onClick={handleLogout}
        className="w-full px-6 py-3 text-center text-sm font-medium text-purple-600 hover:text-white hover:bg-purple-600 dark:hover:bg-purple-700 transition rounded-b-xl"
        style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
      >
        Logout
      </button>
    </div>
  );

  return (
    <div className="relative w-full" style={{ zIndex: 50 }}>
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          {isLandingPage ? (
            <>
              <NavbarLogo />
              <NavItems items={landingPageNavItems} />
              <div className="flex items-center gap-4 relative">
                {/* Theme toggle button */}
                <div className="relative">
                  <button
                    className="p-2 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 text-black dark:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onClick={() => setShowThemeDropdown((v) => !v)}
                    title="Change theme"
                  >
                    {getThemeIcon()}
                  </button>
                  {showThemeDropdown && (
                    <div ref={themeDropdownRef} className="absolute right-0 mt-2 w-40 bg-white dark:bg-black border border-black dark:border-purple-800 rounded-lg shadow-lg z-50 py-2 animate-fade-in">
                      {themeOptions.map((opt) => (
                        <button
                          key={opt.id}
                          className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors ${theme === opt.id ? 'font-semibold text-purple-600 dark:text-purple-400' : 'text-black dark:text-purple-300'}`}
                          onClick={() => { changeTheme(opt.id); setShowThemeDropdown(false); }}
                        >
                          {opt.icon} {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {!isAuthenticated && !isLoading && (
                  <NavbarButton variant="secondary" onClick={handleLogin}>Login</NavbarButton>
                )}
                {isAuthenticated && user && (
                  <div className="relative">
                    {user.picture ? (
                      <img
                        ref={avatarRef}
                        src={user.picture}
                        alt={user.name || 'User'}
                        className="h-8 w-8 rounded-full border border-black dark:border-purple-700 object-cover cursor-pointer"
                        title={user.name}
                        onClick={() => setShowProfilePopup((v) => !v)}
                      />
                    ) : (
                      <span
                        ref={avatarRef}
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold text-base border border-black dark:border-purple-700 cursor-pointer"
                        onClick={() => setShowProfilePopup((v) => !v)}
                      >
                        {getUserInitial(user)}
                      </span>
                    )}
                    {showProfilePopup && <ProfilePopup />}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {isWorkflowPage ? (
                <div className="flex items-center justify-between w-full ml-6">
                  <Link
                    to="/"
                    className="p-2 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 text-black dark:text-purple-300"
                    title="Back to home"
                  >
                    <IconArrowLeft className="h-5 w-5" />
                  </Link>
                  <NavbarLogo />
                  {/* spacer to balance the centered logo */}
                  <div className="w-9" />
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <NavbarLogo />
                </div>
              )}
            </>
          )}
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <div className="flex items-center gap-2">
              {isWorkflowPage && (
                <Link
                  to="/"
                  className="p-2 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 text-black dark:text-purple-300"
                  title="Back to home"
                >
                  <IconArrowLeft className="h-5 w-5" />
                </Link>
              )}
              <NavbarLogo />
            </div>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {isLandingPage && landingPageNavItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-black dark:text-purple-300">
                <span className="block">{item.name}</span>
              </a>
            ))}
            {!isLandingPage && featureNavItems.map((item, idx) => (
              <a
                key={`mobile-feature-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-black dark:text-purple-300">
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4 items-center">
              {/* Theme toggle for mobile */}
              <div className="flex items-center gap-2 w-full justify-center">
                <span className="text-sm text-black dark:text-purple-300">Theme:</span>
                <div className="flex gap-1">
                  {themeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      className={`p-2 rounded-md text-sm transition-colors ${
                        theme === opt.id 
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
                          : 'text-black dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                      }`}
                      onClick={() => { changeTheme(opt.id); }}
                      title={opt.label}
                    >
                      {opt.icon}
                    </button>
                  ))}
                </div>
              </div>
              
              {!isAuthenticated && !isLoading && (
                <NavbarButton
                  onClick={() => { setIsMobileMenuOpen(false); handleLogin(); }}
                  variant="secondary"
                  className="w-full">
                  Login
                </NavbarButton>
              )}
              {isAuthenticated && user && (
                <div className="relative w-full flex flex-col items-center">
                  {user.picture ? (
                    <img
                      ref={avatarRef}
                      src={user.picture}
                      alt={user.name || 'User'}
                      className="h-8 w-8 rounded-full border border-black dark:border-purple-700 object-cover cursor-pointer mx-auto"
                      title={user.name}
                      onClick={() => setShowProfilePopup((v) => !v)}
                    />
                  ) : (
                    <span
                      ref={avatarRef}
                      className="h-8 w-8 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold text-base border border-black dark:border-purple-700 cursor-pointer mx-auto"
                      onClick={() => setShowProfilePopup((v) => !v)}
                    >
                      {getUserInitial(user)}
                    </span>
                  )}
                  {showProfilePopup && <ProfilePopup />}
                </div>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
