
import BeautySection from '../components/BeautySection';
import Select from '../components/select';
import FooterSection from '../components/FooterSection';
import ProductCards from '../components/ProductCards';

function Home() {
  
    return (
      <div className=''>
       <BeautySection />
      <Select /> 
      <ProductCards />
      <FooterSection />
      
      </div>
    );
  }
  
  export default Home;