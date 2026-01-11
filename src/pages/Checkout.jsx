import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getSessionId } from "../utils/SessionId";
import CheckoutHeader from "../components/CheckoutHeader";
import CheckoutOrderSummary from "../components/CheckoutOrderSummary";
import Box from "../assets/box.webp";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionId = getSessionId();

  const cartItems = location.state?.cartItems || [];

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emptyFields, setEmptyFields] = useState([]);

  // إضافة state للخطوات المكتملة
  const [completedSteps, setCompletedSteps] = useState([]);

  const [formData, setFormData] = useState({
    shippingMethod: "standard",
    firstName: "",
    lastName: "",
    city: "",
    address: "",
    building: "",
    country: "الكويت",
    countryCode: "+965",
    phone: "",
    giftWrap: false,
    nationalId: "",
    title: "mr",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // إزالة الحقل من قائمة الحقول الفارغة إذا تم ملؤه
    if (emptyFields.includes(name) && value.trim() !== "") {
      setEmptyFields(prev => prev.filter(field => field !== name));
    }
  };

  /* ================= SUBTOTAL ================= */
  const subtotal = cartItems.reduce((total, item) => {
    const price =
      parseFloat(item.price_after) ||
      parseFloat(item.original_price) ||
      parseFloat(item.price_before) ||
      0;
    return total + price * item.quantity;
  }, 0);

  const taxAmount = (subtotal * 0.05).toFixed(3);
  const finalTotal = (subtotal + parseFloat(taxAmount)).toFixed(3);

  /* ================= VALIDATION ================= */
const validateStep1 = () => {
  const requiredFields = [
    "firstName",
    "lastName",
    "city",
    "address",
    "building",
    "phone",
    "nationalId",
  ];

  const empty = requiredFields.filter(
    (field) => !formData[field] || formData[field].trim() === ""
  );

  if (empty.length > 0) {
    setEmptyFields(empty);
    setError("يرجى ملء جميع الحقول المطلوبة");
    return false;
  }

  setEmptyFields([]);
  setError("");
  return true;
};


  // دالة لحفظ الخطوة كمكتملة
  const saveAndContinue = (stepNumber) => {
    if (!completedSteps.includes(stepNumber)) {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  // دالة للرجوع للتعديل
  const editStep = (stepNumber) => {
    setCurrentStep(stepNumber);
  };

  // دالة لعرض النص بحسب النوع
  const getTitleText = (title) => {
    if (title === "mr") return "السيد";
    if (title === "mrs") return "السيدة";
    if (title === "ms") return "آنسة";
    return title;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!sessionId) {
      setError("خطأ في الجلسة");
      return;
    }

    setLoading(true);
    setError("");

    const items = cartItems.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      size: item.size || "",
      price:
        parseFloat(item.price_after) ||
        parseFloat(item.original_price) ||
        parseFloat(item.price_before) ||
        0,
    }));

    const payload = {
      session_id: sessionId,
      first_name: formData.firstName,
      last_name: formData.lastName,
      country: formData.country, 
      city: formData.city,
      address: formData.address,
      building: formData.building,
      phone: formData.phone,  
      country_code: formData.countryCode,
      national_id: formData.nationalId,
      title: formData.title,
      total_price: finalTotal,
      items,
    };
    // ✅ اطبع الـ payload علشان تتأكد من البيانات
    console.log("Payload being sent:", payload);
    try {
      const res = await axios.post(
        "https://blomengdalis-tester.com/backend/create_invoice.php",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
          console.log("Response received:", res.data);


      if (res.data?.payment_url) {
        window.location.href = res.data.payment_url;
      } else {
        setError("فشل إنشاء الفاتورة");
      }
    } catch {
      setError("حدث خطأ أثناء الدفع");
    } finally {
      setLoading(false);
    }
  };

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


  return (
    <div dir="rtl" className="min-h-screen bg-white ">
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* LEFT */}
        <div className="lg:col-span-2">
          <CheckoutHeader />

          <div className="px-4 py-6 max-w-2xl mx-auto">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            {/* STEP 1 - عنوان التسليم */}
            {currentStep === 1 && (
              <div className="space-y-5">
                {/* عنوان الخطوة مع الرقم */}
                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                  <h2 className="fs-5">عنوان التسليم</h2>
                  <StepCircle stepNumber={1} currentStep={currentStep} />
                </div>

                {/* ================= الهوية الوطنية ================= */}
                <div className="space-y-4 mb-6">
                  <div className="border border-blue-500 color-box p-4 border-box">
                    <p className="text-sm  mb-1 ">أدخل هوية للتخليص الجمركي</p>
                    <p className="text-xs ">
                      لتجنب أي تأخير في طلبك، يُرجى تقديم هوية صالحة واحدة
                      أدناه.
                    </p>
                  </div>

                  {/* رقم الهوية */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-right ">
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
                    <label className="block text-sm  mb-2 text-right">
                      النوع
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, title: "mr" })
                        }
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
                        onClick={() =>
                          setFormData({ ...formData, title: "mrs" })
                        }
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
                        onClick={() =>
                          setFormData({ ...formData, title: "ms" })
                        }
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

                  <div className="color-box  text-xs p-2 border-box">
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
                      saveAndContinue(1);
                      setCurrentStep(2);
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
                    <p className="text-base font-medium text-gray-500">
                      طريقة الدفع
                    </p>
                    <StepCircle stepNumber={4} currentStep={currentStep} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 - خيارات التوصيل */}
            {currentStep === 2 && (
              <div className="space-y-5">
                {/* الخطوة 1 المكتملة مع زر التعديل وعرض البيانات */}
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-base font-medium text-gray-600">
                      عنوان التسليم
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => editStep(1)}
                        className="text-black hover:underline text-sm"
                      >
                        تعديل
                      </button>
                      <StepCircle stepNumber={1} currentStep={currentStep} />
                    </div>
                  </div>
                  {/* عرض البيانات المحفوظة */}
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
                        <strong>المدينة:</strong> {formData.city}
                      </p>
                      <p>
                        <strong>العنوان:</strong> {formData.address}
                      </p>
                      <p>
                        <strong>المبنى:</strong> {formData.building}
                      </p>
                      <p>
                        <strong>الهاتف:</strong> {formData.countryCode}{" "}
                        {formData.phone}
                      </p>
                    </div>
                  )}
                </div>

                {/* الخطوة 2 النشطة */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="">خيارات التوصيل</h2>
                  <StepCircle stepNumber={2} currentStep={currentStep} />
                </div>
                <div className="flex flex-col ">
                  <p className="mb-3 text-paragraph ">
                    يتم الشحن من دولة الكويت
                  </p>
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
                    onClick={() => {
                      saveAndContinue(2);
                      setCurrentStep(3);
                    }}
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
                    <p className="text-base font-medium text-gray-500">
                      طريقة الدفع
                    </p>
                    <StepCircle stepNumber={4} currentStep={currentStep} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 - التغليف والهدايا */}
            {currentStep === 3 && (
              <div className="space-y-5">
                {/* الخطوة 1 المكتملة مع زر التعديل وعرض البيانات */}
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-base font-medium text-gray-600">
                      عنوان التسليم
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => editStep(1)}
                        className="text-black hover:underline text-sm"
                      >
                        تعديل
                      </button>
                      <StepCircle stepNumber={1} currentStep={currentStep} />
                    </div>
                  </div>
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
                        <strong>المدينة:</strong> {formData.city}
                      </p>
                      <p>
                        <strong>العنوان:</strong> {formData.address}
                      </p>
                      <p>
                        <strong>المبنى:</strong> {formData.building}
                      </p>
                      <p>
                        <strong>الهاتف:</strong> {formData.countryCode}{" "}
                        {formData.phone}
                      </p>
                    </div>
                  )}
                </div>

                {/* الخطوة 2 المكتملة مع زر التعديل وعرض البيانات */}
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-base font-medium text-gray-600">
                      خيارات التوصيل
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => editStep(2)}
                        className="text-black hover:underline text-sm"
                      >
                        تعديل
                      </button>
                      <StepCircle stepNumber={2} currentStep={currentStep} />
                    </div>
                  </div>
                  {completedSteps.includes(2) && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      <p>
                        <strong>طريقة الشحن:</strong> التوصيل خلال 2-6 أيام عمل
                      </p>
                    </div>
                  )}
                </div>

                {/* الخطوة 3 النشطة */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="">التغليف والهدايا</h2>
                  <StepCircle stepNumber={3} currentStep={currentStep} />
                </div>

                <div className="p-4 flex items-center gap-4">
                  {/* الصورة */}
                  <img
                    src={Box}
                    alt="تغليف صديق للبيئة"
                    className="w-10 h-10"
                  />

                  {/* النصوص */}
                  <div className="flex flex-col">
                    <span className="text-sm mb-3">تغليف صديق للبيئة</span>
                    <span className=" text-gray-600">
                      سيتم توصيل طلبكم في تغليف صديق للبيئة مصنوع محليًا وقابل
                      لإعادة التدوير
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      saveAndContinue(3);
                      setCurrentStep(4);
                    }}
                    className="w-full bg-black text-white p-2 py-2 hover:bg-gray-800 transition"
                  >
                    حفظ ومتابعة
                  </button>
                </div>

                {/* الخطوات القادمة */}
                <div className="mt-8 space-y-4 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between opacity-40">
                    <p className="text-base font-medium text-gray-500">
                      طريقة الدفع
                    </p>
                    <StepCircle stepNumber={4} currentStep={currentStep} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 - طريقة الدفع */}
            {currentStep === 4 && (
              <div className="space-y-5">
                {/* الخطوة 1 المكتملة مع زر التعديل وعرض البيانات */}
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-base font-medium text-gray-600">
                      عنوان التسليم
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => editStep(1)}
                        className="text-black hover:underline text-sm"
                      >
                        تعديل
                      </button>
                      <StepCircle stepNumber={1} currentStep={currentStep} />
                    </div>
                  </div>
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
                        <strong>المدينة:</strong> {formData.city}
                      </p>
                      <p>
                        <strong>العنوان:</strong> {formData.address}
                      </p>
                      <p>
                        <strong>المبنى:</strong> {formData.building}
                      </p>
                      <p>
                        <strong>الهاتف:</strong> {formData.countryCode}{" "}
                        {formData.phone}
                      </p>
                    </div>
                  )}
                </div>

                {/* الخطوة 2 المكتملة مع زر التعديل وعرض البيانات */}
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-base font-medium text-gray-600">
                      خيارات التوصيل
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => editStep(2)}
                        className="text-black hover:underline text-sm"
                      >
                        تعديل
                      </button>
                      <StepCircle stepNumber={2} currentStep={currentStep} />
                    </div>
                  </div>
                  {completedSteps.includes(2) && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      <p>
                        <strong>طريقة الشحن:</strong> التوصيل خلال 2-6 أيام عمل
                      </p>
                    </div>
                  )}
                </div>

                {/* الخطوة 3 المكتملة مع زر التعديل وعرض البيانات */}
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-base font-medium text-gray-600">
                      التغليف والهدايا
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => editStep(3)}
                        className="text-black hover:underline text-sm"
                      >
                        تعديل
                      </button>
                      <StepCircle stepNumber={3} currentStep={currentStep} />
                    </div>
                  </div>
                  {completedSteps.includes(3) && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      <p>
                        <strong>التغليف:</strong> صديق للبيئة
                      </p>
                    </div>
                  )}
                </div>

                {/* الخطوة 4 النشطة */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="">طريقة الدفع</h2>
                  <StepCircle stepNumber={4} currentStep={currentStep} />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-black text-white py-3 font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition"
                >
                  {loading ? "جاري الدفع..." : "الدفع الآن"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <CheckoutOrderSummary
          cartItems={cartItems}
          totalAmount={subtotal}
          taxAmount={taxAmount}
          finalTotal={finalTotal}
        />
      </div>
    </div>
  );
};

export default Checkout;