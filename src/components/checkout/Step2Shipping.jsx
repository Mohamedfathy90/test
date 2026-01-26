import React from "react";
import StepCircle from "./StepCircle";
import CompletedStepSection from "./CompletedStepSection";

const Step2Shipping = ({
  formData,
  getTitleText,
  completedSteps,
  currentStep,
  onEdit,
  onNext,
}) => {
  return (
    <div className="space-y-5">
      {/* الخطوة 1 المكتملة */}
      <CompletedStepSection
        stepNumber={1}
        title="عنوان التسليم"
        currentStep={currentStep}
        onEdit={() => onEdit(1)}
      >
        {completedSteps.includes(1) && (
          <div className="text-sm text-gray-600 space-y-1 bg-gray-50 p-3 rounded">
            <p>
              <strong>الهوية:</strong> {formData.nationalId}
            </p>
            <p>
              <strong>الاسم:</strong> {getTitleText(formData.title)}{" "}
              {formData.firstName} {formData.lastName}
            </p>
            <p>
              <strong>البلد:</strong> {formData.country}
            </p>
            <p>
              <strong>المدينة:</strong> {formData.city}
            </p>
            <p>
              <strong>العنوان:</strong> {formData.address}
            </p>
            <p>
              <strong>المبنى:</strong> {formData.building}
            </p>
            <p>
              <strong>الهاتف:</strong>  {formData.phone}
            </p>
          </div>
        )}
      </CompletedStepSection>

      {/* الخطوة 2 النشطة */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="">خيارات التوصيل</h2>
        <StepCircle stepNumber={2} currentStep={currentStep} />
      </div>
      <div className="flex flex-col">
        <p className="mb-3 text-paragraph">يتم الشحن من دولة الكويت</p>
        <div className="flex items-center gap-3">
          <input
            type="radio"
            name="shippingOption"
            value="2-6_days"
            checked
            readOnly
            className="w-4 h-4 accent-black border-gray-400"
          />
          <label className="text-sm text-black">
            التوصيل خلال 2-6 أيام عمل
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onNext}
          className="w-full bg-black text-white p-2 py-2 hover:bg-gray-800 transition"
        >
          حفظ ومتابعة
        </button>
      </div>

      {/* الخطوات القادمة */}
      <div className="mt-8 space-y-4 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between opacity-40">
          <p className="text-base font-medium text-gray-500">
            التغليف والهدايا
          </p>
          <StepCircle stepNumber={3} currentStep={currentStep} />
        </div>
        <div className="flex items-center justify-between opacity-40">
          <p className="text-base font-medium text-gray-500">طريقة الدفع</p>
          <StepCircle stepNumber={4} currentStep={currentStep} />
        </div>
      </div>
    </div>
  );
};

export default Step2Shipping;
