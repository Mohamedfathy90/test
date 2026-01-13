import React from "react";
import StepCircle from "./StepCircle";
import Box from "../../assets/box.webp";

const Step1DeliveryAddress = ({
  formData,
  handleChange,
  emptyFields,
  setFormData,
  currentStep,
  onNext,
  validateStep1,
}) => {
  return (
    <div className="space-y-5">
      {/* عنوان الخطوة مع الرقم */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
        <h2 className="fs-5">عنوان التسليم</h2>
        <StepCircle stepNumber={1} currentStep={currentStep} />
      </div>

      {/* ================= الهوية الوطنية ================= */}
      <div className="space-y-4 mb-6">
        <div className="border border-blue-500 color-box p-4 border-box">
          <p className="text-sm mb-1">أدخل هوية للتخليص الجمركي</p>
          <p className="text-xs">
            لتجنب أي تأخير في طلبك، يُرجى تقديم هوية صالحة واحدة أدناه.
          </p>
        </div>

        {/* رقم الهوية */}
        <div>
          <label className="block text-sm font-medium mb-2 text-right">
            رقم الهوية
          </label>
          <input
            type="number"
            name="nationalId"
            value={formData.nationalId}
            onChange={handleChange}
            placeholder="أدخل رقم الهوية"
            className={`w-full px-2 py-2 border ${
              emptyFields.includes("nationalId")
                ? "border-red-500"
                : "border-gray-300"
            } focus:outline-none focus:ring-1 focus:ring-black text-right`}
          />
        </div>

        {/* النوع */}
        <div>
          <label className="block text-sm mb-2 text-right">النوع</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, title: "mr" })}
              className={`border py-2 ${
                formData.title === "mr"
                  ? "border-black "
                  : "border-gray-300"
              }`}
            >
              السيد
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, title: "mrs" })}
              className={`border py-2 ${
                formData.title === "mrs"
                  ? "border-black "
                  : "border-gray-300"
              }`}
            >
              السيدة
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, title: "ms" })}
              className={`border py-2 ${
                formData.title === "ms"
                  ? "border-black font-semibold"
                  : "border-gray-300"
              }`}
            >
              آنسة
            </button>
          </div>
        </div>

        <div className="color-box text-xs p-2 border-box">
          أدخل الاسم الأول والأخير كما يظهران في الهوية الوطنية
        </div>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-right">
            الاسم الأول
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-2 py-2 border ${
              emptyFields.includes("firstName")
                ? "border-red-500"
                : "border-gray-300"
            } focus:outline-none focus:ring-1 focus:ring-black text-right`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-right">
            الاسم الأخير
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-2 py-2 border ${
              emptyFields.includes("lastName")
                ? "border-red-500"
                : "border-gray-300"
            } focus:outline-none focus:ring-1 focus:ring-black text-right`}
          />
        </div>
      </div>

      {/* City Dropdown */}
      <div>
        <label className="block text-sm font-medium mb-2 text-right">
          البلد
        </label>
        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="w-full px-2 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black text-right bg-white"
        >
          <option value="الكويت">الكويت</option>
          <option value="الإمارات">الإمارات</option>
          <option value="السعودية">السعودية</option>
          <option value="عمان">عمان</option>
          <option value="البحرين">البحرين</option>
          <option value="قطر">قطر</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-right">
          المدينة
        </label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className={`w-full px-2 py-2 border ${
            emptyFields.includes("city")
              ? "border-red-500"
              : "border-gray-300"
          } focus:outline-none focus:ring-1 focus:ring-black text-right`}
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium mb-2 text-right">
          العنوان
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={`w-full px-2 py-2 border ${
            emptyFields.includes("address")
              ? "border-red-500"
              : "border-gray-300"
          } focus:outline-none focus:ring-1 focus:ring-black text-right`}
        />
      </div>

      {/* Building / Street */}
      <div>
        <label className="block text-sm font-medium mb-2 text-right">
          اسم المبنى / الشقة / رقم الفيلا
        </label>
        <input
          type="text"
          name="building"
          value={formData.building}
          onChange={handleChange}
          className={`w-full px-2 py-2 border ${
            emptyFields.includes("building")
              ? "border-red-500"
              : "border-gray-300"
          } focus:outline-none focus:ring-1 focus:ring-black text-right`}
        />
      </div>

      {/* Phone Number */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-1">
          <label className="block text-sm font-medium mb-2 text-right">
            رمز البلد
          </label>
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            className="w-full px-2 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black text-right"
          >
            <option value="+965"> +965</option>
            <option value="+971"> +971</option>
            <option value="+966"> +966</option>
            <option value="+968"> +968</option>
            <option value="+973"> +973</option>
            <option value="+974"> +974</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-2 text-right">
            رقم الهاتف
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="مثال: 22252184"
            className={`w-full px-2 py-2 border ${
              emptyFields.includes("phone")
                ? "border-red-500"
                : "border-gray-300"
            } focus:outline-none focus:ring-1 focus:ring-black text-right`}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={() => {
          if (validateStep1()) {
            onNext();
          }
        }}
        className="w-full bg-black text-white p-2 py-2 hover:bg-gray-800 transition"
      >
        حفظ ومتابعة
      </button>

      {/* الخطوات القادمة */}
      <div className="mt-8 space-y-4 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between opacity-40">
          <p className="">خيارات التوصيل</p>
          <StepCircle stepNumber={2} currentStep={currentStep} />
        </div>
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

export default Step1DeliveryAddress;
