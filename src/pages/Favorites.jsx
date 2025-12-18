import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/context';
import { useFavorites } from '../context/FavoritesContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const { updateFavoritesCount } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    // if (!user) {
    //   navigate('/login');
    //   return;
    // }
    fetchFavorites();
  }, [user, navigate]);

  const fetchFavorites = async () => {
    if (!user?.id) return;

    try {
      const response = await axios.get(
        `https://blomengdalis-tester.com/backend/get_favorites.php?user_id=${user.id}`
      );
      setFavorites(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (productId) => {
    try {
      await axios.post(
        'https://blomengdalis-tester.com/backend/toggle_favorite.php',
        {
          user_id: user.id,
          product_id: productId,
          action: 'remove'
        }
      );
      fetchFavorites();
      updateFavoritesCount();
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (!user) return null;
  if (loading) return <div>جاري تحميل المفضلة...</div>;

  return (
    <div className="container mt-4">
      <h2>المفضلة</h2>
      {!Array.isArray(favorites) || favorites.length === 0 ? (
        <p>لا يوجد عناصر مضافة إلى المفضلة.</p>
      ) : (
        <div className="cards-container">
          {favorites.map(product => (
            <div key={product.id} className="card1">
              <div className="image-container image-wrapper">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={`https://blomengdalis-tester.com/backend/uploads/${product.main_image}`}
                    alt={product.name}
                    style={{
                      height: "350px",
                      objectFit: "cover",
                      objectPosition: "center top",
                    }}
                  />
                </Link>
                <button 
                  className="favorite-btn"
                  onClick={() => removeFavorite(product.id)}
                >
                  <FontAwesomeIcon icon={faHeart} style={{color: 'red'}} />
                </button>
              </div>
              <div className="linkCard">
                <Link to={`/product/${product.id}`} className="aCard" style={{ paddingTop: "30px" }}>
                  {product.name}
                </Link>
                <a className="aCard" style={{ paddingBottom: "30px" }}>
                  {product.description}
                </a>
                <span className="khsom">خصومات</span>
                <span className="khsom">من {product.price_after} د.أ</span>
                <a className="Sali">
                  <span
                    style={{
                      textDecoration: "line-through",
                      color: " #888",
                      paddingLeft: "5px",
                    }}
                  >
                    {product.price_before} د.أ
                  </span>
                  <span style={{ color: " #000" }}>
                    {" "}
                    {product.discount_percent} %خصم
                  </span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
