import React from "react";

const ItemCart = ({ item, removeItem, updateQuantity }) => {
  const totalPrice = (item.price_after * item.quantity).toFixed(3);

  return (
    <div className="border-b pb-6 mb-6">
      <div className="flex gap-6 items-start">
        {/* Product Image - Right Side */}
        <div className="flex-shrink-0">
          <img
            src={`https://blomengdalis-tester.com/backend/uploads/${item.main_image}`}
            alt={item.name}
            className="w-48 h-64 object-contain bg-white"
          />
        </div>

        {/* Product Info and Controls - Left Side */}
        <div className="flex-1 text-right">
          {/* Delete Button */}
          <div className="mb-4">
            <button
              onClick={() => removeItem(item.product_id)}
              className="text-gray-400 hover:text-black transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Product Name and Brand */}
          <h3 className="text-2xl font-normal mb-1">{item.name}</h3>
          <p className="text-base text-gray-700 mb-3">{item.description}</p>

          {/* Product ID */}
          <p className="text-sm text-gray-400 mb-4">
            معرّف المنتج: {item.product_id}
          </p>

          {/* Price */}
          <div className="text-xl font-semibold mb-6">KWD {totalPrice}</div>

          {/* Size and Quantity Controls - Horizontal Row */}
          <div className="flex items-center gap-6 mb-6">
            {/* Size */}
            <div>
              <span className="text-base font-normal underline decoration-1 underline-offset-4">
                {item.size}
              </span>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity(item.product_id, "increment")}
                className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M8 3v10M3 8h10" strokeLinecap="round" />
                </svg>
              </button>

              <span className="text-base font-normal">{item.quantity}</span>

              <button
                onClick={() => updateQuantity(item.product_id, "decrement")}
                disabled={item.quantity <= 1}
                className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg
                  width="14"
                  height="2"
                  viewBox="0 0 16 3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 1.5h10" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Out of Stock Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4 flex items-start gap-2 max-w-md">
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-blue-800">
              منتج غير قابل للاسترداد
            </span>
          </div>

          {/* Add to Wishlist Link */}
          <button className="text-base text-gray-700 underline hover:text-black decoration-1 underline-offset-4">
            أضف إلى قائمة الأمنيات
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCart;
