import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { GoArrowRight } from "react-icons/go";
import logo from "../assets/logo.jpg";

export default function CheckoutHeader() {
  const navigate = useNavigate();

  return (
    <header className=" bg-white">
      {/* MOBILE HEADER */}
      <div className="lg:hidden px-4 py-3 sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="العودة إلى السلة"
          >
            <GoArrowRight className="text-2xl text-gray-700" />
          </button>

          <img src={logo} alt="logo" className="h-10 sm:h-12 object-contain" />

          <button
            className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="عربة التسوق"
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* DESKTOP HEADER */}
      <div className="hidden lg:flex items-center justify-between px-5 py-3 border-b border-gray-200 h-20">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-black transition-colors h-10"
        >
          <GoArrowRight className="text-base" />
          العودة إلى حقيبة التسوق
        </button>

        <img src={logo} alt="logo" className="h-10 object-contain" />

        <div className="flex items-center gap-2 text-sm h-10">
          <ShoppingCart className="w-4 h-4" />
          <span>الدفع الآمن</span>
        </div>
      </div>
    </header>
  );
}
