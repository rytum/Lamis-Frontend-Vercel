import React from 'react';

const Stats = () => {
  return (
    <section id="stats" className="relative w-full min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black py-20 px-4 overflow-hidden">
      {/* Metrics label */}
      <span className="text-[#a59ad6] text-xs mb-6 tracking-[0.3em] font-medium text-center">METRICS</span>
      {/* Title */}
      <h1 className="text-center font-sans font-medium tracking-tight text-gray-900 dark:text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[3.5rem] leading-none mb-10">
        WHAT DO THE NUMBERS SAY?
      </h1>
      <div className="numbers_wrapper grid grid-cols-3 w-full max-w-6xl h-[22rem] mt-16 relative items-center justify-center">
        {/* Left Stat */}
        <div className="flex flex-col items-center justify-center">
          <span className="text-[2.5rem] sm:text-[3rem] font-bold text-[#4c45a5] leading-none">2000+</span>
          <span className="text-gray-600 dark:text-gray-400 text-lg font-light text-center mt-2">Expert Lawyers in Network</span>
        </div>
        {/* Center Stat (faded) */}
        <div className="flex flex-col items-center justify-center">
          <span className="text-[2.5rem] sm:text-[3rem] font-bold text-[#4c45a5] opacity-70 leading-none">3000+</span>
          <span className="text-gray-600 dark:text-gray-400 text-lg font-light text-center mt-2">Total legal queries resolved</span>
        </div>
        {/* Right Stat */}
        <div className="flex flex-col items-center justify-center">
          <span className="text-[2.5rem] sm:text-[3rem] font-bold text-[#4c45a5] leading-none">1500+</span>
          <span className="text-gray-600 dark:text-gray-400 text-lg font-light text-center mt-2">Total User at Legal Care</span>
        </div>
        {/* Diagonal Lines */}
        <div className="numbers_line-wrapper absolute left-1/3 top-0 h-full w-0.5" style={{inset: '0% auto auto 30%', transform: 'rotate(25deg)'}}>
          <div className="w-0.5 h-full bg-gradient-to-b from-[#4c45a5] to-transparent opacity-60"></div>
        </div>
        <div className="numbers_line-wrapper is-right absolute right-1/3 top-0 h-full w-0.5" style={{inset: '0% 30% auto auto', transform: 'rotate(-25deg)'}}>
          <div className="w-0.5 h-full bg-gradient-to-b from-[#4c45a5] to-transparent opacity-60"></div>
        </div>
      </div>
    </section>
  );
};

export default Stats;