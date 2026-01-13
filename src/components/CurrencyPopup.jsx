import React, { useState } from "react";
import { useCurrency } from "../context/CurrencyContext";

const CurrencyPopup = () => {
  const { showPopup, selectCountry, dismissPopup } = useCurrency();
  const [showCountrySelection, setShowCountrySelection] = useState(false);

  const countries = [
    { name: "الكويت", code: "KWD" },
    { name: "الإمارات", code: "AED" },
    { name: "السعودية", code: "SAR" },
    { name: "عمان", code: "OMR" },
    { name: "البحرين", code: "BHD" },
    { name: "قطر", code: "QAR" },
  ];

  if (!showPopup) return null;

  const handleSelectCountry = (country) => {
    selectCountry(country);
    setShowCountrySelection(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={dismissPopup}
      >
        {/* Popup Content */}
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
          dir="rtl"
        >
          {!showCountrySelection ? (
            <>
              {/* Popup Text */}
              <div className="text-center mb-6">
                <p className="text-base text-gray-800">
                  هل تريد تغيير العملة؟
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCountrySelection(true)}
                  className="flex-1 bg-black text-white py-2.5 px-4 rounded hover:bg-gray-800 transition text-sm font-medium"
                >
                  اختر الدولة
                </button>
                <button
                  onClick={dismissPopup}
                  className="flex-1 bg-white text-black border border-gray-300 py-2.5 px-4 rounded hover:bg-gray-50 transition text-sm font-medium"
                >
                  تجاهل
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Country Selection */}
              <div className="mb-6">
                <h3 className="text-base font-semibold mb-4 text-center">
                  اختر الدولة
                </h3>
                <div className="space-y-2">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => handleSelectCountry(country.name)}
                      className="w-full text-right py-2.5 px-4 border border-gray-300 rounded hover:bg-gray-50 hover:border-black transition text-sm"
                    >
                      {country.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Back Button */}
              <button
                onClick={() => setShowCountrySelection(false)}
                className="w-full bg-gray-100 text-gray-700 py-2.5 px-4 rounded hover:bg-gray-200 transition text-sm font-medium"
              >
                رجوع
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CurrencyPopup;
