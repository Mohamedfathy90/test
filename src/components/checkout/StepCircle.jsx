import React from "react";

const StepCircle = ({ stepNumber, currentStep }) => {
  const isCompleted = currentStep > stepNumber;

  return (
    <div
      className={`
        w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shrink-0 transition-all
        border-1 border-black
        bg-white
        text-black
      `}
    >
      {isCompleted ? "✓" : stepNumber}
    </div>
  );
};

export default StepCircle;
