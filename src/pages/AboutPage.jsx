import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#000000' }}>
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-white">About Us</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-300 mb-4">
              Welcome to Lamis.AI, your trusted partner in legal technology solutions. We are dedicated to revolutionizing the legal industry through innovative AI-powered tools and services.
            </p>
            <p className="text-gray-300 mb-4">
              Our mission is to make legal processes more efficient, accessible, and user-friendly by leveraging cutting-edge artificial intelligence technology. We understand the complexities of legal work and strive to provide solutions that enhance productivity while maintaining the highest standards of accuracy and security.
            </p>
            <p className="text-gray-300 mb-4">
              Whether you're a legal professional, law firm, or individual seeking legal assistance, our platform offers comprehensive tools designed to streamline your legal workflows and improve outcomes.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-white">Our Vision</h2>
            <p className="text-gray-300 mb-4">
              We envision a future where legal technology is accessible to everyone, making justice more efficient and equitable. Our AI-powered platform bridges the gap between complex legal processes and user-friendly interfaces.
            </p>
            <h2 className="text-2xl font-semibold mb-4 text-white">Our Values</h2>
            <ul className="text-gray-300 mb-4 list-disc pl-6">
              <li>Innovation in legal technology</li>
              <li>Accessibility and user-friendliness</li>
              <li>Security and privacy protection</li>
              <li>Accuracy and reliability</li>
              <li>Customer-centric approach</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 