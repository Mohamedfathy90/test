import React from 'react';
import { Link } from 'react-router-dom';

function Favorites({ favorites }) {
  return (
    <div className="cards-container">
      {favorites.length === 0 ? (
        <p>لا يوجد عناصر مضافة إلى المفضلة.</p>
      ) : (
        favorites.map(product => {
          const imageSrc = Array.isArray(product.images) ? product.images[0] : product.images;
          return (
            <div key={product.id} className="card">
              <Link to={`/product/${product.id}`}>
                <img src={`/images/${imageSrc}`} alt={product.name} className="main-image" />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>{product.price} ل.س</p>
              </Link>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Favorites;
