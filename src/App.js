import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/main/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import ProductPage from './pages/product/ProductPage';
import Profile from './pages/profile/Profile';
import Favorites from './pages/favorites/Favorites';
import Cart from './pages/cart/Cart'; // убедитесь, что путь правильный
import Orders from './pages/orders/Orders';
import Catalog from './pages/catalog/Catalog';

import PaymentPage from './pages/payment/PaymentPage';

// Импорт компонента AddProduct (замените путь, если нужно)
import AddProduct from './pages/add/Add';

const App = () => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, count: item.count ? item.count + 1 : 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, count: 1 }];
      }
    });
  };

  return (
    <Router>
      <Header />

      <main style={{ minHeight: '80vh', padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Маршрут для страницы добавления товара */}
          <Route path="/add" element={<AddProduct />} />

          {/* Передача addToCart в ProductPage */}
          <Route path="/product/:id" element={<ProductPage addToCart={addToCart} />} />

          {/* Передача корзины в Cart */}
          <Route path="/cart" element={<Cart items={cartItems} />} />

          {/* Передача addToCart в Catalog */}
          <Route path="/catalog" element={<Catalog addToCart={addToCart} />} />

          {/* Другие маршруты */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
};

export default App;