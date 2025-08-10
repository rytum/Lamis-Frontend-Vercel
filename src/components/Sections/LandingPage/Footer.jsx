import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Linkedin, Twitter, Instagram } from 'lucide-react';
const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-black text-gray-900 dark:text-white py-4">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center w-full">
          {/* Left: Logo */}
          <div className="mb-4 md:mb-0 flex-shrink-0">
            <Link to="/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-purple-500 rounded">
              <img
                src="/Lamis-Logo-light6.png"
                alt="Lamis.AI logo"
                width={120}
                height={27}
                className="dark:hidden" />
              <img
                src="/lamis-footer-dark.png"
                alt="Lamis.AI logo"
                width={120}
                height={27}
                className="hidden dark:block" />
            </Link>
          </div>

          {/* Right: All links in a row */}
          <div className="flex flex-wrap justify-center md:justify-end items-center space-x-4 text-xs">
            <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded">
              About
            </Link>
            <Link to="/terms-of-service" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded">
              Terms & Conditions
            </Link>
            <Link to="/privacy-policy" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded">
              Privacy Policy
            </Link>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
            >
              <Linkedin size={14} />
              <span>LinkedIn</span>
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
            >
              <Twitter size={14} />
              <span>Twitter</span>
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
            >
              <Instagram size={14} />
              <span>Instagram</span>
            </a>
            <a 
              href="mailto:info@legalcare.app" 
              className="inline-flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <Mail size={14} />
              <span>info@legalcare.app</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
