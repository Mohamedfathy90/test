import React from "react";
import StepCircle from "./StepCircle";

const CompletedStepSection = ({
  stepNumber,
  title,
  currentStep,
  onEdit,
  children,
}) => {
  return (
    <div className="pb-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <p className="text-base font-medium text-gray-600">{title}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={onEdit}
            className="text-black hover:underline text-sm"
          >
            تعديل
          </button>
          <StepCircle stepNumber={stepNumber} currentStep={currentStep} />
        </div>
      </div>
      {children}
    </div>
  );
};

export default CompletedStepSection;
