import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../catalog/Catalog';
import Cookies from 'js-cookie';
import axios from 'axios';
const ProductPage = ({ addToCart }) => {
  const { id } = useParams();
  const productId = id
  // parseInt(id, 10);

  const [product, setProduct] = useState(null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const foundProduct = products.find(p => p.id === productId);
    setProduct(foundProduct || null);
  }, [productId]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAddToCart = async () => {
    if (product) {
      addToCart(product);
      const headers = {
        "Content-Type": "application/json"
      };
      const user_id = Cookies.get('api_key');
      let url = "https://projectprakticum-production.up.railway.app/api/v1/basket?user_id=" + user_id;
      const basket = await axios.get(url, { headers });
      if (basket.data == null) {
        url = "https://projectprakticum-production.up.railway.app/api/v1/basket?user_id=" + user_id;
        const basket_new = await axios.post(url,{ headers :headers });
        url = "https://projectprakticum-production.up.railway.app/api/v1/basketItem?good_id=" + id + "&goods_count=" + String(1) + "&basket_id=" + basket_new.data.id;
        const basket_item = await axios.post(url, {headers})
      } 
      else{
        url = "https://projectprakticum-production.up.railway.app/api/v1/basketItem?good_id=" + id + "&goods_count=" + String(1) + "&basket_id=" + basket.data.id;
        const basket_item = await axios.post(url, {headers})
      }
      setNotification('Товар добавлен в корзину!');
    }
  };

  if (!product) {
    return <div>Товар не найден</div>;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      padding: '15px',
      maxWidth: '900px',
      margin: '0 auto',
      gap: '20px',
    }}>
      <div style={{ flex: '1' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        />
      </div>

      <div style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}>
        <h2 style={{
          marginBottom: '10px',
          fontSize: '24px',
          fontWeight: '600',
          color: '#333',
        }}>
          {product.name}
        </h2>

        <div style={{
          marginBottom: '10px',
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
          }}>Описание</h3>
          <p style={{
            fontSize: '16px',
            color: '#666',
          }}>
            {product.description || 'Нет описания'}
          </p>
        </div>

        <div style={{
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '20px',
        }}>
          Цена: {product.price} ₽
        </div>

        <button
          onClick={handleAddToCart}
          style={{
            marginTop: '10px',
            padding: '10px 15px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
        >
          Добавить в корзину
        </button>

        {notification && (
          <div style={{
            position: 'fixed',
            top: '95px',
            right: '20px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            zIndex: '999',
          }}>
            {notification}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
