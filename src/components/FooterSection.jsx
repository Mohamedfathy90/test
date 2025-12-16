
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { FaSnapchatGhost } from "react-icons/fa";

const Footer = () => {
  const iconStyle = "text-white w-5 h-5";
  const wrapperStyle = "rounded-full p-2 cursor-pointer";

  return (
    <footer className="bg-white border-t pt-0 text-sm text-gray-700 rtl">
      {/* Top Black Footer with Logo and Social Icons */}
     <div className="TopFooter"
            style={{
                background:"#000"
            }}>
              <div className="imgFooter">
                         <img src="/log2.jpg" alt="" />
                </div>

        <div className="SochialFooter flex gap-4">
          <div className={`${wrapperStyle} `}>
            <Facebook className={iconStyle} />
          </div>
          <div className={`${wrapperStyle} `}>
            <Instagram className={iconStyle} />
          </div>
          <div className={`${wrapperStyle} `}>
            <Twitter className={iconStyle} />
          </div>
          <div className={`${wrapperStyle}`}>
            <Youtube className={iconStyle} />
          </div>
          <div className={`${wrapperStyle}`}>
            <FaSnapchatGhost className={iconStyle} size={20} />
          </div>
        </div>
      </div>

      {/* Footer Links Grid */}
      <div className="max-w-7xl mx-auto px-4 pt-10 pb-6">
        <div className=" TowFooter">
          <div className=" TowFooter2">
            
            <ul className="space-y-2">
              <li className="font-bold mb-3">Trending</li>
              <li>الإبدات الإماراتية</li>
              <li>العطور النسائية</li>
              <li>مستلزمات النوم الإماراتية</li>
              <li>المجوهرات الفاخرة</li>
              <li>ملابس البحر للرجال</li>
            </ul>
          

          
            
            <ul className="space-y-2">
              <li className="font-bold mb-3">Most Favourited</li>
              <li>العطور ديبتيك</li>
              <li>الجمال أوريجاني</li>
              <li>المكياج إنلاستيكا</li>
              <li>الجمال مرسيدس</li>
            </ul>
          

          
            
            <ul className="space-y-2">
              <ul className="font-bold mb-3">Top Searches</ul>
              <li>الجمال شانيل</li>
              <li>الجمال ديور</li>
              <li>العطور ديور</li>
              <li>العطور شانيل</li>
              <li>الجمال ديبتيك</li>
            </ul><hr />
          </div> 

          <div className=" TowFooter2">
            
            <ul className="space-y-2">
              <li className="font-bold mb-3">خدمات العملاء</li>
              <li>تواصل معنا</li>
              <li>خيارات التوصيل</li>
              <li>خيارات الدفع</li>
              <li>تتبع طلبك</li>
              <li>الإرجاع</li>
              <li>فرق الدفع</li>
              <li>أسئلة مكررة</li>
            </ul>
         

          
            
            <ul className="space-y-2">
              <li className="font-bold mb-3">معلومات</li>
              <li>قصة بلومينجديلز</li>
              <li>أقرب متجر</li>
              <li>تطبيقنا</li>
              <li>طرق أسهل للدفع</li>
              <li>العمل</li>
              <li>الخصوصية</li>
              <li>تعليمات الاستخدام</li>
              <li>خريطة الموقع</li>
            </ul>
          

          
            <div className="TowFooter">
            <ul className="space-y-2"><li className="font-bold mb-3">الخدمات والفعاليات</li>
              <li>تسجيل الهدايا</li>
              <li>الخدمات التجميلية في المتجر</li>
              <li>خدمة المكالمات لوميير بوتي</li>
              <li>برنامج المكافآت أمبر</li>
            </ul>
            <ul className="space-y-2"><li className="font-bold mb-3">موقع</li>
              <li>الإمارات العربية المتحدة - إنجليزي</li>
              <li>الإمارات العربية المتحدة - العربية</li>
              <li>الكويت - إنجليزي</li>
              <li>الكويت - العربية</li>
              <li>السعودية - إنجليزي</li>
              <li>السعودية - العربية</li>
            </ul></div>
            <div style={{
              marginTop:"100px"
            }}>
            <div className="flex items-center gap-2">
            <span>المواقع و اللغات</span>
            <span className="font-semibold">English 🇰🇼</span>
          </div>

          <div className="flex items-center gap-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Google Play"
              className="h-10"
            />
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="App Store"
              className="h-10"
            />
          </div></div>

          </div>

          <div>
            
            
          </div>
        </div>


{/* Languages, App Store, and Copyright */}
        <div className="mt-10 flex flex-col items-center gap-4">
          
          <p className="text-xs text-gray-400">
            © الطاير بلومينجديلز جميع الحقوق محفوظة 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;