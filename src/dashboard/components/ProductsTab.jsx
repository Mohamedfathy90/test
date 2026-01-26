import React, { useState } from "react";
import { useCurrency } from "../../context/CurrencyContext";
import ProductModal from "./ProductModal";

const API_URL = "https://blomengdalis-tester.com/backend";

function ProductsTab({ products, onDeleteProduct, onToggleAvailability, onRefresh }) {
  const { formatPrice } = useCurrency();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-semibold text-gray-900">
          إدارة المنتجات
        </h2>
        <button
          onClick={() => {
            setEditingProductId(null);
            setIsModalOpen(true);
          }}
          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#c9a961] text-white rounded-lg 
          hover:bg-[#b8984f] transition text-xs sm:text-sm font-medium"
        >
          + إضافة منتج جديد
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          const isAvailable =
            product.is_available === "1" ||
            product.is_available === 1 ||
            product.is_available === true;

          return (
            <div
              key={product.id}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden
              shadow-sm hover:shadow-md transition"
            >
              {/* Image */}
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={`${API_URL}/uploads/${encodeURIComponent(
                    product.main_image
                  )}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[11px] font-medium
                  ${
                    isAvailable
                      ? "bg-green-600 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {isAvailable ? "متوفر" : "غير متوفر"}
                </span>
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                  {product.name}
                </h3>

                <p className="text-xs text-gray-500 line-clamp-2">
                  {product.description}
                </p>

                {/* Price */}
                <div>
                  {product.discount_percent &&
                  parseFloat(product.discount_percent) > 0 ? (
                    <>
                      <div className="text-sm font-semibold text-gray-900">
                        {formatPrice(parseFloat(product.price_after))}
                      </div>
                      <div className="text-xs text-gray-400 line-through">
                        {formatPrice(parseFloat(product.original_price))}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm font-semibold text-gray-900">
                      {formatPrice(parseFloat(product.original_price))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setEditingProductId(product.id);
                      setIsModalOpen(true);
                    }}
                    className="flex-1 px-2 py-1.5 rounded-md bg-gray-100 
                    text-gray-700 hover:bg-gray-200 text-xs font-medium transition"
                  >
                    تعديل
                  </button>

                  <button
                    onClick={() =>
                      onToggleAvailability(product.id, product.is_available)
                    }
                    className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition
                    ${
                      isAvailable
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                  >
                    {isAvailable ? "غير متوفر" : "متوفر"}
                  </button>

                  <button
                    onClick={() => onDeleteProduct(product.id)}
                    className="px-2 py-1.5 rounded-md bg-red-100 
                    text-red-700 hover:bg-red-200 text-xs font-medium transition"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProductId(null);
        }}
        productId={editingProductId}
        onSuccess={() => {
          console.log("ProductModal onSuccess called");
          if (onRefresh) {
            console.log("Calling onRefresh");
            onRefresh();
          }
        }}
      />
    </div>
  );
}

export default ProductsTab;
