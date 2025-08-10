import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#000000' }}>
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-white">Privacy Policy</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-300 mb-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-gray-300 mb-4">
              At Lamis.AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-white">Information We Collect</h2>
            <p className="text-gray-300 mb-4">
              We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This may include your name, email address, and other contact information.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-white">How We Use Your Information</h2>
            <p className="text-gray-300 mb-4">
              We use the information we collect to provide, maintain, and improve our services, communicate with you, and ensure the security of our platform.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-white">Information Sharing</h2>
            <p className="text-gray-300 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-white">Data Security</h2>
            <p className="text-gray-300 mb-4">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-white">Your Rights</h2>
            <p className="text-gray-300 mb-4">
              You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-white">Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about this Privacy Policy, please contact us at ops@lamis.ai.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 