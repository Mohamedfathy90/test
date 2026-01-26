import React, { createContext, useContext, useState, useEffect } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // جلب المنتجات مرة واحدة عند تحميل الـ App
  useEffect(() => {
    fetchAllProducts();
  }, []);

  // فلترة المنتجات كل ما يتغير البحث
  useEffect(() => {
    filterProducts();
  }, [searchQuery, allProducts]);

  const fetchAllProducts = async () => {
    try {
      const res = await fetch(
        "https://blomengdalis-tester.com/backend/get-products.php"
      );
      const data = await res.json();
      setAllProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const filterProducts = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const query = searchQuery.toLowerCase().trim();

    const filtered = allProducts.filter((product) => {
      const name = product.name?.toLowerCase() || "";
      const description = product.description?.toLowerCase() || "";

      // البحث بيشتغل على كل حرف
      return name.includes(query) || description.includes(query);
    });

    setSearchResults(filtered);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
};
