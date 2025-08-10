/**
 * Utility functions for handling links in AI responses
 */

/**
 * Enhances HTML content with properly styled clickable links
 * @param {string} htmlContent - The HTML content to process
 * @returns {string} - Enhanced HTML with styled links
 */
export const enhanceLinksInHtml = (htmlContent) => {
  if (!htmlContent) return '';
  
  let result = htmlContent;
  
  // Enhance existing links with better styling
  result = result.replace(
    /<a\s+href="([^"]+)"([^>]*)>/g,
    '<a href="$1"$2 class="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium underline decoration-purple-300 hover:decoration-purple-600 transition-all duration-200" target="_blank" rel="noopener noreferrer">'
  );
  
  // Handle plain URLs that might not be caught by markdown parsers
  result = result.replace(
    /(https?:\/\/[^\s<>"{}|\\^`\[\]]+)/g,
    '<a href="$1" class="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium underline decoration-purple-300 hover:decoration-purple-600 transition-all duration-200" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  
  return result;
};

/**
 * Converts markdown text to HTML with enhanced link handling
 * @param {string} text - The markdown text to convert
 * @returns {string} - HTML with enhanced links
 */
export const convertMarkdownWithLinks = (text) => {
  if (!text) return '';
  
  // Import marked dynamically to avoid SSR issues
  const { marked } = require('marked');
  
  // Parse markdown
  let html = marked.parse(text);
  
  // Enhance links
  html = enhanceLinksInHtml(html);
  
  return html;
};

/**
 * Detects if text contains URLs
 * @param {string} text - The text to check
 * @returns {boolean} - True if text contains URLs
 */
export const containsUrls = (text) => {
  if (!text) return false;
  
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/;
  return urlRegex.test(text);
};

/**
 * Extracts URLs from text
 * @param {string} text - The text to extract URLs from
 * @returns {string[]} - Array of URLs found in the text
 */
export const extractUrls = (text) => {
  if (!text) return [];
  
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g;
  return text.match(urlRegex) || [];
}; 