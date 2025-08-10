import React from 'react';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#000000' }}>
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-white">Terms of Service</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-300 mb-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-gray-300 mb-4">
              By accessing and using Lamis.AI services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-white">Acceptance of Terms</h2>
            <p className="text-gray-300 mb-4">
              By using our platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-white">Use of Services</h2>
            <p className="text-gray-300 mb-4">
              Our services are designed to assist with legal processes and document management. You agree to use our services only for lawful purposes and in accordance with these terms.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-white">User Responsibilities</h2>
            <p className="text-gray-300 mb-4">
              You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You must notify us immediately of any unauthorized use.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-white">Intellectual Property</h2>
            <p className="text-gray-300 mb-4">
              The content, features, and functionality of our platform are owned by Lamis.AI and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-white">Limitation of Liability</h2>
            <p className="text-gray-300 mb-4">
              Lamis.AI provides its services "as is" without warranties of any kind. We are not liable for any damages arising from the use of our services.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-white">Termination</h2>
            <p className="text-gray-300 mb-4">
              We may terminate or suspend your access to our services at any time, with or without cause, with or without notice.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-white">Contact Information</h2>
            <p className="text-gray-300 mb-4">
              For questions about these Terms of Service, please contact us at ops@lamis.ai.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage; 