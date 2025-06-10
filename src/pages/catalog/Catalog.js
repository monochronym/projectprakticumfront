import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from "js-cookie";
  const headers = {
    "Content-Type": "application/json"
  };
  const url = "https://projectprakticum-production.up.railway.app/api/v1/goods/?goods_category_id=0";
  const api = await axios.get(url, { headers });
  export const products = api.data;
 products.forEach(function(item, i) {
  (async () => {
    item["image"] = `data:image/jpg;base64,${[item.image]}`;
  })();
});

const Catalog = ({ addToCart }) => {
  const [notification, setNotification] = useState('');
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAddToCart = async (product) => {
    addToCart(product);
    const headers = {
      "Content-Type": "application/json"
    };
    const user_id = Cookies.get('api_key');
    let url = "https://projectprakticum-production.up.railway.app/api/v1/basket?user_id=" + user_id;
    const basket = await axios.get(url, { headers });
    if (basket == null) {
      url = "https://projectprakticum-production.up.railway.app/api/v1/basket"
      const basket_new = await axios.post(url,{user_id:user_id}, { headers :headers });
      url = "https://projectprakticum-production.up.railway.app/api/v1/basketItem?good_id=" + product.id + "&goods_count=" + String(1) + "&basket_id=" + basket_new.data.id;
      const basket_item = await axios.post(url, {headers})
    }
    else{
      url = "https://projectprakticum-production.up.railway.app/api/v1/basketItem?good_id=" + product.id + "&goods_count=" + String(1) + "&basket_id=" + basket.data.id;
      const basket_item = await axios.post(url, {headers})
    }
    setNotification('Товар добавлен в корзину!');
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      backgroundColor: '#f0f2f5',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      fontSize: '28px',
      fontWeight: '1200',
      textAlign: 'center',
      marginBottom: '20px',
      color: '#333',
    },
    notification: {
      position: 'fixed',
      top: '90px',
      right: '20px',
      backgroundColor: '#4CAF50',
      color: '#fff',
      padding: '12px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      zIndex: 1000,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '30px',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s ease',
    },
    image: {
      width: '100%',
      height: '260px',
      objectFit: 'cover',
    },
    content: {
      padding: '20px',
      flexGrow: 1,
    },
    name: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '10px',
      color: '#333',
    },
    priceBlock: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '15px',
    },
    price: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#111',
    },
    oldPrice: {
      fontSize: '14px',
      color: '#999',
      textDecoration: 'line-through',
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#4CAF50',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    link: {
      textDecoration: 'none',
      color: 'inherit',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Каталог товаров</h2>
      {notification && <div style={styles.notification}>{notification}</div>}

      <div style={styles.grid}>
        {products.map((product) => (
          <div key={product.id} style={styles.card}>
            <Link to={`/product/${product.id}`} style={styles.link}>
              <img src={product.image} alt={product.name} style={styles.image} />
              <div style={styles.content}>
                <div style={styles.name}>{product.name}</div>
                <div style={styles.priceBlock}>
                  <div style={styles.price}>{product.price} ₽</div>
                  <div style={styles.oldPrice}>{product.oldPrice} ₽</div>
                </div>
              </div>
            </Link>
            <button
              style={styles.button}
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product);
              }}
            >
              Добавить в корзину
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;