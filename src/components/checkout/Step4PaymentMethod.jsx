import React from "react";
import StepCircle from "./StepCircle";
import CompletedStepSection from "./CompletedStepSection";

import KnetImg from "../../assets/knet-card.svg";
import PaypalImg from "../../assets/paypal-card.svg";
import AmexImg from "../../assets/checkout-creditcard.svg";
import AppleImg from "../../assets/apple-pay-logo-icon.png";
import TabbyImg from "../../assets/payment-method-tabby.svg";

const Step4PaymentMethod = ({
  formData,
  getTitleText,
  completedSteps,
  currentStep,
  onEdit,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  onNext,
  loading,
  error,
}) => {
  return (
    <div className="space-y-5 pb-32 lg:pb-5">
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

      {/* الخطوة 4 النشطة */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="">طريقة الدفع</h2>
        <StepCircle stepNumber={4} currentStep={currentStep} />
      </div>

      {/* طرق الدفع */}
      <div className="space-y-3 mb-6">
        {/* الدفع بواسطة كي نت */}

        <div
          className="flex items-center gap-3 p-3 border-b border-gray-300  cursor-pointer hover:bg-gray-50"
          // onClick={() => setSelectedPaymentMethod("KNet")}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="KNet"
            // checked={selectedPaymentMethod === "KNet"}
            // onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            className="w-4 h-4 accent-black"
          />
          <img src={KnetImg} alt="K-Net" className="h-6" />
          <label className="flex-1 cursor-pointer text-sm font-medium">
            الدفع بواسطة كي نت
          </label>
        </div>

        {/* الدفع بواسطة باي بال */}
        <div
          className="flex items-center gap-3 p-3 border-b border-gray-300  cursor-pointer hover:bg-gray-50"
          // onClick={() => setSelectedPaymentMethod("PayPal")}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="PayPal"
            // checked={selectedPaymentMethod === "PayPal"}
            // onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            className="w-4 h-4 accent-black"
          />
          <img src={PaypalImg} alt="PayPal" className="h-6" />
          <label className="flex-1 cursor-pointer text-sm font-medium">
            الدفع بواسطة باي بال
          </label>
        </div>

        {/* بطاقة ائتمانية / خصم */}
        <div
          className="flex items-center gap-3 p-3 border-b border-gray-300"
          onClick={() => setSelectedPaymentMethod("Card")}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="Card"
            checked={selectedPaymentMethod === "Card"}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            className="w-4 h-4 accent-black"
          />

          <img src={AmexImg} alt="Credit Cards" className="h-6" />
        </div>
        {/* Apple Pay */}
        <div
          className="flex items-center gap-3 p-3 border-b border-gray-300  cursor-pointer hover:bg-gray-50"
          onClick={() => setSelectedPaymentMethod("ApplePay")}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="ApplePay"
            checked={selectedPaymentMethod === "ApplePay"}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            className="w-4 h-4 accent-black"
          />
          <img src={AppleImg} alt="Apple Pay" className="h-6" />
          <label className="flex-1 cursor-pointer text-sm font-medium">
            Apple Pay
          </label>
        </div>

        {/* الدفع عند الاستلام */}
        <div
          className="flex items-center gap-3 p-3 border-b border-gray-300  cursor-pointer hover:bg-gray-50"
          // onClick={() => setSelectedPaymentMethod("COD")}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="COD"
            // checked={selectedPaymentMethod === "COD"}
            // onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            className="w-4 h-4 accent-black"
          />
          <img src={TabbyImg} alt="Tabby" className="h-6" />
          <label className="flex-1 cursor-pointer text-sm font-medium">
            الدفع على 4 أقساط بدون فوائد
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
          {error}
        </div>
      )}

      <button
        onClick={onNext}
        disabled={loading || !selectedPaymentMethod}
        className="w-full bg-black text-white py-3 font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition"
      >
        {loading ? "جاري التحميل..." : "اطلب الان "}
      </button>
    </div>
  );
};

export default Step4PaymentMethod;
