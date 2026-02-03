import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { getSessionId } from "../utils/SessionId";
import { useCurrency } from "../context/CurrencyContext";
import CheckoutHeader from "../components/CheckoutHeader";
import CheckoutOrderSummary from "../components/CheckoutOrderSummary";
import Step1DeliveryAddress from "../components/checkout/Step1DeliveryAddress";
import Step2Shipping from "../components/checkout/Step2Shipping";
import Step3GiftWrap from "../components/checkout/Step3GiftWrap";
import Step4PaymentMethod from "../components/checkout/Step4PaymentMethod";
import Step5PaymentForm from "../components/checkout/Step5PaymentForm";
import {
  calculateTotals,
  validateStep1,
  getTitleText,
  getContainerId,
  clearPaymentContainers,
} from "../utils/checkoutHelpers";

// خريطة أرقام الاتصال بحسب الدولة المختارة من CurrencyContext
const COUNTRY_PHONE_CODE_MAP = {
  الكويت: "+965",
  الإمارات: "+971",
  السعودية: "+966",
  عمان: "+968",
  البحرين: "+973",
  قطر: "+974",
};

const Checkout = () => {
  const location = useLocation();
  const sessionId = getSessionId();
  const { selectedCountry } = useCurrency();

  const cartItems = location.state?.cartItems || [];

  // State Management
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emptyFields, setEmptyFields] = useState([]);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [mfSessionId, setMfSessionId] = useState("");
  const [orderId, setOrderId] = useState("");

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

  // مزامنة الدولة ورمز الهاتف مع الدولة المختارة من CurrencyPopup / CurrencyContext
  useEffect(() => {
    if (!selectedCountry) return;

    setFormData((prev) => ({
      ...prev,
      country: selectedCountry,
      countryCode:
        COUNTRY_PHONE_CODE_MAP[selectedCountry] || prev.countryCode || "+965",
    }));
  }, [selectedCountry]);

  // Calculate totals
  const { subtotal, taxAmount, finalTotal } = calculateTotals(cartItems);

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // إزالة الحقل من قائمة الحقول الفارغة إذا تم ملؤه
    if (emptyFields.includes(name) && value.trim() !== "") {
      setEmptyFields((prev) => prev.filter((field) => field !== name));
    }
  };

  const saveAndContinue = (stepNumber) => {
    if (!completedSteps.includes(stepNumber)) {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  const editStep = (stepNumber) => {
    setCurrentStep(stepNumber);
    // تنظيف الـ containers عند الرجوع
    if (stepNumber < 5) {
      clearPaymentContainers();
    }
  };

  // تنظيف الـ containers عند تغيير طريقة الدفع
  useEffect(() => {
    if (currentStep === 5 && selectedPaymentMethod) {
      clearPaymentContainers();
    }
  }, [currentStep, selectedPaymentMethod]);

  // Payment Functions
  const initializePayment = async () => {
    if (!sessionId) {
      setError("خطأ في الجلسة");
      return;
    }

    if (!selectedPaymentMethod) {
      setError("يرجى اختيار طريقة الدفع");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // الخطوة 1: حفظ الأوردر في الداتابيس
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

      // ✅ التأكد من أن السعر رقم صحيح
      const totalPrice = typeof finalTotal === 'number' ? finalTotal : parseFloat(finalTotal);
      
      if (isNaN(totalPrice) || totalPrice <= 0) {
        console.error("Invalid total price:", finalTotal, typeof finalTotal);
        throw new Error("السعر غير صحيح");
      }

      // ✅ تسجيل السعر المرسل
      console.log("Creating order with price:", {
        total_price: totalPrice,
        total_price_type: typeof totalPrice,
        finalTotal_original: finalTotal,
        finalTotal_type: typeof finalTotal,
        subtotal,
        taxAmount
      });

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
        total_price: totalPrice, 
        items,
      };

      // استدعاء create_invoice لحفظ الأوردر
      const orderRes = await axios.post(
        "https://blomengdalis-tester.com/backend/create_invoice.php",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (!orderRes.data?.order_id) {
        throw new Error("فشل إنشاء الطلب");
      }

      const order_id = orderRes.data.order_id;
      setOrderId(order_id);

      // الخطوة 2: الحصول على SessionId من MyFatoorah
      const sessionRes = await axios.post(
        "https://blomengdalis-tester.com/backend/initiate_session.php"
      );

      if (!sessionRes.data?.sessionId) {
        throw new Error("فشل تهيئة جلسة الدفع");
      }

      const mfSession = sessionRes.data.sessionId;
      const countryCode = sessionRes.data.countryCode;
      setMfSessionId(mfSession);

      // الخطوة 3: الانتقال للخطوة 5 لعرض فورم الدفع
      setCurrentStep(5);

      // الخطوة 4: تهيئة Embedded Payment بعد الانتقال للخطوة 5
      // استخدام requestAnimationFrame و setTimeout لضمان جاهزية DOM
      requestAnimationFrame(() => {
        setTimeout(() => {
          // التحقق من وجود مكتبة MyFatoorah مع محاولات متعددة
          const checkMyFatoorah = (attempts = 0) => {
            if (window.myfatoorah && typeof window.myfatoorah.init === 'function') {
              initPayment();
            } else if (attempts < 20) {
              // محاولة حتى 20 مرة (2 ثانية)
              setTimeout(() => checkMyFatoorah(attempts + 1), 100);
            } else {
              console.error("MyFatoorah library not loaded after 20 attempts");
              setError("نظام الدفع غير متاح. يرجى تحديث الصفحة والمحاولة مرة أخرى.");
              setLoading(false);
            }
          };

          const initPayment = () => {

          const containerId = getContainerId(selectedPaymentMethod);
          if (!containerId) {
            console.error("Invalid payment method:", selectedPaymentMethod);
            setError("طريقة الدفع غير صحيحة");
            setLoading(false);
            return;
          }

          // محاولة متعددة للعثور على الـ container
          let container = document.getElementById(containerId);
          let attempts = 0;
          const maxAttempts = 30; // زيادة المحاولات

          const tryInit = () => {
            container = document.getElementById(containerId);
            
            if (!container) {
              attempts++;
              if (attempts < maxAttempts) {
                setTimeout(tryInit, 100);
                return;
              } else {
                console.error(`Container ${containerId} not found after ${maxAttempts} attempts`);
                setError("حدث خطأ في تحميل فورم الدفع. يرجى تحديث الصفحة.");
                setLoading(false);
                return;
              }
            }

            // تنظيف الـ container أولاً
            try {
              container.innerHTML = "";
            } catch (e) {
              console.error("Error clearing container:", e);
            }

            // ✅ التأكد من أن السعر رقم صحيح
            const paymentAmount = typeof finalTotal === 'number' ? finalTotal : parseFloat(finalTotal);
            
            if (isNaN(paymentAmount) || paymentAmount <= 0) {
              console.error("Invalid payment amount:", finalTotal, typeof finalTotal);
              setError("السعر غير صحيح");
              setLoading(false);
              return;
            }

            // ✅ تسجيل السعر المستخدم في MyFatoorah init
            console.log("MyFatoorah init amount:", {
              paymentAmount,
              paymentAmount_type: typeof paymentAmount,
              finalTotal_original: finalTotal,
              finalTotal_type: typeof finalTotal
            });

            // التحقق من وجود جميع البيانات المطلوبة
            if (!mfSession || !countryCode) {
              console.error("Missing session data:", { mfSession, countryCode });
              setError("بيانات الجلسة غير مكتملة");
              setLoading(false);
              return;
            }
            
            const config = {
              sessionId: mfSession,
              countryCode: countryCode,
              currencyCode: "KWD",
              language: "AR",
              amount: paymentAmount,
              displayCurrencyIso: "KWD",
              callback: (response) => {
                console.log("MyFatoorah callback response:", response);

                // التحقق من وجود order_id
                if (!order_id) {
                  setError("خطأ: لم يتم العثور على رقم الطلب");
                  console.error("Order ID is missing");
                  setLoading(false);
                  return;
                }

                // التحقق من صحة الاستجابة
                if (!response) {
                  console.error("Empty response from MyFatoorah");
                  setError("لم يتم استلام استجابة من نظام الدفع");
                  setLoading(false);
                  return;
                }

                // عند نجاح إدخال بيانات الكارت
                if (response.isSuccess === true || response.IsSuccess === true) {
                  // التحقق من وجود SessionId في الاستجابة
                  const paymentSessionId =
                    response.SessionId || 
                    response.sessionId || 
                    response.Data?.SessionId ||
                    mfSession;

                  if (paymentSessionId) {
                    console.log(
                      "Executing payment with SessionId:",
                      paymentSessionId,
                      "OrderId:",
                      order_id
                    );
                    // إرسال للباك إند لتنفيذ الدفع
                    executePayment(paymentSessionId, order_id);
                  } else {
                    setError("لم يتم الحصول على معرف الجلسة من نظام الدفع");
                    console.error("No SessionId in response:", response);
                    setLoading(false);
                  }
                } else {
                  // في حالة الفشل
                  const errorMsg =
                    response?.message ||
                    response?.error ||
                    response?.Message ||
                    response?.Data?.Message ||
                    "فشل في إدخال بيانات الدفع";
                  setError(errorMsg);
                  console.error("Payment callback failed:", response);
                  setLoading(false);
                }
              },
              containerId: containerId,
              paymentOptions: selectedPaymentMethod ? [selectedPaymentMethod] : [],
            };

            // التحقق من صحة الـ config قبل التهيئة
            if (!config.sessionId || !config.containerId || config.paymentOptions.length === 0) {
              console.error("Invalid MyFatoorah config:", config);
              console.error("Config details:", {
                hasSessionId: !!config.sessionId,
                sessionId: config.sessionId,
                hasContainerId: !!config.containerId,
                containerId: config.containerId,
                paymentOptionsLength: config.paymentOptions.length,
                paymentOptions: config.paymentOptions
              });
              setError("إعدادات الدفع غير صحيحة");
              setLoading(false);
              return;
            }
            
            // التحقق من أن الـ container موجود ومرئي
            const containerRect = container.getBoundingClientRect();
            if (containerRect.width === 0 || containerRect.height === 0) {
              console.warn("Container has zero dimensions:", containerRect);
            }
            
            console.log("Container details:", {
              id: containerId,
              exists: !!container,
              width: containerRect.width,
              height: containerRect.height,
              visible: containerRect.width > 0 && containerRect.height > 0
            });

              try {
                console.log("Initializing MyFatoorah with config:", {
                  sessionId: config.sessionId,
                  countryCode: config.countryCode,
                  currencyCode: config.currencyCode,
                  amount: config.amount,
                  containerId: config.containerId,
                  paymentOptions: config.paymentOptions
                });
                
                // التأكد من أن الـ container فارغ قبل التهيئة
                container.innerHTML = "";
                
                // تهيئة MyFatoorah
                window.myfatoorah.init(config);
                
                console.log("MyFatoorah init called successfully");
                
                // إيقاف loading بعد التهيئة
                setLoading(false);
                
                // التحقق من ظهور الحقول بعد فترات متعددة
                const checkFormLoaded = (attempts = 0) => {
                  const hasContent = container.children.length > 0 || 
                                    container.querySelector('iframe') !== null ||
                                    container.querySelector('form') !== null ||
                                    container.innerHTML.trim() !== "";
                  
                  if (hasContent) {
                    console.log("MyFatoorah form loaded successfully");
                    // إخفاء loading indicator إذا كان موجود
                    const loadingIndicator = container.querySelector('.animate-spin');
                    if (loadingIndicator) {
                      loadingIndicator.parentElement.style.display = 'none';
                    }
                  } else if (attempts < 10) {
                    // محاولة حتى 10 مرات (5 ثواني)
                    setTimeout(() => checkFormLoaded(attempts + 1), 500);
                  } else {
                    console.warn("MyFatoorah form may not have loaded. Container is still empty after 5 seconds.");
                    console.warn("Container HTML:", container.innerHTML);
                    console.warn("Container children:", container.children.length);
                    // لا نعرض خطأ هنا، قد يحتاج وقت أكثر أو قد تكون هناك مشكلة في الـ config
                  }
                };
                
                // بدء التحقق بعد ثانية واحدة
                setTimeout(() => checkFormLoaded(), 1000);
              } catch (err) {
                console.error("Error initializing MyFatoorah:", err);
                console.error("Error stack:", err.stack);
                setError("حدث خطأ في تهيئة نظام الدفع: " + (err.message || "خطأ غير معروف"));
                setLoading(false);
              }
            };

            // بدء المحاولة
            tryInit();
          };

          // بدء التحقق من تحميل MyFatoorah
          checkMyFatoorah();
        }, 800); // زيادة الوقت لضمان جاهزية React DOM
      });
    } catch (err) {
      setError("حدث خطأ أثناء المعالجة");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPaymentMethod) {
      setError("يرجى اختيار طريقة الدفع");
      return;
    }

    await initializePayment();
  };

  const executePayment = async (mfSessionId, order_id) => {
    try {
      setLoading(true);
      setError("");

      // ✅ استخدام السعر المحفوظ في قاعدة البيانات (يتم قراءته من الباك)
      // لكن نرسل السعر الحالي أيضاً للتحقق
      const invoiceValue = typeof finalTotal === 'number' ? finalTotal : parseFloat(finalTotal);
      
      if (isNaN(invoiceValue) || invoiceValue <= 0) {
        console.error("Invalid invoice value:", finalTotal, typeof finalTotal);
        throw new Error("السعر غير صحيح");
      }

      // ✅ تسجيل السعر المرسل
      console.log("Sending payment execution request:", {
        order_id,
        invoice_value: invoiceValue,
        invoice_value_type: typeof invoiceValue,
        finalTotal_original: finalTotal,
        finalTotal_type: typeof finalTotal
      });

      const res = await axios.post(
        "https://blomengdalis-tester.com/backend/execute_payment.php",
        {
          sessionId: mfSessionId,
          order_id: order_id,
          invoice_value: invoiceValue, // إرسال كرقم وليس string
        }
      );

      // التحقق من وجود payment_url في الاستجابة
      if (res.data?.payment_url) {
        // فتح صفحة 3D Secure
        window.location.href = res.data.payment_url;
      } else if (res.data?.error) {
        // إذا كان هناك خطأ في الاستجابة
        const errorMessage =
          res.data.message || res.data.error || "حدث خطأ أثناء الدفع";
        setError(errorMessage);
        console.error("Payment execution error:", res.data);
      } else {
        setError("لم يتم الحصول على رابط الدفع");
        console.error("No payment URL in response:", res.data);
      }
    } catch (err) {
      // معالجة الأخطاء بشكل أفضل
      let errorMessage = "حدث خطأ أثناء الدفع";

      if (err.response) {
        // خطأ من السيرفر
        const errorData = err.response.data;
        if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.error) {
          errorMessage = errorData.error;
        } else if (err.response.status === 400) {
          errorMessage = "بيانات الدفع غير صحيحة";
        } else if (err.response.status === 500) {
          errorMessage = "خطأ في السيرفر، يرجى المحاولة لاحقاً";
        }
      } else if (err.request) {
        // الطلب تم إرساله لكن لم يتم استقبال استجابة
        errorMessage =
          "لا يمكن الاتصال بالسيرفر، يرجى التحقق من الاتصال بالإنترنت";
      } else {
        // خطأ في إعداد الطلب
        errorMessage = err.message || "حدث خطأ غير متوقع";
      }

      setError(errorMessage);
      console.error("Payment execution error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Step Navigation Handlers
  const handleStep1Next = () => {
    if (validateStep1(formData, setEmptyFields, setError)) {
      saveAndContinue(1);
      setCurrentStep(2);
    }
  };

  const handleStep2Next = () => {
    saveAndContinue(2);
    setCurrentStep(3);
  };

  const handleStep3Next = () => {
    saveAndContinue(3);
    setCurrentStep(4);
  };

  const handleStep4Next = () => {
    saveAndContinue(4);
    handleSubmit();
  };

  return (
    <div dir="rtl" className="min-h-screen bg-white">
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
              <Step1DeliveryAddress
                formData={formData}
                handleChange={handleChange}
                emptyFields={emptyFields}
                setFormData={setFormData}
                currentStep={currentStep}
                onNext={handleStep1Next}
                validateStep1={() =>
                  validateStep1(formData, setEmptyFields, setError)
                }
              />
            )}

            {/* STEP 2 - خيارات التوصيل */}
            {currentStep === 2 && (
              <Step2Shipping
                formData={formData}
                getTitleText={getTitleText}
                completedSteps={completedSteps}
                currentStep={currentStep}
                onEdit={editStep}
                onNext={handleStep2Next}
              />
            )}

            {/* STEP 3 - التغليف والهدايا */}
            {currentStep === 3 && (
              <Step3GiftWrap
                formData={formData}
                getTitleText={getTitleText}
                completedSteps={completedSteps}
                currentStep={currentStep}
                onEdit={editStep}
                onNext={handleStep3Next}
              />
            )}

            {/* STEP 4 - طريقة الدفع */}
            {currentStep === 4 && (
              <Step4PaymentMethod
                formData={formData}
                getTitleText={getTitleText}
                completedSteps={completedSteps}
                currentStep={currentStep}
                onEdit={editStep}
                selectedPaymentMethod={selectedPaymentMethod}
                setSelectedPaymentMethod={setSelectedPaymentMethod}
                onNext={handleStep4Next}
                loading={loading}
                error={error}
              />
            )}

            {/* STEP 5 - إدخال بيانات الدفع */}
            {currentStep === 5 && (
              <Step5PaymentForm
                formData={formData}
                getTitleText={getTitleText}
                completedSteps={completedSteps}
                currentStep={currentStep}
                onEdit={editStep}
                selectedPaymentMethod={selectedPaymentMethod}
                finalTotal={finalTotal}
                error={error}
              />
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