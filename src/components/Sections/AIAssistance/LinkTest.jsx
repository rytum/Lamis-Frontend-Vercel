import React from 'react';
import { enhanceLinksInHtml, convertMarkdownWithLinks } from '../../../utils/linkUtils';

const LinkTest = () => {
  const testCases = [
    {
      title: 'Plain URL',
      input: 'Check out this website: https://example.com for more information.',
      expected: 'Should convert https://example.com to a clickable link'
    },
    {
      title: 'Markdown Link',
      input: 'Visit [Google](https://google.com) for search results.',
      expected: 'Should convert markdown link to clickable link'
    },
    {
      title: 'Multiple URLs',
      input: 'Here are some links: https://github.com and https://stackoverflow.com',
      expected: 'Should convert both URLs to clickable links'
    },
    {
      title: 'Mixed Content',
      input: 'Check out [GitHub](https://github.com) and also visit https://example.com for more info.',
      expected: 'Should handle both markdown links and plain URLs'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Link Handling Test
        </h1>
        
        <div className="space-y-8">
          {testCases.map((testCase, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                {testCase.title}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Input:</h3>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm">
                    {testCase.input}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Enhanced HTML:</h3>
                  <div 
                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm"
                    dangerouslySetInnerHTML={{ 
                      __html: enhanceLinksInHtml(testCase.input) 
                    }}
                  />
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Expected:</h3>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm text-gray-600 dark:text-gray-400">
                    {testCase.expected}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Markdown Conversion Test
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Markdown Input:</h3>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm">
                # Test Heading
                
                This is a **bold** text with a [link](https://example.com).
                
                Here's a plain URL: https://github.com
                
                - List item 1
                - List item 2
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Converted HTML:</h3>
              <div 
                className="bg-gray-100 dark:bg-gray-700 p-3 rounded"
                dangerouslySetInnerHTML={{ 
                  __html: convertMarkdownWithLinks(`# Test Heading

This is a **bold** text with a [link](https://example.com).

Here's a plain URL: https://github.com

- List item 1
- List item 2`) 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkTest; 