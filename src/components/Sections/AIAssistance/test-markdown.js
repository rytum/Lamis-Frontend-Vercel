// Test function to verify markdown parsing
export const testMarkdownParsing = () => {
  const testCases = [
    {
      input: "This is **bold** text",
      expected: "This is <strong>bold</strong> text"
    },
    {
      input: "This is *italic* text",
      expected: "This is <em>italic</em> text"
    },
    {
      input: "This is __bold__ and _italic_ text",
      expected: "This is <strong>bold</strong> and <em>italic</em> text"
    },
    {
      input: "**Bold** and *italic* and `code`",
      expected: "<strong>Bold</strong> and <em>italic</em> and <code>code</code>"
    }
  ];

  const convertMarkdownToHtml = (text) => {
    if (!text) return '';
    
    return text
      // Convert code blocks (`code`)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Convert bold text (**text** or __text__)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      // Convert italic text (*text* or _text_)
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      // Convert headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Convert line breaks
      .replace(/\n/g, '<br />');
  };

  // Run tests silently without console.log
  const results = testCases.map((testCase, index) => {
    const result = convertMarkdownToHtml(testCase.input);
    const passed = result === testCase.expected;
    return {
      testNumber: index + 1,
      passed,
      input: testCase.input,
      expected: testCase.expected,
      result
    };
  });

  return results;
};

// Export for use in components
export default testMarkdownParsing; 