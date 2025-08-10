import React from 'react';

const steps = [
  { label: 'Defining' },
  { label: 'Structuring' },
  { label: 'Brainstorming' },
  { label: 'Publishing' },
];

const Stepper = ({ currentStep = 1, onStepChange }) => (
  <div className="flex items-center justify-between w-full">
    {steps.map((step, idx) => (
      <div key={step.label} className="flex items-center flex-1 cursor-pointer" onClick={() => onStepChange && onStepChange(idx + 1)}>
        <div className={`flex items-center justify-center rounded-full w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white font-bold text-xs sm:text-sm transition-all duration-200 ${
          idx + 1 === currentStep 
            ? 'bg-purple-600 shadow-lg shadow-purple-600/25' 
            : idx + 1 < currentStep 
              ? 'bg-purple-400' 
              : 'bg-gray-600'
        }`}>
          {idx + 1}
        </div>
        <span className={`ml-1 sm:ml-2 mr-1 sm:mr-2 text-xs sm:text-sm font-semibold transition-colors duration-200 truncate ${
          idx + 1 === currentStep 
            ? 'text-purple-400' 
            : idx + 1 < currentStep 
              ? 'text-purple-300' 
              : 'text-gray-500'
        }`}>
          {step.label}
        </span>
        {idx < steps.length - 1 && (
          <div className={`flex-1 h-0.5 transition-colors duration-200 ${
            idx + 1 < currentStep 
              ? 'bg-purple-400' 
              : 'bg-gray-600'
          }`} />
        )}
      </div>
    ))}
  </div>
);

export default Stepper; 