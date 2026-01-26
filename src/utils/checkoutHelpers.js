
export const calculateTotals = (cartItems) => {
  // ✅ حساب السعر الأساسي
  const subtotal = cartItems.reduce((total, item) => {
    const price =
      parseFloat(item.price_after) ||
      parseFloat(item.original_price) ||
      parseFloat(item.price_before) ||
      0;
    return total + price * item.quantity;
  }, 0);

  // ✅ حساب الضريبة (5%)
  const taxAmount = subtotal * 0.05;
  
  // ✅ حساب السعر النهائي (بدون تقريب أولاً)
  const finalTotalRaw = subtotal + taxAmount;
  
  // ✅ تقريب لـ 3 منازل عشرية (KWD)
  const finalTotal = parseFloat(finalTotalRaw.toFixed(3));
  const taxAmountFormatted = parseFloat(taxAmount.toFixed(3));

  // ✅ تسجيل للحصول على نفس القيمة دائماً
  console.log("Price calculation:", {
    subtotal: subtotal.toFixed(3),
    taxAmount: taxAmountFormatted,
    finalTotal: finalTotal,
    finalTotalString: finalTotal.toFixed(3)
  });

  return { 
    subtotal: parseFloat(subtotal.toFixed(3)), 
    taxAmount: taxAmountFormatted, 
    finalTotal: finalTotal // رقم وليس string
  };
};

export const validateStep1 = (formData, setEmptyFields, setError) => {
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

export const getTitleText = (title) => {
  if (title === "mr") return "السيد";
  if (title === "mrs") return "السيدة";
  if (title === "ms") return "آنسة";
  return title;
};

export const getContainerId = (paymentMethod) => {
  const containerIdMap = {
    Card: "card-payment-container",
    ApplePay: "applepay-payment-container",
    GooglePay: "googlepay-payment-container",
  };
  return containerIdMap[paymentMethod];
};

export const clearPaymentContainers = () => {
  const containers = [
    "card-payment-container",
    "applepay-payment-container",
    "googlepay-payment-container",
  ];
  containers.forEach((id) => {
    const container = document.getElementById(id);
    if (container) {
      container.innerHTML = "";
    }
  });
};
