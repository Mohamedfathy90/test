import React, { useState } from "react";
import { Link } from "react-router-dom";
const BeautySection = () => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => setExpanded(!expanded);

  const fullText = `
    
    هل تبحثون عن العطر المناسب لشخصيتكم أو كهدية مثالية لشخص ما؟ بعض العطور تناسب أشخاص ومواسم معينة ولا تناسب الأخرين! لاختيار العطر الأفضل وعدم إعطاء أي فرصة للتردد،، ستجدون العطر الذي يناسبكم باختياره وفقًا لطبقات رائحته العطرية. سواء كنتم تبحثون عن العطر الزهري أو الخشبي أو المنعش أو الشرقي، فأن متجر بلومينغديلز يمنحكم الفرصة لاستكشاف أفضل العطور لكل عائلة عطرية من العطور الرجالية والعطور النسائية والتسوق اون لاين من بين أشهر العلامات التجارية الفاخرة مثل قوتشي، ديور، شانيل، كارتير، مارك جاكوبس، كلوي، أكوا دي بارما، جيفنشي، فيرساتشي وغيرهم المزيد.
  `;

  return (
    <section className="beauty-section">
      <Link to="#" className="beauty-link">الجمال</Link>
      <h2 className="beauty-sect">العطور</h2>
      <p className={`beauty-text ${expanded ? "expanded" : ""}`}>
        {fullText}
      </p>
      <button className="read-more-btn" onClick={handleToggle}>
        {expanded ? "إظهار أقل" : "اقرأ المزيد"}
      </button>
    </section>
  );
};

export default BeautySection;
