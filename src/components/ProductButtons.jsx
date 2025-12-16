import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';

function ProductButtons({ onAddToCart }) {
  
  
  return (
    <div>
      <button className="btn btn-dark" onClick={ onAddToCart}
      style={{
        width:'100%',
        marginBottom:'10px'
      }}>
        <FontAwesomeIcon icon={faBagShopping} /><span> أضف للحقيبة</span>
      </button>
      <button className="btn btn-outline-dark" style={{
        width:'100%'
      }}>
        <FontAwesomeIcon icon={faHeart} /> أضف إلى قائمة الأمنيات
      </button>
    </div>
  );
}

export default ProductButtons;
