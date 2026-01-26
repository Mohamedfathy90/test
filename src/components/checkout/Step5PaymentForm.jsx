import React from "react";
import StepCircle from "./StepCircle";
import CompletedStepSection from "./CompletedStepSection";

const Step5PaymentForm = ({
  formData,
  getTitleText,
  completedSteps,
  currentStep,
  onEdit,
  selectedPaymentMethod,
  finalTotal,
  error,
}) => {
  const getPaymentMethodName = () => {
    if (selectedPaymentMethod === "Card") return "بطاقة ائتمانية / خصم";
    if (selectedPaymentMethod === "ApplePay") return "Apple Pay";
    if (selectedPaymentMethod === "GooglePay") return "Google Pay";
    return selectedPaymentMethod;
  };

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

      {/* الخطوة 2 المكتملة */}
      <CompletedStepSection
        stepNumber={2}
        title="خيارات التوصيل"
        currentStep={currentStep}
        onEdit={() => onEdit(2)}
      >
        {completedSteps.includes(2) && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <p>
              <strong>طريقة الشحن:</strong> التوصيل خلال 2-6 أيام عمل
            </p>
          </div>
        )}
      </CompletedStepSection>

      {/* الخطوة 3 المكتملة */}
      <CompletedStepSection
        stepNumber={3}
        title="التغليف والهدايا"
        currentStep={currentStep}
        onEdit={() => onEdit(3)}
      >
        {completedSteps.includes(3) && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <p>
              <strong>التغليف:</strong> صديق للبيئة
            </p>
          </div>
        )}
      </CompletedStepSection>

      {/* الخطوة 4 المكتملة */}
      <CompletedStepSection
        stepNumber={4}
        title="طريقة الدفع"
        currentStep={currentStep}
        onEdit={() => onEdit(4)}
      >
        {selectedPaymentMethod && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <p>
              <strong>طريقة الدفع:</strong> {getPaymentMethodName()}
            </p>
          </div>
        )}
      </CompletedStepSection>

      {/* الخطوة 5 النشطة */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="">إدخال بيانات الدفع</h2>
        <StepCircle stepNumber={5} currentStep={currentStep} />
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded text-sm mb-4">
          {error}
        </div>
      )}

      {/* Embedded Payment Containers */}
      {selectedPaymentMethod === "Card" && (
        <div className="mb-4">
          <div
            id="card-payment-container"
            className="min-h-[400px] w-full"
            style={{ position: 'relative' }}
          >
            {/* Loading indicator */}
            <div className="flex items-center justify-center min-h-[400px] text-gray-500">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                <p>جاري تحميل فورم الدفع...</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedPaymentMethod === "ApplePay" && (
        <div className="mb-4">
          <div
            id="applepay-payment-container"
            className="min-h-[400px] w-full"
            style={{ position: 'relative' }}
          >
            {/* Loading indicator */}
            <div className="flex items-center justify-center min-h-[400px] text-gray-500">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                <p>جاري تحميل فورم الدفع...</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedPaymentMethod === "GooglePay" && (
        <div className="mb-4">
          <div
            id="googlepay-payment-container"
            className="min-h-[400px] w-full"
            style={{ position: 'relative' }}
          >
            {/* Loading indicator */}
            <div className="flex items-center justify-center min-h-[400px] text-gray-500">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                <p>جاري تحميل فورم الدفع...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-sm text-gray-500 mb-4">
        المبلغ الإجمالي: {finalTotal} د.ك
      </div>
    </div>
  );
};

export default Step5PaymentForm;
