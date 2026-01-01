import React, { useState } from "react";

function Select() {
  const [selectedValue, setSelectedValue] = useState("أحدث ما وصلنا");

  const handleChange = (e) => {
    setSelectedValue(e.target.value);
  };

  return (
    <div className="container">
      <select
        className="form-select select"
        aria-label="Default select example"
        value={selectedValue}
        onChange={handleChange}
      >
        <option value="أحدث ما وصلنا">أحدث ما وصلنا</option>
        <option value="أفضل التنسيقات">أفضل التنسيقات</option>
        <option value="الأقل سعرا">الأقل سعرا</option>
      </select>
    </div>
  );
}
export default Select;