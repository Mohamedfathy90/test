
import BeautySection from '../components/BeautySection';
import FooterSection from '../components/FooterSection';
import ProductCards from '../components/ProductCards';
import { Link } from "react-router-dom";

function Home() {
  
    return (
      <div className="">
        <div className="w-full bg-black text-white text-center py-2.5 text-sm mb-4">
          جميع هذه العطور ستوكات من المخازن الخاصة بنا للحصول علي العطور مع الكارتون الخاص به والتغليف الكامل {" "}
          <Link
            to="https://bloomingdales.com.kw/search?q=%D8%A7%D9%84%D8%B9%D8%B7%D9%88%D8%B1&lang=ar_KW"
            className="text-white border-bottom font-medium transition"
          >
             من هنا 
          </Link>
        </div>
        <BeautySection />

        <ProductCards />
        <FooterSection />
      </div>
    );
  }
  
  export default Home;