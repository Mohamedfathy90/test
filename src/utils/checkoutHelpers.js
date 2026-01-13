// Helper functions for checkout

export const calculateTotals = (cartItems) => {
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

  return { subtotal, taxAmount, finalTotal };
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
