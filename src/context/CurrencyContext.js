import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

// Mapping countries to currency codes
const COUNTRY_CURRENCY_MAP = {
  الكويت: "KWD",
  الإمارات: "AED",
  السعودية: "SAR",
  عمان: "OMR",
  البحرين: "BHD",
  قطر: "QAR",
};

// Currency symbols (can be same as code)
const CURRENCY_SYMBOLS = {
  KWD: "KWD",
  AED: "AED",
  SAR: "SAR",
  OMR: "OMR",
  BHD: "BHD",
  QAR: "QAR",
};

// Fallback rates if API fails
const FALLBACK_RATES = {
  KWD: 1,
  AED: 11.9739,
  SAR: 12.2399,
  OMR: 1.2566,
  BHD: 1.2306,
  QAR: 11.884,
};

export const CurrencyProvider = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState("الكويت");
  const [selectedCurrency, setSelectedCurrency] = useState("KWD");
  const [exchangeRates, setExchangeRates] = useState(FALLBACK_RATES);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Load saved currency/country
  useEffect(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    const savedCountry = localStorage.getItem("selectedCountry");
    const hasSeenPopup = localStorage.getItem("hasSeenCurrencyPopup");

    if (savedCurrency && savedCountry) {
      setSelectedCurrency(savedCurrency);
      setSelectedCountry(savedCountry);
      setShowPopup(false);
    } else if (!hasSeenPopup) {
      setShowPopup(true);
    }

    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    try {
      setLoading(true);
      const currencyCodes = Object.values(COUNTRY_CURRENCY_MAP).join(",");

      const response = await axios.get(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/kwd.json`,
      );

      if (response.data && response.data.kwd) {
        // Filter only required currencies
        const filteredRates = {};
        Object.values(COUNTRY_CURRENCY_MAP).forEach((code) => {
          if (response.data.kwd[code.toLowerCase()]) {
            filteredRates[code] = response.data.kwd[code.toLowerCase()];
          }
        });
        setExchangeRates(filteredRates);
        console.log("Exchange Rates:", filteredRates);
      }
    } catch (error) {
      console.error("Error fetching exchange rates, using fallback:", error);
      setExchangeRates(FALLBACK_RATES);
    } finally {
      setLoading(false);
    }
  };

  const selectCountry = (country) => {
    const currency = COUNTRY_CURRENCY_MAP[country] || "KWD";
    setSelectedCountry(country);
    setSelectedCurrency(currency);

    localStorage.setItem("selectedCurrency", currency);
    localStorage.setItem("selectedCountry", country);
    localStorage.setItem("hasSeenCurrencyPopup", "true");

    setShowPopup(false);
  };

  const dismissPopup = () => {
    selectCountry("الكويت");
  };

  const convertPrice = (priceInKWD) => {
    if (selectedCurrency === "KWD") return parseFloat(priceInKWD);
    const rate = exchangeRates[selectedCurrency];
    return rate ? parseFloat(priceInKWD) * rate : parseFloat(priceInKWD);
  };

  const formatPrice = (priceInKWD) => {
    const convertedPrice = convertPrice(priceInKWD);
    const symbol = CURRENCY_SYMBOLS[selectedCurrency] || "KWD";
    return `${symbol} ${convertedPrice.toFixed(3)}`;
  };

  const value = {
    selectedCountry,
    selectedCurrency,
    exchangeRates,
    loading,
    showPopup,
    setShowPopup,
    selectCountry,
    dismissPopup,
    convertPrice,
    formatPrice,
    currencySymbol: CURRENCY_SYMBOLS[selectedCurrency] || "KWD",
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
