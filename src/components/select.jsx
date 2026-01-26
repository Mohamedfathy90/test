import React, { useState } from "react";

function Select({ onSortChange }) {
  const [selectedValue, setSelectedValue] = useState("newest");

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);
    onSortChange(value);
  };

  return (
    <div className="mb-5 px-4">
  <select
    value={selectedValue}
    onChange={handleChange}
    className="
      border border-gray-500
      px-4 py-2
      text-sm
      text-gray-700
      cursor-pointer
      transition
      focus:border-gray-500
      focus:ring-gray-500
      focus:outline-none
      hover:border-gray-400
    "
  >
    <option value="newest">أحدث ما وصلنا</option>
    <option value="best">أفضل التنسيقات</option>
    <option value="lowest">الأقل سعراً</option>
    <option value="highest">الأعلى سعراً</option>
  </select>
</div>

  );
}

export default Select;
