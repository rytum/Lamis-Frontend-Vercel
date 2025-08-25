import React, { useState, useRef } from 'react';

const FeaturesSectionDemo = () => {
  const comingSoonCards = [
    {
      
      description: "Something revolutionary is brewing. Stay tuned."
    },
    {
      description: "Get ready for a game-changing feature that will transform your experience."
    },
    {
      
      description: "Innovation in progress. Details coming soon."
    },
    {
      description: "The future of legal technology is almost here."
    },
  ];

  return (
    <section id="features" className="w-screen min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 snap-start">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <span className="text-purple-600 dark:text-purple-300 text-sm sm:text-base mb-2 tracking-widest uppercase">Features</span>
        <h2 className="text-gray-900 dark:text-white font-sans font-medium text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
          REVOLUTIONARY FEATURES
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl mt-6 max-w-3xl mx-auto">
          We're building something extraordinary. Stay tuned for the unveiling of our cutting-edge legal technology platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {comingSoonCards.map((card, index) => (
          <ComingSoonCard key={index} card={card} />
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <div className="inline-flex items-center space-x-2 bg-purple-600/10 dark:bg-purple-300/10 px-6 py-3 rounded-full">
          <div className="w-2 h-2 bg-purple-600 dark:bg-purple-300 rounded-full animate-pulse"></div>
          <span className="text-purple-600 dark:text-purple-300 font-medium text-sm">
            Coming Soon
          </span>
        </div>
      </div>
    </section>
  );
};

// Separate component for each coming soon card
const ComingSoonCard = ({ card }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  // Handle mouse movement to update cursor position relative to the card
  const handleMouseMove = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div
      ref={cardRef}
      className="relative p-[4px] rounded-3xl overflow-hidden group"
      onMouseMove={handleMouseMove}
      style={{
        background: `radial-gradient(circle 10rem at ${mousePosition.x}px ${mousePosition.y}px, 
                       rgba(88, 28, 135, 0.3),
                       rgba(107, 33, 168, 0.2),
                       rgba(76, 69, 165, 0.1),
                       rgba(76, 69, 165, 0))`,
        backgroundOrigin: 'padding-box',
        transition: 'background 400ms ease',
      }}
    >
      <div className="relative flex flex-col items-center justify-center p-4 sm:p-6 bg-white dark:bg-black rounded-[22px] h-full text-center">
        <div className="mb-4">
          <div className="w-12 h-12 bg-purple-600/20 dark:bg-purple-300/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <h4 className="text-gray-900 dark:text-white text-xl sm:text-2xl font-medium mb-3">
          {card.title}
        </h4>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base font-light leading-relaxed">
          {card.description}
        </p>
      </div>
    </div>
  );
};

export default FeaturesSectionDemo;

