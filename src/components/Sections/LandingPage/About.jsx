import React from 'react';
import { animate } from 'framer-motion';

const About = () => {
  // Smooth scroll handler
  const handleGetStarted = () => {
    const target = document.getElementById('features');
    if (target) {
      const startY = window.scrollY;
      const endY = target.getBoundingClientRect().top + window.scrollY;
      animate(startY, endY, {
        duration: 1.1,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (v) => window.scrollTo(0, v),
      });
    }
  };

  return (
    <section id="about" className="relative w-screen h-screen overflow-hidden bg-white dark:bg-black flex flex-col items-center justify-center">
      <div className="relative flex flex-col items-center justify-center w-full h-full">
        <div className="z-10 flex flex-col items-center justify-center px-4" style={{ marginTop: '10rem' }}>
          {/* Reduced brightness of 'OVERVIEW' text gradient start color */}
          <span className="text-sm sm:text-base mb-0 tracking-widest uppercase bg-gradient-to-r from-purple-600 to-gray-900 dark:to-white bg-clip-text text-transparent" style={{ marginTop: '-2rem' }}>Overview</span>
          <h1 className="text-center font-sans font-medium tracking-tight text-gray-900 dark:text-gray-300 text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] leading-none mb-6 sm:mb-8">
            WHAT IS LAMIS AI?
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 max-w-3xl text-xs sm:text-sm md:text-base mb-8 sm:mb-10 leading-relaxed">
          Lamis AI is redefining how people access legal help. From personal issues like family disputes and fraud to workplace questions about HR policies, we make getting legal guidance simple, fast, and accessible. Our platform connects users with real lawyers for personal matters, while our AI chatbot instantly answers workplace queries — all from a phone, anytime. No stress, no legal jargon, just help when it's needed most.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
