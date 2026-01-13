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

const CURRENCY_SYMBOLS = {
  KWD: "KWD",
  AED: "AED",
  SAR: "SAR",
  OMR: "OMR",
  BHD: "BHD",
  QAR: "QAR",
};

export const CurrencyProvider = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("KWD");
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Check if user has already selected a currency (on first visit)
  useEffect(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    const savedCountry = localStorage.getItem("selectedCountry");
    const hasSeenPopup = localStorage.getItem("hasSeenCurrencyPopup");

    if (savedCurrency && savedCountry) {
      setSelectedCurrency(savedCurrency);
      setSelectedCountry(savedCountry);
      setShowPopup(false);
    } else if (!hasSeenPopup) {
      // Show popup on first visit
      setShowPopup(true);
    }

    // Fetch exchange rates
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://api.fastforex.io/fetch-all",
        {
          headers: {
            "X-API-Key": "093a0efd2d-96aa71a7cd-t8rbbx",
          },
          params: {
            from: "KWD", // Base currency is Kuwait
            api_key: "093a0efd2d-96aa71a7cd-t8rbbx",
          },
        }
      );

      if (response.data && response.data.results) {
        setExchangeRates(response.data.results);
      } else if (response.data && response.data.rates) {
        // Alternative response format
        setExchangeRates(response.data.rates);
      }
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      // Set default rates if API fails (1:1 for KWD, approximate rates for others)
      setExchangeRates({
        KWD: 1,
        AED: 12.3,
        SAR: 12.3,
        OMR: 1.28,
        BHD: 1.28,
        QAR: 12.0,
      });
    } finally {
      setLoading(false);
    }
  };

  const selectCountry = (country) => {
    const currency = COUNTRY_CURRENCY_MAP[country] || "KWD";
    setSelectedCountry(country);
    setSelectedCurrency(currency);
    
    // Save to localStorage
    localStorage.setItem("selectedCurrency", currency);
    localStorage.setItem("selectedCountry", country);
    localStorage.setItem("hasSeenCurrencyPopup", "true");
    
    setShowPopup(false);
  };

  const dismissPopup = () => {
    // Default to Kuwait if dismissed
    setSelectedCountry("الكويت");
    setSelectedCurrency("KWD");
    localStorage.setItem("selectedCurrency", "KWD");
    localStorage.setItem("selectedCountry", "الكويت");
    localStorage.setItem("hasSeenCurrencyPopup", "true");
    setShowPopup(false);
  };

  const convertPrice = (priceInKWD) => {
    if (selectedCurrency === "KWD") {
      return parseFloat(priceInKWD);
    }

    const rate = exchangeRates[selectedCurrency];
    if (rate) {
      return parseFloat(priceInKWD) * rate;
    }

    return parseFloat(priceInKWD);
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
